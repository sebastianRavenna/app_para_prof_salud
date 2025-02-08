import { Article } from "../models/articleModel.js";

// 📌 Obtener todos los artículos (público)
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener artículos" });
  }
};

// 📌 Crear un nuevo artículo (solo admin)
const createArticle = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    const { title, content, imageUrl } = req.body;
    const newArticle = new Article({ title, content, imageUrl });

    await newArticle.save();
    res.status(201).json({ message: "Artículo creado", article: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Error al crear artículo" });
  }
};

// 📌 Editar un artículo (solo admin)
const updateArticle = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    const { title, content, imageUrl } = req.body;
    const article = await Article.findByIdAndUpdate(req.params.id, { title, content, imageUrl }, { new: true });

    if (!article) return res.status(404).json({ message: "Artículo no encontrado" });

    res.json({ message: "Artículo actualizado", article });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar artículo" });
  }
};

// 📌 Eliminar un artículo (solo admin)
const deleteArticle = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Artículo no encontrado" });

    res.json({ message: "Artículo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar artículo" });
  }
};

export { 
    getAllArticles, 
    createArticle, 
    updateArticle, 
    deleteArticle 
};
