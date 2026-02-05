import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const deleteLocalFile = (filePath: string) => {
    try{
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
    }
    catch(error){
        console.log("Error deleting local file", error);
    }
}

const uploadToCloudinary = async (localFilePath: string, options = {}) => {
    if(!localFilePath){
        throw new Error("Local file path is required");
    }

    try {
        
        const response = await cloudinary.uploader.upload(localFilePath, options);
        deleteLocalFile(localFilePath);
        return response;

    } catch (error) {
        deleteLocalFile(localFilePath);
        throw error;
    }
};

export default uploadToCloudinary;