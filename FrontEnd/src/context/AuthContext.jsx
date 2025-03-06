import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL=import.meta.env.VITE_BACKEND_BASEURL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); //
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error("Error al parsear storedUser", error);
        setIsAuthenticated(false);
      }
    } else {
      console.log("🔴 No hay usuario autenticado");
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);
  
 const login = async (credentials) => {
   try {
     const response = await axios.post(`${API_URL}/api/users/login`, credentials);
     console.log("axios response", response.data)
     const { token, userId } = response.data;  // Asume que el backend devuelve `user` y `token`

     const userResponse = await axios.get(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
     const user = userResponse.data;

     localStorage.setItem("token", token);
     localStorage.setItem("user", JSON.stringify(user));

     setToken(token);
     setUser({ id: userId });
     setIsAuthenticated(true);
     setLoading(false)

     console.log("✅ Login exitoso:", response.data);
  } catch (error) {
     console.error("❌ Error en login:", error);
     throw error;
  }
};

const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
  setIsAuthenticated(false);
/*delete api.defaults.headers.common["Authorization"]; */
};
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated, 
      token
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext }
