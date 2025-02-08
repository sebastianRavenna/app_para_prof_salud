import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Login } from "../pages/Login"; 
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { Dashboard } from "../pages/Dashboard";
/* import Register from "../pages/Register";
 */
const AppRouter = () => {
    return (
       <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                     
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export { AppRouter };
