import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Función para determinar si el link está activo
  const isActive = (path) => {
    return location.pathname === path ? "is-active has-text-weight-bold has-background-primary-35" : "";
  };

  console.log(user?.role);
  return (
    <>
      <header>
        <nav 
          className="navbar is-primary px-6" 
          role="navigation" 
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <Link to="/" className= "navbar-item" >
              <strong>MiApp</strong>
            </Link>
          </div>

          <div className="navbar-menu">
            <div className="navbar-start">
              <Link to="/" className={`navbar-item ${isActive("/")}`}>
                Home
              </Link>
              
              {user?.role === "admin" ? (
                <>
                  <Link 
                    to="/admin/turnos" 
                    className={`navbar-item ${isActive("/admin/turnos")}`}
                  >
                    Turnos Pendientes
                  </Link>
                  
                  <Link 
                    to="/admin/patients" 
                    className={`navbar-item ${isActive("/admin/patients")}`}
                  >
                    Admin Patients
                  </Link>
                </>
              ) : (
                <Link 
                  to="/appointments" 
                  className={`navbar-item ${isActive("/appointments")}`}
                >
                  Appointments
                </Link>
              )}
            </div>

            <div className="navbar-end">
              {user ? (
                <div className="navbar-item">
                  <button 
                    className="button is-light" 
                    onClick={() => logout(navigate)}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className={`navbar-item ${isActive("/login")}`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <section className="section">
        <div className="container">
          {children}
        </div>
      </section>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>&copy; 2025 MiApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export { Layout };