import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); //
  
  const VITE_API_URL="https://consultorio-fullstack.vercel.app/"

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(VITE_API_URL, "/api/users/session", { withCredentials: true });
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
    
    
  }, [isAuthenticated]); 
  
  const login = async (email, password) => {
    const res = await axios.post(VITE_API_URL, "/api/users/login", { email, password }, { withCredentials: true });
    setUser(res.data);
    setIsAuthenticated(true); 
    console.log("Login exitoso, usuario:", res.data);
  };

  const logout = async () => {
    await axios.post(VITE_API_URL, "api/users/logout", {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, userId: user?.id }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext }
