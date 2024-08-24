import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser=async(req,res)=>{
    try{
        const {fullName,username,password,confirmPassword,gender}=req.body;
        if(password!==confirmPassword){
            return res.status(404).json({error:"Password doesnt match"})
        }   
        const user=await User.findOne({username})
        if(user){
            return res.status(404).json({error:"Username already exists"});
        }


        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`
        
        const newUser=new User({
            fullName:fullName,
            username:username,
            password:hashedPassword,
            gender,
            profilePic:(gender=="male")?boyProfilePic:girlProfilePic 
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic
            })
        }
    }catch(error){
        console.log("Error in signing up controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}


export const loginUser=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username})
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        });
    }catch(error){
        console.log("Error in loggin in",error.message)
        res.status(404).json({error:"internal server error"});
    }
}

export const logoutUser=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"})
    }catch(error){
        console.log("Error in logout contoller",error.message)
        res.status(400).json({error:"Internal server Error"})
    }
}


