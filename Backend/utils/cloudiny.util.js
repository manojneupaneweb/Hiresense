import fs from 'fs';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'dmapisaup',
    api_key: '157722841297896',
    api_secret: 'EzViRWuYrlduRDQqXc9I8HDlUVk',
    secure: true,
});




const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        fs.unlinkSync(localFilePath);  
        console.log("Upload successful");
        return response.secure_url; 
    } catch (error) {
        console.log("Error uploading to Cloudinary:", error.message);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary Delete Result:', result);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Error deleting image from Cloudinary');
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };