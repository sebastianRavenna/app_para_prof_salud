import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken"; // Necesario para verificar tokens manualmente
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Decodificar manualmente para verificar si el token ha expirado
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(jwt_payload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.exp * 1000 < Date.now()) {
        return done(null, false, { message: "Token expirado" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      }

      return done(null, user);
    } catch (error) {
      let errorMessage = "Token inválido";

      if (error.name === "TokenExpiredError") {
        errorMessage = "Token expirado";
      } else if (error.name === "JsonWebTokenError") {
        errorMessage = "Token no válido";
      }

      return done(null, false, { message: errorMessage });
    }
  })
);

export { passport };
