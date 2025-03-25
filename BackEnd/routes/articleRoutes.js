import express from 'express';
import { 
  getAllArticles, 
  getArticleById,
  createArticle, 
  updateArticle, 
  deleteArticle,
  getImage,
  upload
} from '../controllers/articleController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const articleRoutes = express.Router();

// Ruta para obtener todos los artículos
articleRoutes.get("/", getAllArticles);

// Ruta para obtener un artículo por ID
articleRoutes.get("/:id", getArticleById);

// Ruta para obtener una imagen por nombre de archivo
articleRoutes.get("/image/:filename", getImage);

// Ruta para crear un artículo
articleRoutes.post("/", authMiddleware, adminMiddleware, upload.single("image"), createArticle);

// Ruta para modificar un artículo
articleRoutes.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateArticle);

// Ruta para eliminar un artículo
articleRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteArticle);

export { articleRoutes };