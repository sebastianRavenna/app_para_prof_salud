import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, validate: {
      validator: (value) => !isNaN(Date.parse(value)), // Verifica si es una fecha válida
      message: "Fecha inválida"
    }},
    status: { 
    type: String, 
    enum: ["Pendiente", "Realizado", "Ausente"], 
    default: "Pendiente"
  },
    reason: { type: String },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export { Appointment };