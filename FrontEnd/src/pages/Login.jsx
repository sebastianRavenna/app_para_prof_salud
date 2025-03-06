import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, user} = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  


  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { email, password };
    login(credentials);
    /* try {
      await login({ email, password });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error en el inicio de sesión");
    }
  }; */
  };
  
  useEffect(() => {
    if (user) {
      console.log(user.role)
      navigate(user.role === "admin" ? "/admin/turnos" : "/appointments");
    }
  }, [user, navigate]);
  
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
          <button type="submit" className="button is-primary is-fullwidth">Ingresar</button>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export { Login };
