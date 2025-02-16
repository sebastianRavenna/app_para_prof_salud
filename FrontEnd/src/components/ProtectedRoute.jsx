import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;  // Evita redirigir antes de saber el estado

  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/appointments" />;

  return children;
};

export { ProtectedRoute };
