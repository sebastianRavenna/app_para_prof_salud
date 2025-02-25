import express from 'express';
import cors from 'cors';
import { connectDB } from './config/connectDB.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { userRoutes } from './routes/userRoutes.js';
import { appointmentRoutes } from './routes/appointmentRoutes.js';
import { articleRoutes } from './routes/articleRoutes.js';
import { sendReminders } from './controllers/appointmentController.js'
import { clinicalHistoryRouter } from './routes/clinicalHistoryRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

/* process.loadEnvFile(); */

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(
  session({
    secret: "supersecreto", // Clave para cifrar la sesión
    resave: false, // No guarda la sesión si no se modifica
    saveUninitialized: true, // No crea sesiones vacías
    store: MongoStore.create({
    mongoUrl: process.env.URI_DB,
    collectionName: "sessions",
    }),
    cookie: { 
      secure: true,  
      httpOnly: true, 
      sameSite: "lax", 
      maxAge: 86400000,
/*       domain: 'localhost',
      path: '/'
 */    }, 
  })
);

app.use(
    cors({
      origin: "*" /* [
        "http://localhost:5173", // Solo permite tu frontend 
        "https://consultorio-fullstack.vercel.app",
        "https://consultorio-fullstack-shw3.vercel.app/",  
    ] */,
      credentials: true, // Permite enviar cookies y headers de autenticación
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use((req, res, next) => { next() });

setInterval(() => {
    sendReminders();
  }, 24 * 60 * 60 * 1000); // Ejecuta cada 24 horas

app.use('/api/users', userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/clinical-history", clinicalHistoryRouter);

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.get("/test-db", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send("❌ MongoDB no está conectado.");
    }

    const result = await mongoose.connection.db.admin().ping();
    console.log("Ping result:", result);
    res.send("✅ Conectado a MongoDB!");
  } catch (error) {
    console.error("Error en /test-db:", error);
    res.status(500).send("❌ No se pudo conectar a MongoDB");
  }
});

app.listen(PORT, () => {
    console.log('Server is running');
})