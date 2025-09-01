import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDENIRAY_cloud_name,
    api_key: process.env.CLOUDENIRAY_api_key,
    api_secret: process.env.CLOUDENIRAY_api_secret,
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