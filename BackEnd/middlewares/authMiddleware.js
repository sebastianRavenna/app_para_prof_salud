const authMiddleware = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ message: "Acceso no autorizado" });
    next();
  };
  
export { authMiddleware };
  