import express from 'express';
import { 
    getClinicalHistory, 
    addNote, 
    editNote, 
    removeNote,
    uploadFile,
    getFiles,
    getFile,
    deleteFile,
    upload 
} from '../controllers/clinicalHistoryController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const clinicalHistoryRouter = express.Router();

// Ruta para obtener la historia clínica de un paciente
clinicalHistoryRouter.get("/:id", authMiddleware, adminMiddleware, getClinicalHistory);

// Ruta para agregar una nota a la historia clínica de un paciente
clinicalHistoryRouter.post("/:id/note", authMiddleware, adminMiddleware, addNote);

// Ruta para editar una nota de la historia clínica de un paciente
clinicalHistoryRouter.put("/:id/note/:noteId", authMiddleware, adminMiddleware, editNote);

// Ruta para eliminar una nota de la historia clínica de un paciente
clinicalHistoryRouter.delete("/:id/note/:noteId", authMiddleware, adminMiddleware, removeNote);

// Ruta para agregar un archivo en la historia clínica de un paciente
clinicalHistoryRouter.post('/:id/files', upload.single('file'), uploadFile);

// Ruta para obterner los archivo en la historia clínica de un paciente
clinicalHistoryRouter.get('/:id/files', authMiddleware, getFiles);

// Ruta para obtener un solo archivo en la historia clínica de un paciente
clinicalHistoryRouter.get('/:id/files/:filename', getFile); // Sin verificación de token para permitir cargar archivos en la vista

// Ruta para eliminar un archivo en la historia clínica de un paciente
clinicalHistoryRouter.delete('/:id/files/:fileId', authMiddleware, deleteFile);

export { clinicalHistoryRouter }