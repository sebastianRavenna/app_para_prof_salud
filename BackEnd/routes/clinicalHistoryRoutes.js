import express from 'express';
import { getClinicalHistory, addNote, editNote, removeNote } from '../controllers/clinicalHistoryController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const clinicalHistoryRouter = express.Router();

// Ruta para obtener la historia clínica de un paciente
clinicalHistoryRouter.get("/:id", adminMiddleware, getClinicalHistory);

// Ruta para agregar una nota a la historia clínica de un paciente
clinicalHistoryRouter.post("/:id/note", adminMiddleware, addNote);

// Ruta para editar una nota de la historia clínica de un paciente
clinicalHistoryRouter.put("/:id/note/:noteId", adminMiddleware, editNote);

// Ruta para eliminar una nota de la historia clínica de un paciente
clinicalHistoryRouter.delete("/:id/note/:noteId", adminMiddleware, removeNote);

export { clinicalHistoryRouter }