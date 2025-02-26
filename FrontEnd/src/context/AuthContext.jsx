import { createContext, useState, useEffect } from "react";
import axios from "axios";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); //
  
  const API_URL=import.meta.env.VITE_BACKEND_BASEURL;
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/session`, { withCredentials: true });
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error al verificar usuario:", error);
        }
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    checkUser();
  }, [API_URL]); 
  
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password }, { withCredentials: true });
      setUser(res.data);
      setIsAuthenticated(true); 
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error; // Esto permite manejar errores en el frontend (ej. mostrar alertas)
    }
  };
  

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error en logout:", error.response?.data || error.message);
      throw error;
    }
  };  

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, userId: user?.id }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext }
