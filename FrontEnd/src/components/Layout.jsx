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

  return (
    <div className="layout">
      <header>
        <nav 
          className="navbar is-primary px-6 p-3" 
          role="navigation" 
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <Link to="/" className= "navbar-item" >
              <img src="/assets/logo.png" alt="logo" id="logoNav" />
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
              ) : user?.role === "patient" ? (
                <Link 
                  to="/appointments" 
                  className={`navbar-item ${isActive("/appointments")}`}
                >
                  Appointments
                </Link>
              ) : null}
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
                <>
                <Link 
                  to="/register" 
                  className={`navbar-item ${isActive("/register")}`}
                  >
                  Register
                </Link>,
                <Link 
                  to="/login" 
                  className={`navbar-item ${isActive("/login")}`}
                >
                  Login
                </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

        <main className="layout-content">
          {children}
        </main>

      <footer className="footer has-background-primary">
        <div className="content has-text-centered">
          <p>&copy; 2025 MiApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export { Layout };