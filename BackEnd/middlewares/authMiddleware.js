const authMiddleware = (req, res, next) => {
  console.log("Sesión actual:", req.session); // 🔹 Debug
    if (req.session.user) {
      next();
    } else {return res.status(401).json({ message: "Acceso no autorizado" });
  };
  
}
export { authMiddleware };
  