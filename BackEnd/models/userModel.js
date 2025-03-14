import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "patient"], default: "patient" }, 
  emailConfig: {
    service: { type: String, default: "gmail" },
    user: { type: String, default: "" },
    pass: { type: String, default: "" },
  },  
  isVerified: { type: Boolean, default: false }, 
  verificationCode: { type: String }, 
});

// Antes de guardar, encriptamos la contraseña
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export { User } 