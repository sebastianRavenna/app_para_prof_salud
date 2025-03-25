import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Layout } from "./Layout";
import { ArticleDisplay } from "./ArticleDisplay";

const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchArticles();
  }, []);
  
  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/articles`);
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar artículos:", error);
      setError("No se pudieron cargar los artículos");
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      // Actualizar la lista de artículos
      setArticles(articles.filter(article => article._id !== id));
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      setError("No se pudo eliminar el artículo");
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="has-text-centered">
            <p>Cargando artículos...</p>
            <progress className="progress is-primary" max="100"></progress>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <>
      <div className="container">
        <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
          <h1 className="title">Artículos</h1>
          
          {isAuthenticated && user && user.role === "admin" && (
            <Link to="/articles/new" className="button is-primary">
              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>
              <span>Nuevo Artículo</span>
            </Link>
          )}
        </div>
        
        {error && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setError("")}></button>
            {error}
          </div>
        )}
        
        {articles.length === 0 ? (
          <div className="notification is-info">
            No hay artículos publicados. {isAuthenticated && user && user.role === "admin" && "¡Sé el primero en crear uno!"}
          </div>
        ) : (
          <div className="articles-list">
            {articles.map(article => (
              <div key={article._id} className="mb-5">
                <ArticleDisplay article={article} isPreview={true} />
                
                {isAuthenticated && user && user.role === "admin" && (
                  <div className="buttons is-right mt-2">
                    <Link to={`/articles/edit/${article._id}`} className="button is-small is-info">
                      <span className="icon">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span>Editar</span>
                    </Link>
                    <button
                      className="button is-small is-danger"
                      onClick={() => handleDelete(article._id)}
                    >
                      <span className="icon">
                        <i className="fas fa-trash-alt"></i>
                      </span>
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export { ArticlesList };