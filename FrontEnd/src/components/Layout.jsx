import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
 
const Layout = ({ children }) => { 
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return ( 
    <> 
      <header> 
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation"> 
          <div className="navbar-brand"> 
            <Link to="/" className="navbar-item"> <strong>MiApp</strong> </Link> 
          </div> 
          <div className="navbar-menu"> 
            <div className="navbar-start"> 
              <Link to="/" className="navbar-item"> Home </Link> 
           <div className="navbar-end"> 
            {user?.role === "admin" ? (
              <>
              <Link to="/admin" className="navbar-item"> Panel Admin </Link> 
            </>
            ) : ( 
              <Link to="/appointments" className="navbar-item">  Appointments </Link> 
            )}
            </div> 
            <div className="navbar-end"> 
            {user ? (
              <>
              <button className="button is-light" onClick={ () => logout(navigate)}>
                    Logout
              </button>   
            </>
            ) : ( 
              <Link to="/login" className="navbar-item"> Login </Link> 
            )}
            </div> 
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