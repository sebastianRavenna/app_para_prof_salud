const adminMiddleware = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "No autenticado" }); 
    }
    if (req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado, solo para administradores" });
    }
    next();
  };

  export { adminMiddleware }