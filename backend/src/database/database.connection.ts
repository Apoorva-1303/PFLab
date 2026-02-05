import mongoose from "mongoose";

const connectDatabase = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("Database Connected Successfully.");
    }
    catch(error){
        console.log('Error while connecting to database', error);
    }
};


export default connectDatabase;