import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
  getAllArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from '../controllers/articleController.js';

const articleRoutes = express.Router();

articleRoutes.get("/", getAllArticles);
articleRoutes.post("/", authMiddleware, createArticle);
articleRoutes.put("/:id", authMiddleware, updateArticle);
articleRoutes.delete("/:id", authMiddleware, deleteArticle);


export { articleRoutes }