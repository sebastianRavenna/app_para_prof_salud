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

const API_URL = "https://consultorio-fullstack.vercel.app/";
const PORT = process.env.PORT || 3000;
const app = express();

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
      secure: process.env.NODE_ENV === "production",  
      httpOnly: true, 
      sameSite: "none", 
      maxAge: 86400000,
/*       domain: 'localhost',
      path: '/'
 */    }, 
  })
);

app.use(
    cors({
      origin: [
        /* "http://localhost:5173", // Solo permite tu frontend */
        "https://consultorio-fullstack.vercel.app",
        "https://consultorio-fullstack-shw3.vercel.app/",  
    ],
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



app.listen(PORT, () => {
    console.log('Server is running');
    connectDB();
})