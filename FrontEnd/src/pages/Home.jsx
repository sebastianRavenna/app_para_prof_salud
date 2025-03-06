import { Layout } from "../components/Layout"
import { Link } from "react-router-dom";

const Home = () => {
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
        <div className="columns">
          {[1, 2, 3].map((num) => (
            <div key={num} className="column">
              <div className="box">
                <h3 className="subtitle">Artículo {num}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                <button className="button is-link">Leer más</button>
              </div>
            </div>
          ))}
        </div>
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