import axios from "axios";
import { formatInTimeZone  } from 'date-fns-tz';

const API_URL=import.meta.env.VITE_BACKEND_BASEURL;
const timeZone = 'America/Argentina/Buenos_Aires';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});
//chequear sin Bearer
// 📌 Middleware para incluir el token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
// 📌 Paciente solicita un turno
const requestAppointment = async (date, reason) => {
    try {
        // Convertir la fecha al huso horario deseado
        const utcDate = formatInTimeZone(new Date(date), timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        
        const res = await api.post("/appointments", { 
            date: utcDate, 
            reason 
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error al solicitar turno:", error.response?.data || error);
        throw error;
    }
};

// 📌 Paciente ve sus turnos
const getPatientAppointments = async () => {
    try {
        const res = await api.get('/appointments/user');
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener turnos del paciente:", error.response?.data || error);
        throw error;
    }
}; 

// 📌 Paciente obtiene los turnos ocupados
const getBookedAppointments = async () => {
    try {
        const res = await api.get("/appointments/booked");
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener turnos ocupados:", error.response?.data || error);
        throw error;
    }
};

    // Cancelacion de turno (paciente y profesional)
const cancelAppointment = async (appointmentId) => {
    try {
        const res = await api.delete(`/appointments/${appointmentId}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error al cancelar turno:", error.response?.data || error);
        throw error;
    }
};

// 📌 Api.js Profesional agenda un turno manualmente
const scheduleAppointment = async (patientId, date, reason) => {
    try {
        if (!date || isNaN(new Date(date).getTime())) {
            throw new Error('Invalid date format');
        }
        // Convert the date to a standard ISO string
        // This ensures consistent formatting across different environments
        const formattedDate = new Date(date).toISOString();

        const res = await api.post("/appointments/schedule", { 
            patientId,
            date: formattedDate,
            reason,
            status: "Pendiente"
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error al agendar turno:", error.response?.data || error);
        throw error;
    }
};

// Profesional (admin) ve todos los turnos
const getAllAppointments = async () => {
    try {
        const res = await api.get("/appointments/all");
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener turnos:", error.response?.data || error);
        throw error;
    }
};

// Profesional (admin) ve los turnos de un paciente en especifico
const getAppointmentsByPatient = async (userId) => {
    try {
        const res = await api.get(`/appointments/patient/${userId}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener turnos del paciente:", error.response?.data || error);
        throw error;
    }
};

// Profesional (admin) cambia estado de un turno
const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const res = await api.put(`/appointments/${appointmentId}/status`, { status });
        return res.data;
    } catch (error) {
        console.error("❌ Error al actualizar estado del turno:", error.response?.data || error);
        throw error;
    }
};

// Profesional (admin) ve la hist clinica
const getClinicalHistory = async (userId) => {
    
    try {
        const res = await api.get(`/clinical-history/${userId}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener historia clínica:", error.response?.data || error);
        throw error;
    }
};

// Profesional (admin) actualiza la hist clinica
const addNote = async (userId, note, file) => {
    try {
        const formData = new FormData();
        if (note) {
            formData.append("note", note.trim());
        }

        if (file) {
            formData.append("file", file);
        }

        const res = await api.post(`/clinical-history/${userId}/note`, formData);
        return res.data
    } catch (error) {
        console.error("❌ Error al agregar nota clínica:", error.response?.data || error);
        throw error;
    }
};

// Profesional (admin) elimina una nota de la hist clinica
const removeNote = async (userId, noteId) => {
    try {
        const res = await api.delete(`/clinical-history/${userId}/note/${noteId}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error al eliminar nota clínica:", error.response?.data || error); 
        throw error; 
    };
}

// Profesional (admin) edita una nota de la hist clinica
const editNote = async (userId, noteId, note) => {
    try {
        const res = await api.put(`/clinical-history/${userId}/note/${noteId}`, { note });
        return res.data;
    } catch (error) {
        console.error("❌ Error al editar nota clínica:", error.response?.data || error);
        throw error;
    }
};

        // 📌 Crear nuevo usuario (Admin y Paciente)
const createPatient = async (name, email, password, role) => {
    try {
        const res = await api.post("/users/register", { name, email, password, role });
        return res.data;
    } catch (error) {
        console.error("❌ Error al crear usuario:", error.response?.data || error);
        throw error;
    }
};

// 📌 Ver todos los usuarios (Admin)
const getAllPatients = async () => {
    try {
        const res = await api.get("/users");
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error.response?.data || error);
        throw error;
    }
};

// 📌 Modificar usuario (Admin)
const updateUser = async (userId, userData) => {
    try {
        const res = await api.put(`/users/${userId}`, userData);
        return res.data;
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error.response?.data || error);
        throw error;
    }
};

// 📌 Guardar Email y Contraseña para Envío de Mails (Admin)
const updateEmailSettings = async (service, user, pass) => {
    try {
        const res = await api.put("/users/email-config", { service, user, pass });
        return res.data;
    } catch (error) {
        console.error("❌ Error al guardar email settings:", error.response?.data || error);
        throw error;
    }
};

// 📌 Obtener Email Guardado para Envío de Mails (Admin)
const getEmailSettings = async () => {
    try {
        const res = await api.get("/settings/email");
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener email settings:", error.response?.data || error);
        throw error;
    }
};

const verifyCode = async (email, code) => {
    try {
        const res = await api.post("/users/verify", { email, code });
        return res.data;
    } catch (error) {
        console.error ("codigo equivocado")
        throw error;
    }
};

// Upload a file to a patient's clinical history
const uploadFile = async (patientId, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Configuración especial para archivos
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }; 
        
        const res = await api.post(`/clinical-history/${patientId}/files`, formData, config);
        return res.data;
    } catch (error) {
        console.error("Error al subir el archivo", error);
        throw error;
    }
};

// Get all files for a patient's clinical history
const getPatientFiles = async (patientId) => {
    try {
        const res = await api.get(`/clinical-history/${patientId}/files`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener los archivos", error);
        throw error;
    }
};

// Delete a file from a patient's clinical history
const deleteFile = async (patientId, fileId) => {
    try {
        const res = await api.delete(`/clinical-history/${patientId}/files/${fileId}`);
        return res.data;
    } catch (error) {
        console.error("Error al eliminar el archivo", error);
        throw error;
    }
};
  // Obtener todos los artículos
const getAllArticles = async () => {
    const response = await api.get(API_URL);
    return response.data;
  };
  
  // Obtener un artículo por ID
  const getArticleById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  };
  
  // Crear un nuevo artículo
  const createArticle = async (formData) => {
    const response = await api.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data"}
    });
    return response.data;
  };
  
  // Actualizar un artículo
  const updateArticle = async (id, formData) => {
    const response = await api.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  };
  
  // Eliminar un artículo
  const deleteArticle = async (id) => {
    await api.delete(`${API_URL}/${id}`, {
    });
  };
    export{ 
        api, 
        requestAppointment, 
        getPatientAppointments, 
        getBookedAppointments,
        cancelAppointment,
        scheduleAppointment,
        getAllAppointments, 
        getAppointmentsByPatient,
        updateAppointmentStatus,
        getClinicalHistory, 
        addNote, 
        removeNote,
        editNote,
        createPatient,
        getAllPatients,
        updateUser,
        updateEmailSettings,
        getEmailSettings,
        verifyCode,
        uploadFile,
        getPatientFiles,
        deleteFile,
        deleteArticle,
        updateArticle,
        createArticle,
        getArticleById,
        getAllArticles,
    };
