import { useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate(); 

  /*useEffect(() => {
    
     if (user) {
      if (user?.role === "admin") {
        navigate("/admin/turnos"); // Redirige a la página del Admin
      } else {
        navigate("/appointments"); // Redirige a los turnos si no es admin
      }
    }
  }, [user, navigate]); */
  
  if (loading) return <p>Cargando...</p>;  // Evita redirigir antes de saber el estado
  
  if (!user) return <Navigate to="/" />;

  return children;
};

export { ProtectedRoute };
