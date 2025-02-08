import { Link } from "react-router-dom"; 

const Layout = ({ children }) => { 
  
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
              <Link to="/dashboard" className="navbar-item"> Dashboard </Link> 
              <Link to="/login" className="navbar-item"> Login </Link> 
              <Link to="/register" className="navbar-item"> Register </Link> 
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