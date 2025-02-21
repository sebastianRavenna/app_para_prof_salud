import mongoose from "mongoose";

process.loadEnvFile ();

const URI_DB = process.env.URI_DB;

const connectDB = async () => {
    try{
        await mongoose.connect(URI_DB);
        console.log("Conectado a MongoDB Atlas 🚀", mongoose.connection.name);
    } catch (error) {
        console.error(error);
    }
};

export { connectDB };