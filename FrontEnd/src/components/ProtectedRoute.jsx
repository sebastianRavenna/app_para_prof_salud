import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loading, user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

   if (loading){ 
    return (
      <div className="is-flex is-justify-content-center is-align-items-center" style={{height: '100vh'}}>
        <span className="loader">Cargando...</span>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  /* if (role && user.role !== role) {
    return <Navigate to="/" />;
  } */
  
  return children;
};

export { ProtectedRoute };
