import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    console.log('backend / database / connectDB / Attempting to connect to MongoDB');
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log('backend / database / connectDB / Connecting to:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        await mongoose.connect(mongoURI);
        console.log('backend / database / connectDB / MongoDB connected successfully');
    } catch (error) {
        console.error('backend / database / connectDB / MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
