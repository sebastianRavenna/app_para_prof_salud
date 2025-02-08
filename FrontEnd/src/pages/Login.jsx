import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard"); // Redirige después del login
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  /* const testConnection = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "juan@example.com", password: "123456" })
      });
      const data = await res.json();
      console.log("Respuesta del backend:", data);
    } catch (error) {
      console.error("Error en la conexión:", error);
    }
  }; */
  

  return (
    <Layout>
    <div className="container mt-5">
      <div className="column is-half is-offset-one-quarter">
        <h1 className="title has-text-centered">Iniciar Sesión</h1>
        <form className="box" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="button is-primary is-fullwidth">Ingresar</button>
{/*           <button onClick={testConnection} className="button is-warning">Probar Backend</button> */}

        </form>
      </div>
    </div>
    </Layout>
  );
};

export { Login };
