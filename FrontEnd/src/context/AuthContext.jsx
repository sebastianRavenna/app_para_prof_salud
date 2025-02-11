import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

/* const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
      'Content-Type': 'application/json'
  }
}); */

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/session", { withCredentials: true });
        console.log("📌 Respuesta del backend en checkUser:", res.data); 
        setUser(res.data);
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        setUser(null);
      }
      setLoading(false);
    };
    checkUser();
    
  }, []); 

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:3000/api/users/login", { email, password }, { withCredentials: true });
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post("http://localhost:3000/api/users/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext }
