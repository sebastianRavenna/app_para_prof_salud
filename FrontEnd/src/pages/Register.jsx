import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { createPatient } from "../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';




const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "patient",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      email: Yup.string().email("Email inválido").required("El email es obligatorio"),
      password: Yup.string()
      .min(6, "⚠️ Mínimo 6 caracteres. Al menos una mayúscula, una minuscula y un número")
      .matches(/[A-Z]/, "⚠️ Mínimo 8 caracteres. Al menos una mayúscula, una minuscula y un número")
      .matches(/[a-z]/, "⚠️ Mínimo 8 caracteres. Al menos una mayúscula, una minuscula y un número")
      .matches(/[0-9]/, "⚠️ Mínimo 8 caracteres. Al menos una mayúscula, una minuscula y un número")
      .required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createPatient(values.name, values.email, values.password, values.role);
        toast('¡Registro exitoso!', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => navigate("/login")
        });
      } catch (err) {
        toast(err.response?.data?.msg || "Error en el registro", { position: "top-right" });
      }
      setSubmitting(false);
    },
  });

  return (
    <Layout>
      <ToastContainer />
      <section className="register-section">
                <div className="card register-card">
                  <div className="card-content">
                    <h2 className="title has-text-centered">Registro</h2>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="field">
                        <label className="label">Nombre</label>
                        <input
                          className={`input ${formik.touched.name && formik.errors.name ? "is-danger" : ""}`}
                          type="text"
                          name="name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && <p className="help is-danger">{formik.errors.name}</p>}
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <input
                          className={`input ${formik.touched.email && formik.errors.email ? "is-danger" : ""}`}
                          type="email"
                          name="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && <p className="help is-danger">{formik.errors.email}</p>}
                      </div>
                      <div className="field">
                        <label className="label">Contraseña</label>
                        <input
                          className={`input ${formik.touched.password && formik.errors.password ? "is-danger" : ""}`}
                          type="password"
                          name="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && <p className="help is-danger">{formik.errors.password}</p>}
                      </div>
                      <button className="button is-primary is-fullwidth" type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Registrando..." : "Registrarse"}
                      </button>
                    </form>
                    <div className="has-text-centered mt-4">
                    <p className="has-text-grey">
                      ¿Ya tenes cuenta?
                      <a href="/login" className="has-text-primary has-text-weight-bold ml-1">Inicia sesion</a>
                    </p>
                    </div>
                  </div>
                </div>
      </section>
    </Layout>
  );
};

export { Register };










//---------------------------------//

/* import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "../components/Layout"
import { createPatient } from "../services/api";

const Register = () => {
  const [userData, setUserData] = useState({ name: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient (userData.name, userData.email, userData.password, userData.role);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.msg || "Error en el registro");
    }
  };

  return (
    <>
    <Layout>
    <div className="container mt-5">
      <div className="column is-half is-offset-one-quarter">
        <h1 className="title has-text-centered">Registro</h1>
        <form className="box" onSubmit={handleSubmit}>
          {error && <p className="notification is-danger">{error}</p>}
          <div className="field">
            <label className="label">Nombre</label>
            <input className="input" type="text" name="name" onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input className="input" type="password" name="password" onChange={handleChange} required />
          </div>
          
          <button className="button is-primary is-fullwidth">Registrarse</button>
        </form>
      </div>
    </div>
    </Layout>
    </>
  );
};

export { Register };
 */