import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ Carga las variables de entorno del archivo .env
/* process.loadEnvFile (); */

const URI_DB = process.env.URI_DB;

const connectDB = async () => {
    try{
        await mongoose.connect(URI_DB);
        console.log("Conectado a MongoDB Atlas 🚀", mongoose.connection.name);
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1); // 🚨 Cerrar la app si la conexión falla
        /* console.error(error); */
    }
};

export { connectDB };