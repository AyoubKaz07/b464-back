import mongoose from "mongoose";

export const connectDB = async (url) => {
    return await mongoose.connect(url);
}