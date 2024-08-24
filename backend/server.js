import path from 'path'
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectToMongoDB from './db/connectToMongo.js';
import messageRoutes from './routes/message.routes.js'
import cookiePareser from 'cookie-parser'
import userRoutes from './routes/user.routes.js'
import cors from "cors"
import {app,server} from './socket/socket.js'

dotenv.config();

const PORT = process.env.PORT || 5000;

const __dirname=path.resolve();

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  }));
  
app.use(express.json());
app.use(cookiePareser());

app.use('/api/auth', authRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/users',userRoutes);

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`listing on port ${PORT}`);
}); 
