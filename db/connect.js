import mongoose from "mongoose";

export const connectDB = (url) => {
    return mongoose.connect(url)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));
}