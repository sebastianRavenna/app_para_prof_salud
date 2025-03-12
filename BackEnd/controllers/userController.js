import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/emailService.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

    const newUser = new User({ name, email, password, verificationCode });
    await newUser.save();

    
    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
};

const verifyUser = async (req, res) => {
  const { email, code } = req.body;
  console.log("Datos recibidos en el servidor:", { email, code });

  try {
    const user = await User.findOne({ email });
    console.log("Usuario encontrado:", user);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.isVerified) return res.status(400).json({ message: "Usuario ya verificado" });

    if (user.verificationCode === code) {
      console.log("Códigos coinciden, verificando usuario...");
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();
      return res.status(200).json({ message: "Cuenta verificada. Ya puedes iniciar sesión." });
    } else {
      console.log("Códigos no coinciden o usuario no encontrado.");
      return res.status(400).json({ message: "Código incorrecto" });
    }
  } catch (error) {
    console.error("Error en el proceso de verificación:", err);
    res.status(500).json({ message: "Error en la verificación" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Debes verificar tu email antes de iniciar sesión." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // 🔹 Generamos un token JWT con los datos del usuario
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      token, 
      userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error en el login" });
  }
};

const logOutUser = (req, res) => {
  return res.status(200).json({ message: "Logout exitoso. Elimina el token en el frontend" });
};

const getUserSession = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autenticado" });

  res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const { id: userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
      if (req.user.id !== user._id.toString() && req.user.role !== "admin") {
          return res.status(403).json({ message: "No tienes permiso para modificar este usuario" });
        }
  
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
  
      await user.save();
      res.status(200).json({ message: "Usuario actualizado con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No autorizado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // Excluye la contraseña

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id).select("-password"); // Excluye la contraseña
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  };

// 📌 Guardar o actualizar credenciales de email
const updateEmailConfig = async (req, res) => {
  try {
    const { service, user, pass } = req.body;
    const adminId = req.user._id;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    admin.emailConfig = { service, user, pass };
    await admin.save();

    res.status(200).json({ message: "Credenciales de email actualizadas" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar credenciales" });
  }
};

const getAllPatients = async (req, res) => {
  try {
      const patients = await User.find({ role: "patient" }).select("-password"); // Excluye la contraseña por seguridad
      res.json(patients);
  } catch (error) {
      console.error("❌ Error al obtener pacientes:", error);
      res.status(500).json({ error: "Error al obtener pacientes" });
  }
};

export { 
  registerUser, 
  verifyUser,
  loginUser, 
  logOutUser, 
  getUserSession, 
  updateUser, 
  getUserProfile,
  getUserById, 
  updateEmailConfig,
  getAllPatients
};
