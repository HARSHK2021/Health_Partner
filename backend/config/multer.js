import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js"; // Import Cloudinary config

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "medical_reports", // Folder in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "pdf"], // Allowed file formats
    },
});

const upload = multer({ storage });

export default upload;
