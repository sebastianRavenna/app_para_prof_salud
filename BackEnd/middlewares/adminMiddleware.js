const adminMiddleware = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado, solo para administradores" });
    }
    next();
  };

  export { adminMiddleware }