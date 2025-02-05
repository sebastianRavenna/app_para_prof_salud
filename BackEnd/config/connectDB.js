import mongoose from "mongoose";

process.loadEnvFile ();

const URI_DB = process.env.URI_DB;

const connectDB = async () => {
    try{
        await mongoose.connect(URI_DB);
        console.log("Database connected");
    } catch (error) {
        console.error(error);
    }
};

export { connectDB };