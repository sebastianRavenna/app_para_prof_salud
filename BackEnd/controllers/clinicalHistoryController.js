import { ClinicalHistory } from "../models/clinicalHistoryModel.js";
import { User } from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Configuración de multer para almacenamiento de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Crear directorio de uploads si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para almacenar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crear un directorio específico para cada paciente
    const patientDir = path.join(uploadsDir, req.params.id);
    if (!fs.existsSync(patientDir)) {
      fs.mkdirSync(patientDir, { recursive: true });
    }
    cb(null, patientDir);
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Función para filtrar archivos por tipo
const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes y PDFs
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes (JPG, PNG, GIF) y documentos PDF.'), false);
  }
};

// Configurar multer con límite de tamaño
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Funciones de controlador existentes
const getClinicalHistory = async (req, res) => {
  try {
    const history = await ClinicalHistory.findOne({ user: req.params.id });
    
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    
    if (!history) return res.status(404).json({ msg: "Historia clínica no encontrada" });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la historia clínica");
  }
};

const addNote = async (req, res) => {
  const { note } = req.body;
  try {
    let history = await ClinicalHistory.findOne({ user: req.params.id });
    if (!history) {
      history = new ClinicalHistory({ user: req.params.id });
    }
    history.notes.push({ note });
    await history.save();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar la nota");
  }
};

const editNote = async (req, res) => {
  const { noteId } = req.params;
  const { note } = req.body;
  
  try {
    const history = await ClinicalHistory.findOne({ user: req.params.id });
    
    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }
    
    const noteIndex = history.notes.findIndex(n => n._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    
    history.notes[noteIndex].note = note;
    await history.save();
    
    res.status(200).json({ message: "Nota actualizada correctamente", updatedNote: history.notes[noteIndex] });
  } catch (error) {
    console.error("❌ Error al editar la nota:", error);
    res.status(500).json({ message: "Error al editar la nota" });
  }
};

const removeNote = async (req, res) => {
  const { noteId } = req.params;
  
  try {
    const history = await ClinicalHistory.findOne({ user: req.params.id });
    
    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }
    
    const noteIndex = history.notes.findIndex(n => n._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    
    history.notes.splice(noteIndex, 1);
    await history.save();
    
    res.status(200).json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar la nota:", error);
    res.status(500).json({ message: "Error al eliminar la nota" });
  }
};

// Nuevas funciones para manejar archivos
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha proporcionado ningún archivo" });
    }

    let history = await ClinicalHistory.findOne({ user: req.params.id });
    if (!history) {
      history = new ClinicalHistory({ user: req.params.id });
    }

    // Crear la URL para acceder al archivo
    const fileUrl = `/api/clinical-history/${req.params.id}/files/${req.file.filename}`;
    
    // Agregar el archivo a la historia clínica
    history.files.push({
      filename: req.file.originalname,
      path: req.file.path,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date()
    });
    
    await history.save();
    
    res.status(200).json({
      message: "Archivo subido correctamente",
      file: history.files[history.files.length - 1]
    });
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    res.status(500).json({ message: "Error al subir archivo" });
  }
};

const getFiles = async (req, res) => {
  try {
    const history = await ClinicalHistory.findOne({ user: req.params.id });
    
    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }
    
    res.status(200).json(history.files);
  } catch (error) {
    console.error("❌ Error al obtener archivos:", error);
    res.status(500).json({ message: "Error al obtener archivos" });
  }
};

const getFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const history = await ClinicalHistory.findOne({ user: id });
    
    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }
    
    const file = history.files.find(f => f.path.includes(filename));
    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    
    // Enviar el archivo
    res.sendFile(path.resolve(file.path));
  } catch (error) {
    console.error("❌ Error al obtener archivo:", error);
    res.status(500).json({ message: "Error al obtener archivo" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const history = await ClinicalHistory.findOne({ user: id });
    
    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }
    
    const fileIndex = history.files.findIndex(f => f._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    
    const file = history.files[fileIndex];
    
    // Eliminar el archivo del sistema de archivos
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("❌ Error al eliminar archivo del sistema:", err);
      }
    });
    
    // Eliminar el archivo de la base de datos
    history.files.splice(fileIndex, 1);
    await history.save();
    
    res.status(200).json({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).json({ message: "Error al eliminar archivo" });
  }
};

export {
  getClinicalHistory,
  addNote,
  editNote,
  removeNote,
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  upload
};