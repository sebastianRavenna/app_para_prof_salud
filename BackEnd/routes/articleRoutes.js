import express from 'express';
import authMiddleware from '../middleware/authMiddleware';

const articleRouter = express.Router();

articleRouter.post("/create", authMiddleware, (req, res) => {
  res.json({ message: "Artículo creado con éxito" });
});

export { articleRouter }