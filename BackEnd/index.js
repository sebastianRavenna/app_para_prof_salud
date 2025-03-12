import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import { connectDB } from './config/connectDB.js';
import { userRoutes } from './routes/userRoutes.js';
import { appointmentRoutes } from './routes/appointmentRoutes.js';
import { articleRoutes } from './routes/articleRoutes.js';
import { sendReminders } from './controllers/appointmentController.js';
import { clinicalHistoryRouter } from './routes/clinicalHistoryRoutes.js';


dotenv.config();

/* process.loadEnvFile(); */

const PORT = process.env.PORT || 3000;
const app = express();
const LOCAL_HOST = process.env.LOCAL_HOST

connectDB();

app.use(
  cors({
    origin: LOCAL_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/clinical-history", clinicalHistoryRouter);

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.get("/test-db", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    
    // Verificar si mongoose ya está conectado
    const mongooseInstance = mongoose.default || mongoose;
    
    if (!mongooseInstance.connection || mongooseInstance.connection.readyState !== 1) {
      const URI_DB = process.env.URI_DB;
      await mongooseInstance.connect(URI_DB);
    }
    
    // Verificar la conexión
    await mongooseInstance.connection.db.command({ ping: 1 });
    res.send("✅ Conectado a MongoDB!");
  } catch (error) {
    console.error("Error en /test-db:", error);
    res.status(500).send(`❌ No se pudo conectar a MongoDB: ${error.message}`);
  }
});

app.listen(PORT, () => {
    console.log('Server is running');
})

export default app;