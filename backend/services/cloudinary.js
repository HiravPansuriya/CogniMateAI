import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

export const uploadToCloudinary = async (filePath) => {
  try {
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
    const uploadPreset = (process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default").trim();

    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]);
    
    formData.append("file", blob);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary API Error:", result);
      throw new Error(result.error ? result.error.message : "Upload failed");
    }

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default cloudinary;
