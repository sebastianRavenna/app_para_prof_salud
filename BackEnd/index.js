import express from 'express';
/* import cors from 'cors'; */
import { connectDB } from './config/connectDB.js'
import { userRoutes } from './routes/userRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

process.loadEnvFile();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
/* app.use(cors()); */

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

app.use('/api/users', userRoutes);
/*app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
 */

app.listen(PORT, () => {
    console.log('Server is running');
    connectDB();
})