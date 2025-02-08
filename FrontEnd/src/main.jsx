/* import { StrictMode } from 'react' */
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './Router/AppRouter.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>,
)
