import { Appointment } from '../models/appointmentModel.js';
import { sendEmail } from '../config/email.js';
import { emailTemplates } from '../utils/emailTemplates.js';
import { User } from '../models/userModel.js'

// 📌 1️⃣ Paciente solicita un turno
const requestAppointment = async (req, res) => {
    try {
      console.log("Sesión actual:", req.session);
      console.log("Body recibido:", req.body);
      if (!req.session.user) {
        return res.status(401).json({ message: "No autorizado. Falta autenticación." });
      }
      const { date, reason } = req.body;
      const patientId = req.session.user.id;

      const newAppointment = new Appointment({ patient: patientId, date, reason });
      await newAppointment.save();
      
      //envio de mail
      const patient = await User.findById(patientId);
      const formattedDate = new Date(date).toLocaleString("es-AR");

      await sendEmail(
      patient.email,
      "Confirmación de Turno",
      emailTemplates.appointmentBooked(patient.username, formattedDate)
      );
    
      res.status(201).json({ message: "Turno solicitado", appointment: newAppointment });
    } catch (error) {
      console.error("Error en createAppointment:", error);
      res.status(500).json({ message: "Error al solicitar turno" });
    }
  };
// 📌 Paciente cancela su turno
const cancelAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id del turno: " + id)
      const appointment = await Appointment.findById(id);

      console.log("TURNO: " + appointment)

      console.log("id paciente en el turno: " + appointment.patient.toString())
      console.log("id paciente: " + req.session.user.id)
  
      if (!appointment) return res.status(404).json({ message: "Turno no encontrado" });
      if (appointment.patient.toString() !== (req.session.user.id).toString()) {
        return res.status(403).json({ message: "No autorizado para cancelar este turno" });
      }
  
      await Appointment.findByIdAndDelete(id);

      //envio de mail
      /* await sendEmail(
        appointment.patient.email,
        "Turno Cancelado",
        emailTemplates.appointmentCancelled(appointment.patient.username, appointment.date.toLocaleString("es-AR"))
      ); */

      res.status(200).json({ message: "Turno cancelado" });
    } catch (error) {
      res.status(500).json({ message: "Error al cancelar turno" });
    }
  };
  
  // 📌 Paciente ve sus turnos
  const getPatientAppointments = async (req, res) => {
    console.log("\n🔍 Debug getPatientAppointments:");
    console.log("Session:", req.session);
    console.log("User in session:", req.session.user);

    try {
      if (!req.session.user) {
          console.log("❌ No hay usuario en sesión");
          return res.status(401).json({ message: "No autorizado" });
      }

      const appointments = await Appointment.find({ patient: req.session.user.id });
      console.log("✅ Appointments encontrados:", appointments);
      
      return res.json(appointments);
  } catch (error) {
      console.error("❌ Error:", error);
      return res.status(500).json({ message: "Error al obtener turnos" });
  }
};
  
  // 📌 Profesional ve todos los turnos de todos los pacientes
  const getAllAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find().populate("patient", "username email");
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener turnos" });
    }
  };
  
  // 📌 Profesional ve los turnos de un paciente
  const getAppointmentsByPatient = async (req, res) => {
    try {
      const { id } = req.params;
      const appointments = await Appointment.find({ patient: id });
  
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener turnos del paciente" });
    }
  };

// 📌 6️⃣ Profesional agenda un turno manualmente
const scheduleAppointment = async (req, res) => {
    try {
      const { patientId, date, reason } = req.body;
  
      const newAppointment = new Appointment({ patient: patientId, date, reason });
      await newAppointment.save();
  
      res.status(201).json({ message: "Turno agendado por el profesional", appointment: newAppointment });
    } catch (error) {
      res.status(500).json({ message: "Error al agendar turno" });
    }
  };

// 📌 Profesional cambia el estado del turno
const updateAppointmentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!["Pendiente", "Realizado", "Ausente"].includes(status)) {
        return res.status(400).json({ message: "Estado inválido" });
      }
  
      const appointment = await Appointment.findById(id);
      if (!appointment) return res.status(404).json({ message: "Turno no encontrado" });
  
      appointment.status = status;
      await appointment.save();
  
      res.status(200).json({ message: "Estado del turno actualizado", appointment });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el estado del turno" });
    }
};
// 📌 Enviar recordatorio 1 día antes
const sendReminders = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      const appointments = await Appointment.find({
        date: { 
          $gte: new Date(tomorrow.setHours(0, 0, 0)), 
          $lt: new Date(tomorrow.setHours(23, 59, 59)) 
        }
      }).populate("patient");
  
      for (const appointment of appointments) {
        await sendEmail(
          appointment.patient.email,
          "Recordatorio de Turno",
          emailTemplates.appointmentReminder(appointment.patient.username, appointment.date.toLocaleString("es-AR"))
        );
      }
    } catch (error) {
      console.error("Error enviando recordatorios:", error);
    }
  };
  
  // 📌 Enviar email de feedback (opcional)
const sendFeedbackRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const { sendFeedback } = req.body; // true/false
  
      if (!sendFeedback) return res.status(200).json({ message: "Feedback no solicitado" });
  
      const appointment = await Appointment.findById(id).populate("patient");
      if (!appointment) return res.status(404).json({ message: "Turno no encontrado" });
  
      await sendEmail(
        appointment.patient.email,
        "Cuéntanos tu experiencia",
        emailTemplates.feedbackRequest(appointment.patient.username)
      );
  
      res.status(200).json({ message: "Email de feedback enviado" });
    } catch (error) {
      res.status(500).json({ message: "Error al enviar email de feedback" });
    }
};

export {
    requestAppointment, 
    cancelAppointment, 
    getPatientAppointments, 
    getAllAppointments, 
    getAppointmentsByPatient, 
    scheduleAppointment, 
    updateAppointmentStatus,
    sendReminders, 
    sendFeedbackRequest 
};
