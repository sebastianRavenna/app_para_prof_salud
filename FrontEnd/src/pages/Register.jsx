import { useState } from "react";
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
      /*("https://consultorio-fullstack.vercel.app/api/users/register", userData); */
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
