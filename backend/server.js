import express from 'express';
import dotenv from 'dotenv';
import authroutes from './routes/auth.routes.js';
import connectToMongoDB from './db/connectToMongo.js';
import messageRoutes from './routes/message.routes.js'
import cookiePareser from 'cookie-parser'
import userRoutes from './routes/user.routes.js'
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookiePareser());

app.use('/api/auth', authroutes);
app.use('/api/messages',messageRoutes);
app.use('/api/users',userRoutes);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`listing on port ${PORT}`);
});
