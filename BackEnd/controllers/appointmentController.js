import { Appointment } from '../models/appointmentModel.js';
import { sendEmail } from '../config/email.js';
import { emailTemplates } from '../utils/emailTemplates.js';
import { User } from '../models/userModel.js'
import { ClinicalHistory } from '../models/clinicalHistoryModel.js';
import jwt from 'jsonwebtoken';
import { formatInTimeZone } from "date-fns-tz";

// 📌 1️⃣ Paciente solicita un turno
const requestAppointment = async (req, res) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No autorizado, falta autenticación." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const patientId = decoded.id;
    
    const { date, reason } = req.body;

    // Enhanced logging and validation
    console.log('Received appointment request:', { patientId, date, reason });

    if (!date || !reason) {
      return res.status(400).json({ message: "Fecha y motivo son requeridos" });
    }

    let history = await ClinicalHistory.findOne({ user: patientId });

    if (!history) {
      history = new ClinicalHistory({ user: patientId });
      await history.save();
    }

    // Improved date handling
    const utcDate = new Date(date);
    const localDate = formatInTimeZone(utcDate, 'America/Argentina/Buenos_Aires', "yyyy-MM-dd'T'HH:mm:ssXXX");
    
    const newAppointment = new Appointment({ 
      patient: patientId, 
      date: localDate, 
      reason 
    });
    
    await newAppointment.save();
    
    const patient = await User.findById(patientId);
    const formattedDate = new Date(date).toLocaleString("es-AR");
    
    await sendEmail(
      patient.email,
      "Confirmación de Turno",
      emailTemplates.appointmentBooked(patient.username, formattedDate)
    );
  
    res.status(201).json({ message: "Turno solicitado", appointment: newAppointment });
  } catch (error) {
    console.error("Detailed appointment request error:", error);
    res.status(500).json({ 
      message: "Error al solicitar turno", 
      errorDetails: error.message 
    });
  }
};

// 📌 Paciente cancela su turno
const cancelAppointment = async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }


      const isPatient = appointment.patient.toString() === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isPatient && !isAdmin){
        return res.status(403).json({ message: "No autorizado para cancelar este turno" });
      }
  
      await Appointment.findByIdAndDelete(id);

      //envio de mail
       /* await sendEmail(
        appointment.patient.email,
        "Turno Cancelado",
        emailTemplates.appointmentCancelled(appointment.patient.username, appointment.date.toLocaleString("es-AR"))
      );  */

      res.status(200).json({ message: "Turno cancelado" });
    } catch (error) {
      console.error("❌ Error en el backend al cancelar turno:", error);
      res.status(500).json({ message: "Error al cancelar turno" });
    }
  }; 

  
  
  // 📌 Paciente ve sus turnos
  const getPatientAppointments = async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const appointments = await Appointment.find({ patient: decoded.id });
    
    const localAppointments = appointments.map(app => {
      const localDate = new Date(app.date);
      localDate.setHours(localDate.getHours() - 3);
        return {
          ...app.toObject(), // Convert Mongoose document to plain object
          date: localDate
        };
      });

    res.json(appointments);
  } catch (error) {
      return res.status(500).json({ message: "Error al obtener turnos" });
  }
};

  // 📌 Paciente obtiene los turnos ocupados
  const getBookedAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find().select("date -_id"); // Solo obtiene la fecha
      const bookedTimes = appointments.map(app => {
        const localDate = new Date(app.date.toLocaleString('en-US', { timeZone: 'America/Buenos_Aires' }));

        return{ 
        date: localDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        time: localDate.toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
        })
      };
    });

        res.status(200).json(bookedTimes);
    } catch (error) {
        console.error("🔴 Error en getBookedAppointments:", error);
        res.status(500).json({ message: "Error al obtener turnos ocupados" });
    }
};
  
  // 📌 Profesional ve todos los turnos de todos los pacientes
  const getAllAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find().populate("patient", "name email");
      res.status(200).json(appointments);
    } catch (error) {
      console.error("🔴 Error en getAllAppointments:", error);
      res.status(500).json({ message: "Error al obtener turnos" });
    }
  };
  
  // 📌 Profesional ve los turnos de un paciente
  const getAppointmentsByPatient = async (req, res) => {
    try {
      const appointments = await Appointment.find({ patient: req.params.id });
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor al obtener turnos del paciente" });
    }
  };

// 📌 Controller.js Profesional agenda un turno manualmente
const scheduleAppointment = async (req, res) => {
    try {
        const { patientId, date, reason } = req.body;

        // Validate inputs
        if (!patientId || !date) {
            return res.status(400).json({ message: "Paciente y fecha son requeridos" });
        }

        // Verify patient exists
        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        // Ensure clinical history exists
        let history = await ClinicalHistory.findOne({ user: patientId });
        if (!history) {
            history = new ClinicalHistory({ user: patientId });
            await history.save();
        }

        // Convert date to local timezone
        const localDate = formatInTimeZone(
            new Date(date), 
            'America/Buenos_Aires', 
            "yyyy-MM-dd'T'HH:mm:ssXXX"
        );

        /* // Check for existing appointment at the same time
        const existingAppointment = await Appointment.findOne({ 
            patient: patientId, 
            date: localDate 
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Ya existe un turno para este paciente en esta fecha y hora" });
        }
 */
        // Create new appointment
        const newAppointment = new Appointment({ 
            patient: patientId, 
            date: localDate, 
            reason,
            status:"Pendiente"
        });
        
        await newAppointment.save();

        // Send confirmation email
        const formattedDate = new Date(localDate).toLocaleString("es-AR");
        await sendEmail(
            patient.email,
            "Turno Agendado",
            emailTemplates.appointmentBooked(patient.username, formattedDate)
        );
    
        res.status(201).json({ 
            message: "Turno agendado exitosamente", 
            appointment: newAppointment 
        });

    } catch (error) {
        console.error("Error al agendar turno:", error);
        res.status(500).json({ 
            message: "Error al agendar turno", 
            errorDetails: error.message 
        });
    }
};

/* const scheduleAppointment = async (req, res) => {
  try {
    const { patientId, date, reason } = req.body;
    console.log('Fecha recibida en scheduleAppointment:', date);
    
    // Validate input
    if (!patientId || !date || !reason) {
      return res.status(400).json({ message: "Paciente, fecha y motivo son requeridos" });
    }

    // Improved date handling
    const utcDate = new Date(date);
    const localDate = formatInTimeZone(utcDate, 'America/Buenos_Aires', "yyyy-MM-dd'T'HH:mm:ssXXX"); 
    console.log(firstDate, 'Fecha convertida a UTC:', localDate);
    const newAppointment = new Appointment({ 
      patient: patientId, 
      date: localDate, 
      reason,
      status: "Pendiente" 
    });
    
    await newAppointment.save();
    
    //const patient = await User.findById(patientId);
    //const formattedDate = new Date(date).toLocaleString("es-AR");

    res.status(201).json({ 
      message: "Turno agendado por el profesional", 
      appointment: newAppointment 
    });
  } catch (error) {
    console.error("Error al agendar turno:", error);
    res.status(500).json({ 
      message: "Error al agendar turno", 
      errorDetails: error.message 
    });
  }
}; */

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
    getBookedAppointments,
    getAllAppointments, 
    getAppointmentsByPatient, 
    scheduleAppointment, 
    updateAppointmentStatus,
    sendReminders, 
    sendFeedbackRequest 
};
