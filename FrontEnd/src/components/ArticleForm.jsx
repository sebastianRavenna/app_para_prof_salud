import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Editor } from "@tinymce/tinymce-react";

const API_URL = import.meta.env.VITE_BACKEND_BASEURL;
const API_KEY_TINYMCE = import.meta.env.VITE_API_KEY_TINYMCE;

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useContext(AuthContext);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [imagePosition, setImagePosition] = useState("top");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Efecto para crear URL de vista previa cuando se selecciona una nueva imagen
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);
      
      // Limpiar URL cuando el componente se desmonte
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/articles/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
      setImagePosition(response.data.imagePosition || "top");
      
      // Si el artículo tiene una imagen, mostrarla
      if (response.data.image && response.data.image.url) {
        setCurrentImage(`${API_URL}${response.data.image.url}`);
      }
    } catch (error) {
      console.error("Error al cargar artículo", error);
      setError("No se pudo cargar el artículo");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!token) {
      setError("No se encontró el token de autenticación");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("imagePosition", imagePosition);
    if (image) formData.append("image", image);
    
    try {
      const config = {
        headers: { 
          "Authorization": `Bearer ${token}`,
          // No es necesario configurar "Content-Type" para FormData, Axios lo hace automáticamente
        }
      };
      
      let response;
      if (id) {
        response = await axios.put(`${API_URL}/api/articles/${id}`, formData, config);
      } else {
        response = await axios.post(`${API_URL}/api/articles`, formData, config);
      }
      
      setLoading(false);
      navigate("/articles");
    } catch (error) {
      setLoading(false);
      console.error("Error al guardar el artículo:", error);
      
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Estado HTTP:", error.response.status);
        
        if (error.response.status === 401 && error.response.data.message === "Token Expirado") {
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          logout();
        } else {
          setError(`Error ${error.response.status}: ${error.response.data.message || "No se pudo guardar el artículo"}`);
        }
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (file && !allowedTypes.includes(file.type)) {
      setError("Tipo de archivo no soportado. Solo se permiten imágenes (JPG, PNG, GIF, WEBP).");
      e.target.value = null;
      return;
    }
    
    // Validar tamaño del archivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSize) {
      setError("El archivo es demasiado grande. El tamaño máximo permitido es 5MB.");
      e.target.value = null;
      return;
    }
    
    setImage(file);
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="container">
          <div className="notification is-warning">
            <p>Debes iniciar sesión para publicar artículos.</p>
            <button 
              className="button is-primary mt-3" 
              onClick={() => navigate("/login")}
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <h1 className="title">{id ? "Editar Artículo" : "Nuevo Artículo"}</h1>
        
        {error && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setError("")}></button>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Título</label>
            <div className="control">
              <input 
                className="input" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Contenido</label>
            <Editor
              apiKey={API_KEY_TINYMCE}
              value={content}
              onEditorChange={(newContent) => {
                setContent(newContent);
              }}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
              }}
            />
          </div>

          <div className="field">
            <label className="label">Imagen</label>
            
            {/* Mostrar imagen actual si existe */}
            {currentImage && !imagePreview && (
              <div className="mb-4">
                <p className="mb-2">Imagen actual:</p>
                <img 
                  src={currentImage} 
                  alt="Imagen actual" 
                  style={{ maxWidth: '300px', maxHeight: '200px' }}
                  className="image mb-2"
                />
                <p className="help">Sube una nueva imagen para reemplazar la actual</p>
              </div>
            )}
            
            {/* Vista previa de la nueva imagen seleccionada */}
            {imagePreview && (
              <div className="mb-4">
                <p className="mb-2">Vista previa:</p>
                <img 
                  src={imagePreview} 
                  alt="Vista previa" 
                  style={{ maxWidth: '300px', maxHeight: '200px' }}
                  className="image mb-2"
                />
              </div>
            )}
            
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input 
                  className="file-input" 
                  type="file" 
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    Seleccionar archivo
                  </span>
                </span>
                <span className="file-name">
                  {image ? image.name : "Ningún archivo seleccionado"}
                </span>
              </label>
            </div>
            <p className="help">Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB</p>
          </div>

          <div className="field">
            <label className="label">Posición de la imagen</label>
            <div className="control">
              <div className="select">
                <select value={imagePosition} onChange={(e) => setImagePosition(e.target.value)}>
                  <option value="top">Arriba</option>
                  <option value="left">Izquierda</option>
                  <option value="right">Derecha</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button 
                type="submit" 
                className={`button is-primary ${loading ? 'is-loading' : ''}`}
                disabled={loading}
              >
                {id ? "Actualizar" : "Publicar"}
              </button>
            </div>
            <div className="control">
              <button 
                type="button" 
                className="button is-light"
                onClick={() => navigate("/articles")}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export { ArticleForm };