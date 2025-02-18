    import axios from "axios";

    const API_URL = "http://localhost:3000/api";

    const api = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

        // 📌 Paciente solicita un turno
    const requestAppointment = async (date, reason, /* token */) => {
        const res = await fetch(`${API_URL}/appointments/`, {
        method: "POST",
        credentials: "include", 
        headers: {
            "Content-Type": "application/json",
            /* Authorization: `Bearer ${token}`, */
        },
        body: JSON.stringify({ date, reason }),
        });
    
        if (!res.ok) throw new Error("Error al solicitar turno");
        return res.json();
    };

    // 📌 Paciente ve sus turnos
    const getPatientAppointments = async () => {
        try {
            const response = await api.get('/appointments/user');
            return response.data;
        } catch (error) {
            console.log("❌ Error completo:", error);
            console.log("❌ Response data:", error.response?.data);
            console.log("❌ Response status:", error.response?.status);
            throw error;
        }
    }; 


    // Profesional (admin) ve la hist clinica
    const getClinicalHistory = async (userId) => {
        console.log("Solicitando historia clínica para el usuario:", userId);
        const res = await axios.get(`${API_URL}/clinical-history/${userId}`, {
            withCredentials: true, 
            /* credentials: "include",
            headers: { "Content-Type": "application/json", }, */
        });
        return res.data;
    };
  
    // Profesional (admin) actualiza la hist clinica
    const addNote = async (userId, note) => {
        const res = await axios.post(`${API_URL}/clinical-history/${userId}/note`, { note }, {
            withCredentials: true, 
            credentials: "include",
            headers: { "Content-Type": "application/json", },
        });
        return res.data;
    };
  
    // Profesional (admin) ve todos los turnos
   const getAllAppointments = async () => {
        try {
            const response = await fetch(`${API_URL}/appointments/all`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", },
            });
            if (!response.ok) {
                throw new Error("Error al obtener turnos");
            }
            return await response.json(); 
        } catch (error) {
            console.log("❌ Error completo:", error);
            console.log("❌ Response data:", error.response?.data);
            console.log("❌ Response status:", error.response?.status); 
            throw error;
        }
    };

    // Cancelacion de turno (paciente y profesional)
    const cancelAppointment = async (appointmentId) => {
        await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
            withCredentials: true, 
            credentials: "include",
            headers: { "Content-Type": "application/json", },
        });
    };

    export { 
        api, 
        requestAppointment, 
        getPatientAppointments, 
        getClinicalHistory, 
        addNote, 
        getAllAppointments, 
        cancelAppointment 
    };
