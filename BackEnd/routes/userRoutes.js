import { Router } from "express";
import { 
    registerUser, 
    verifyUser,
    loginUser, 
    logOutUser, 
    getUserSession, 
    updateUser, 
    getUserById, 
    getUserProfile,
    updateEmailConfig,  
    getAllPatients
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const userRoutes = Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/verify", verifyUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logOutUser);
userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.get("/session", authMiddleware, getUserSession);
userRoutes.put("/:id", authMiddleware, updateUser); 
userRoutes.get("/:id", authMiddleware, adminMiddleware, getUserById);
userRoutes.get("/", authMiddleware, adminMiddleware, getAllPatients);
userRoutes.put("/email-config", authMiddleware, updateEmailConfig);


export { userRoutes };
