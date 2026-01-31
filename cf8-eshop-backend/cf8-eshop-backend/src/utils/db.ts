import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI; 
        
        if (!dbURI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }
        
        await mongoose.connect(dbURI);
        console.log(' MongoDB connected successfully to:', dbURI);
    } catch (err) {
        console.error(" MongoDB connection error:", err);
        process.exit(1);
    }
}