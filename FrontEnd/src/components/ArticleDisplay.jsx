import { Link } from "react-router-dom";
import createDOMPurify from 'dompurify';

const ArticleDisplay = ({ article, isPreview = false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_BASEURL;
  
  const DOMPurify = createDOMPurify(window);
  
  // Función para renderizar la imagen si existe
  const renderImage = () => {
    if (article.image && article.image.url) {
      return (
        <figure className="image">
          <img 
            src={`${API_URL}${article.image.url}`} 
            alt={article.title} 
            style={{ maxHeight: isPreview ? "200px" : "400px", objectFit: "contain" }}
          />
        </figure>
      );
    }
    return null;
  };

  // Sanitizar el contenido HTML
  const sanitizedContent = DOMPurify.sanitize(article.content);
  
  // Versión corta del contenido para previews
  const getPreviewContent = () => {
    // Crear un elemento temporal para eliminar las etiquetas HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedContent;
    const textContent = tempDiv.textContent || tempDiv.innerText;
    
    // Limitar a 150 caracteres
    return textContent.length > 150 
      ? textContent.substring(0, 150) + "..." 
      : textContent;
  };

  // Renderizado basado en la posición de la imagen
  const renderArticleContent = () => {
    if (isPreview) {
      return (
        <div className="content">
          <h2 className="title is-4">
            <Link to={`/articles/${article._id}`}>{article.title}</Link>
          </h2>
          {article.imagePosition === "top" && renderImage()}
          <p>{getPreviewContent()}</p>
          <Link to={`/articles/${article._id}`} className="button is-small is-link">
            Leer más
          </Link>
        </div>
      );
    }

    switch (article.imagePosition) {
      case "left":
        return (
          <div className="columns">
            {renderImage() && (
              <div className="column is-one-third">
                {renderImage()}
              </div>
            )}
            <div className={`column ${article.image ? "" : "is-full"}`}>
              <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
          </div>
        );
      
      case "right":
        return (
          <div className="columns">
            <div className={`column ${article.image ? "" : "is-full"}`}>
              <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
            {renderImage() && (
              <div className="column is-one-third">
                {renderImage()}
              </div>
            )}
          </div>
        );
      
      case "top":
      default:
        return (
          <>
            {renderImage()}
            <div className="content mt-4" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </>
        );
    }
  };

  return (
    <div className="box">
      {!isPreview && <h1 className="title is-3">{article.title}</h1>}
      {renderArticleContent()}
      
      {!isPreview && (
        <div className="has-text-right mt-4">
          <small>
            Publicado: {new Date(article.createdAt).toLocaleDateString()}
            {article.createdAt !== article.updatedAt && 
              ` (Actualizado: ${new Date(article.updatedAt).toLocaleDateString()})`}
          </small>
        </div>
      )}
    </div>
  );
};

export { ArticleDisplay };