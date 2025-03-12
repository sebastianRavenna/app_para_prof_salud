import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyCode } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import { Layout } from "../components/Layout";

const VerifyAccount = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("Por favor, ingresa el código de verificación");
      return;
    }
    setLoading(true);
    try {
      await verifyCode(email, code);
      toast("Cuenta verificada con éxito. Inicia sesión.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => navigate(`/login`),
      });
    } catch (err) {
        console.error("Error en la verificación:", err);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <ToastContainer />
      <section className="verify-section">
        <div className="card verify-card">
          <div className="card-content">
            <h2 className="title has-text-centered">Verificación de Cuenta</h2>
            <p className="has-text-centered">Ingresa el código que recibiste en tu correo electrónico.</p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label pt-5">Código de verificación</label>
                <input
                  className="input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                />
            <p className="has-text-centered has-text-grey pb-4">
              📩 Si no lo ves, revisá tu carpeta de spam o correo no deseado.
            </p>
              </div>
              <button className="button is-primary is-fullwidth" type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Verificar"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export { VerifyAccount };
