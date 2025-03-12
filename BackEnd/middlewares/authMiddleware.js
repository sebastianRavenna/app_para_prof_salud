import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  
  const authHeader = req.headers.authorization
  
  if(!authHeader) {
    return res.status(401).json({
      message: "Token de autenticacion requerido",
      error: "No se proporcionó un token de autorizacion" 
    });
  }
  
  const token = authHeader.split(" ")[1]; // Obtener token sin "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    /* if (decoded.exp * 1000 < Date.now()){
      return res.status(401).json({ 
        message: "Token expirado", 
        error: "El token de autenticación ha caducado" 
      });
    } */

    req.user = decoded; // Guarda los datos del usuario en req.user
    next();
  } catch (error) {
    let errorMessage = "Token inválido";

    if (error.name === "TokenExpiredError"){
      errorMessage = "Token Expirado";
    } else if (error.name === "JsonWebTokenError"){
      errorMessage = "Token no válido";
    }

    return res.status(401).json({ 
      message: errorMessage, 
      error: error.message
    });
  }
};


export { authMiddleware };



