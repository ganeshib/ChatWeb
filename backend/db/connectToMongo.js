import moongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        await moongoose.connect(process.env.MONGODBURI);
        console.log('Connected to DB');
    } catch (error) {
        console.log('Error in connecting To DB', error.message);
    }
};

export default connectToMongoDB;
