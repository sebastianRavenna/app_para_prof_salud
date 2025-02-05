import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Guardamos la sesión del usuario
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };

    res.status(200).json({ message: "Inicio de sesión exitoso", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error en el login" });
  }
};

const logOutUser = (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    });
};

const getUserSession = (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: "No autenticado" });
    res.status(200).json(req.session.user);
};

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
      if (req.session.user.id !== user._id.toString()) {
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

export { registerUser, loginUser, logOutUser, getUserSession, updateUser, getUserById };
