import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

import { 
  requestAppointment, 
  cancelAppointment, 
  getPatientAppointments, 
  getBookedAppointments,
  getAllAppointments, 
  getAppointmentsByPatient, 
  scheduleAppointment, 
  updateAppointmentStatus 
} from '../controllers/appointmentController.js';

const appointmentRoutes = express.Router();

// 📌 Rutas de paciente
appointmentRoutes.post("/", authMiddleware, requestAppointment);
appointmentRoutes.delete("/:id", authMiddleware, cancelAppointment);
appointmentRoutes.get("/user", authMiddleware, getPatientAppointments);
appointmentRoutes.get("/booked", authMiddleware, getBookedAppointments);


// 📌 Rutas de profesional (admin)
appointmentRoutes.get("/all", authMiddleware, adminMiddleware, getAllAppointments);
appointmentRoutes.get("/patient/:id", authMiddleware, adminMiddleware, getAppointmentsByPatient);
appointmentRoutes.post("/schedule", authMiddleware, adminMiddleware, scheduleAppointment);
appointmentRoutes.put("/:id/status", authMiddleware, adminMiddleware, updateAppointmentStatus);

export { appointmentRoutes };