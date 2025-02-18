import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout"

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <section className="hero is-light">
                <div className="hero-body">
                    <div className="container has-text-centered">
                    <h1 className="title is-1 has-text-danger">404</h1>
                    <p className="subtitle is-4">Página no encontrada</p>
                    <p className="mb-5">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                    <button className="button is-primary" onClick={() => navigate("/")}>Volver al Inicio</button>
                    </div>
                </div>
            </section>
        </Layout>
    )
} 

export { NotFound }