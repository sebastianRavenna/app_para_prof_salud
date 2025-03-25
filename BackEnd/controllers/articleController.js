import { Article } from "../models/articleModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Configuración de multer para almacenamiento de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads/articles');

// Crear directorio de uploads si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para almacenar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
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
  // Aceptar solo imágenes
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes (JPG, PNG, GIF, WEBP).'), false);
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

// Obtener todos los artículos
const getAllArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || null; // Si no se especifica, traerá todos los artículos
    
    const query = Article.find().sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    const articles = await query;
    res.json(articles);
  } catch (error) {
    console.error("Error al obtener artículos:", error);
    res.status(500).json({ message: "Error al obtener artículos" });
  }
};

// Obtener un artículo por ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error al obtener artículo:", error);
    res.status(500).json({ message: "Error al obtener artículo" });
  }
};

// Crear un artículo
const createArticle = async (req, res) => {
  try {
    const { title, content, imagePosition } = req.body;
    
    const newArticle = new Article({
      title,
      content,
      imagePosition: imagePosition || "top",
      author: req.user.id
    });
    
    // Si hay un archivo subido, guardar la información en el artículo
    if (req.file) {
      // Crear la URL para acceder al archivo
      const imageUrl = `/api/articles/image/${req.file.filename}`;
      
      newArticle.image = {
        filename: req.file.originalname,
        path: req.file.path,
        url: imageUrl,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }
    
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error al crear artículo:", error);
    res.status(500).json({ message: "Error al crear artículo" });
  }
};

// Actualizar un artículo
const updateArticle = async (req, res) => {
  try {
    const { title, content, imagePosition } = req.body;
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    
    // Actualizar los campos del artículo
    article.title = title;
    article.content = content;
    article.imagePosition = imagePosition || article.imagePosition;
    
    // Si hay un archivo nuevo, eliminar el antiguo si existe y guardar el nuevo
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (article.image && article.image.path) {
        fs.unlink(article.image.path, (err) => {
          if (err) {
            console.error("Error al eliminar imagen previa:", err);
          }
        });
      }
      
      // Crear la URL para acceder al archivo
      const imageUrl = `/api/articles/image/${req.file.filename}`;
      
      article.image = {
        filename: req.file.originalname,
        path: req.file.path,
        url: imageUrl,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }
    
    await article.save();
    res.json(article);
  } catch (error) {
    console.error("Error al actualizar artículo:", error);
    res.status(500).json({ message: "Error al actualizar artículo" });
  }
};

// Eliminar un artículo
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    
    // Eliminar la imagen asociada si existe
    if (article.image && article.image.path) {
      fs.unlink(article.image.path, (err) => {
        if (err) {
          console.error("Error al eliminar imagen:", err);
        }
      });
    }
    
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar artículo:", error);
    res.status(500).json({ message: "Error al eliminar artículo" });
  }
};

// Obtener una imagen por nombre de archivo
const getImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(uploadsDir, filename);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    
    // Enviar el archivo
    res.sendFile(path.resolve(imagePath));
  } catch (error) {
    console.error("Error al obtener imagen:", error);
    res.status(500).json({ message: "Error al obtener imagen" });
  }
};

export {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getImage,
  upload
};