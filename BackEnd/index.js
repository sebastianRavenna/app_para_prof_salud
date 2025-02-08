import express from 'express';
import cors from 'cors';
import { connectDB } from './config/connectDB.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { userRoutes } from './routes/userRoutes.js';
import { appointmentRoutes } from './routes/appointmentRoutes.js';
import { articleRoutes } from './routes/articleRoutes.js';
import { sendReminders } from './controllers/appointmentController.js'
process.loadEnvFile();


const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173", // Solo permite tu frontend
      credentials: true, // Permite enviar cookies y headers de autenticación
    })
  );

app.use(
    session({
        secret: "supersecreto", // Clave para cifrar la sesión
        resave: false, // No guarda la sesión si no se modifica
        saveUninitialized: false, // No crea sesiones vacías
        store: MongoStore.create({
        mongoUrl: process.env.URI_DB,
        collectionName: "sessions",
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Expira en 24 horas
    })
);

setInterval(() => {
    sendReminders();
  }, 24 * 60 * 60 * 1000); // Ejecuta cada 24 horas

app.use('/api/users', userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/articles", articleRoutes);



app.listen(PORT, () => {
    console.log('Server is running');
    connectDB();
})