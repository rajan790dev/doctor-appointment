// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL, // yeh kaam karega agar tumne pura CLOUDINARY_URL dala hai
});

export default cloudinary;
