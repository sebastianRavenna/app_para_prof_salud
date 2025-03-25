import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Layout } from "./Layout";
import { ArticleDisplay } from "./ArticleDisplay";

const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchArticle();
  }, [id]);
  
  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/articles/${id}`);
      setArticle(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar el artículo:", error);
      setError("No se pudo cargar el artículo");
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      navigate("/articles");
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
            <p>Cargando artículo...</p>
            <progress className="progress is-primary" max="100"></progress>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container">
          <div className="notification is-danger">
            {error}
          </div>
          <Link to="/articles" className="button is-primary">
            Volver a artículos
          </Link>
        </div>
      </Layout>
    );
  }
  
  if (!article) {
    return (
      <Layout>
        <div className="container">
          <div className="notification is-warning">
            El artículo no existe o ha sido eliminado.
          </div>
          <Link to="/articles" className="button is-primary">
            Volver a artículos
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/articles">Artículos</Link></li>
            <li className="is-active"><a href="#" aria-current="page">{article.title}</a></li>
          </ul>
        </nav>
        
        <ArticleDisplay article={article} />
        
        <div className="buttons mt-5">
          <Link to="/articles" className="button">
            Volver a artículos
          </Link>
          
          {isAuthenticated && user && user.role === "admin" && (
            <>
              <Link to={`/articles/edit/${article._id}`} className="button is-info">
                <span className="icon">
                  <i className="fas fa-edit"></i>
                </span>
                <span>Editar</span>
              </Link>
              <button className="button is-danger" onClick={handleDelete}>
                <span className="icon">
                  <i className="fas fa-trash-alt"></i>
                </span>
                <span>Eliminar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export { ArticleDetail };