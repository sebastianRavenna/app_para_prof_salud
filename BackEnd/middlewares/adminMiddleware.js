const adminMiddleware = (req, res, next) => {
    /* if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado, solo para administradores" });
    } */
    console.log("Sesión del usuario:", req.session.user);
    if (!req.session.user) {
      return res.status(401).json({ message: "No autenticado" }); // 401 en lugar de 403
    }
    if (req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado, solo para administradores" });
    }
    next();
  };

  export { adminMiddleware }