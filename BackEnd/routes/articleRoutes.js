import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  getAllArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from '../controllers/articleController';

const articleRouter = express.Router();

articleRouter.get("/", getAllArticles);
articleRouter.post("/", authMiddleware, createArticle);
articleRouter.put("/:id", authMiddleware, updateArticle);
articleRouter.delete("/:id", authMiddleware, deleteArticle);


export { articleRouter }