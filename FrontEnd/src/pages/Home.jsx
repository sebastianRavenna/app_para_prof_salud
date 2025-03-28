import { Layout } from "../components/Layout"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ArticleDisplay } from "../components/ArticleDisplay";

const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const Home = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/articles?limit=3`);
      setLatestArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar artículos:", error);
      setError("No se pudieron cargar los artículos");
      setLoading(false);
    }
  };
  return (
    <>
    <Layout>
      <div className="container mt-5">
      {/* ✅ About Me */}
      <section className="section">
        <h1 className="title has-text-centered">Bienvenidos a la consulta psicológica de [Nombre de la Profesional]</h1>
        <div className="columns is-centered is-vcentered">
        <p className="content column is-half is-medium">
        En nuestro espacio, la salud mental es nuestra prioridad. La Lic. [Nombre de la Profesional], psicóloga con más de [X] años de experiencia, ofrece un enfoque personalizado y profesional para acompañarte en tu proceso de bienestar emocional. Con un profundo compromiso hacia el bienestar de cada persona, trabajamos juntos para encontrar soluciones a los desafíos emocionales y psicológicos que puedan estar afectando tu vida diaria.

A través de esta plataforma, podrás gestionar fácilmente tus turnos, acceder a recursos exclusivos y recibir atención personalizada que te ayudará a avanzar hacia una vida más plena y equilibrada.

Con una formación sólida en [mencionar especializaciones o áreas de trabajo como terapias cognitivo-conductuales, orientación psicológica, etc.], [Nombre de la Profesionista] te brindará herramientas prácticas para mejorar tu bienestar emocional, todo en un ambiente seguro, confidencial y respetuoso.

Estamos aquí para ayudarte a dar el primer paso hacia el bienestar emocional. Agenda tu turno hoy mismo y comienza tu camino hacia la salud mental.
        </p>
        <img id="imgProfesional" className="column is-half" src="/assets/profesional2.jpg" alt="foto del profesional" />
        </div>
      </section>

      {/* ✅ Sección de Artículos */}
      <section className="section">
          <h2 className="title has-text-centered">Últimos Artículos</h2>
          
          {loading ? (
            <div className="has-text-centered">
              <p>Cargando artículos...</p>
              <progress className="progress is-primary" max="100"></progress>
            </div>
          ) : error ? (
            <div className="notification is-danger">
              {error}
            </div>
          ) : latestArticles.length === 0 ? (
            <div className="notification is-info has-text-centered">
              No hay artículos disponibles
            </div>
          ) : (
            <div className="columns">
              {latestArticles.map((article) => (
                <div key={article._id} className="column">
                  <ArticleDisplay 
                    article={article} 
                    isPreview={true} 
                  />
                </div>
              ))}
            </div>
          )}
        </section>

      {/* ✅ Contacto y Mapa */}
      <section className="section">
        <h2 className="title has-text-centered">Contacto</h2>
        <div className="columns">
          {/* Formulario */}
          <div className="column">
            <form className="box">
              <div className="field">
                <label className="label">Nombre</label>
                <input className="input" type="text" placeholder="Tu nombre" />
              </div>
              <div className="field">
                <label className="label">Mensaje</label>
                <textarea className="textarea" placeholder="Tu mensaje"></textarea>
              </div>
              <button className="button is-primary">Enviar</button>
            </form>
          </div>
          {/* Mapa */}
          <div className="column">
            <iframe
              title="Mapa"
              width="100%"
              height="300"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6359.066656363971!2d-56.910062700000026!3d-37.1637946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1738960405125!5m2!1ses-419!2sar"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ✅ Login/Register */}
      <section className="section">
        <h2 className="title has-text-centered">Acceso</h2>
        <div className="buttons is-centered">
          <Link to="/login" className="button is-primary">Iniciar Sesión</Link>
          <Link to="/register" className="button is-link">Registrarse</Link>
        </div>
      </section>
      </div>
      </Layout>
    </>
  );
};


export { Home }