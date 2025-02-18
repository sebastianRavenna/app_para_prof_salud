import express from 'express';
import { getClinicalHistory, addNote } from '../controllers/clinicalHistoryController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const clinicalHistoryRouter = express.Router();

// Ruta para obtener la historia clínica de un paciente
clinicalHistoryRouter.get("/:id", adminMiddleware, getClinicalHistory);

// Ruta para agregar una nota a la historia clínica de un paciente
clinicalHistoryRouter.post("/:id/note", adminMiddleware, addNote);

export { clinicalHistoryRouter }