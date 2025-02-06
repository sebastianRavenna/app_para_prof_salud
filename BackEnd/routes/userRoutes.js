import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logOutUser, 
    getUserSession, 
    updateUser, 
    getUserById, 
    updateEmailConfig  
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const userRoutes = Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", authMiddleware, logOutUser);
userRoutes.get("/session", getUserSession);
userRoutes.put("/:id", authMiddleware, updateUser); 
userRoutes.get("/:id", authMiddleware, adminMiddleware, getUserById);
userRoutes.put("/email-config", authMiddleware, updateEmailConfig);


export { userRoutes };
