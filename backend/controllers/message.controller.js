import Conversation from "../models/conversation.model.js";
import Message from '../models/message.model.js'
import { getReceiverSocketId } from "../socket/socket.js";

export const sendMessage=async(req,res)=>{
    try {
        const {message}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]},
        })
        
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId],
            })
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            message,
        })
        if(newMessage){
            conversation.message.push(newMessage._id)
        }

        await Promise.all([conversation.save(),newMessage.save()])

        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        console.log("message sent",req.params.id)
        res.status(200).json({newMessage});
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}

export const getMessage=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;

        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]},
        }).populate("message");

        if(!conversation) return res.status(200).json([]);
        const messages=conversation.message;
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}