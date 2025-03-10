import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
  const {login, user} = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const formik = useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        email: Yup.string()
        .email("Email inválido")
        .required("El email es obligatorio"),
        password: Yup.string()
        .min(6, "⚠️ Mínimo 6 caracteres.")
        .required("La contraseña es obligatoria"),
      }),
      onSubmit : (values) => { 
        login(values);
      }
    })

  
  useEffect(() => {
    if (user) 
      {toast(`¡Bienvenido ${ user?.name }!`, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: () => navigate(user.role === "admin" ? "/admin/turnos" : "/appointments"),
    });
    }
  }, [user, navigate]);
  
  return (
    <Layout>
    <ToastContainer />
      <section className="login-section">
        <div className="card login-card">
          <div className="card-content">
            <h1 className="title has-text-centered">Iniciar Sesión</h1>
            <form onSubmit={formik.handleSubmit}>
              <div className="field">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="Ingresa tu email"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                <p className="help is-danger">{formik.errors.email}</p>
                )}
              </div>
              <div className="field">
                <label className="label">Contraseña</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password && (
                <p className="help is-danger">{formik.errors.password}</p>
                )}
              </div>
              <button type="submit" className="button is-primary is-fullwidth">Ingresar</button>
            </form>
            <div className="has-text-centered mt-4">
            <p className="has-text-grey">
              ¿No tenés una cuenta?
              <a href="/register" className="has-text-primary has-text-weight-bold ml-1">Registrate aquí</a>
            </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export { Login };
