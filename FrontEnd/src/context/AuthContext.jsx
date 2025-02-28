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
      console.log("🔵 Comprobando sesión en el frontend...");
      try {
        const res = await axios.get(`${API_URL}/api/users/session`, 
          { withCredentials: true });
        console.log("✅ Sesión encontrada en el frontend:", res.data);
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
    console.log("🔵 Enviando login con:", email, password);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, 
        { email, password }, 
        { withCredentials: true, }
      );
      console.log("✅ Login exitoso, respuesta del backend:", res.data);
      setUser(res.data);
      setIsAuthenticated(true); 
      /* return res.data; */
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error; 
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
