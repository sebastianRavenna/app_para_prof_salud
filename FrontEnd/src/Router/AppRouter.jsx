import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Login } from "../pages/Login"; 
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { Register } from "../pages/Register";
import { Appointments } from "../pages/Appointment";
import { AdminPanel } from "../pages/AdminPanel";
import { ProtectedRoute } from "../components/ProtectedRoute"
import { AdminPatient } from "../pages/AdminPatient";
//import { Profile } from "../pages/Profile";
//<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
import { Articles } from "../pages/Articles";
import { VerifyAccount } from "../pages/VerifyAccount";
import { ArticlesList } from "../components/ArticlesList";
import { ArticleForm } from "../components/ArticleForm";
import { ArticleDetail } from "../components/ArticleDetail";
const AppRouter = () => {
    return (
       <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/VerifyAccount" element={<VerifyAccount />} />

                    {/* 🔒 Protegemos rutas */}
                    {/*Rutas de pacientes*/}
                    <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                    
                    {/*Rutas del profesional*/}
                    <Route path="/admin/turnos" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
                    <Route path="/admin/patients" element={<ProtectedRoute role="admin"><AdminPatient /></ProtectedRoute>} />
                    
                    {/*Rutas de articulos*/}
                    <Route path="/articleslist" element={<ArticlesList />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/article/new" element={<ArticleForm />} />
                    <Route path="/articles/edit/:id" element={<ArticleForm />} />
                    <Route path="/articles/:id" element={<ArticleDetail />} />

                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export { AppRouter };
