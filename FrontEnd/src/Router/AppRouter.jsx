import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Login } from "../pages/Login"; 
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { Register } from "../pages/Register";
import { Appointments } from "../pages/Appointment";
import { AdminPanel } from "../pages/AdminPanel";
import { ProtectedRoute } from "../components/ProtectedRoute"
const AppRouter = () => {
    return (
       <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />

                    {/* 🔒 Protegemos rutas */}
                    
                    <Route path="/appointments" element={<ProtectedRoute role="patient"><Appointments /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
                          

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export { AppRouter };
