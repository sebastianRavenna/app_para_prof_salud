    import axios from "axios";

    const API_URL = "http://localhost:3000/api";

    const api = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const requestAppointment = async (date, reason, token) => {
        const res = await fetch(`${API_URL}/appointments/`, {
        method: "POST",
        credentials: "include", // 👈 Agregado
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, reason }),
        });
    
        if (!res.ok) throw new Error("Error al solicitar turno");
        return res.json();
    };

    // 📌 Ruta de paciente
    const getPatientAppointments = async (token) => {
        try {
            console.log("🔍 Iniciando petición GET appointments");
            // Asegúrate de que la ruta coincida exactamente con el backend
            const response = await api.get('/appointments/user');
            console.log("✅ Respuesta:", response);
            return response.data;
        } catch (error) {
            console.log("❌ Error completo:", error);
            console.log("❌ Response data:", error.response?.data);
            console.log("❌ Response status:", error.response?.status);
            throw error;
        }
        
        /* const res = await axios.get(`${API_URL}/appointments/`, {
        withCredentials: true, // 👈 Agregado
        headers: { Authorization: `Bearer ${token}` },
        });
        return res.data; */
    }; 


// 📌 Ruta de profesional (admin)
   /* const getAppointments = async (token) => {
        try {
            console.log("🔍 Iniciando petición GET appointments");
            const response = await api.get('/appointments/user');
            console.log("✅ Respuesta:", response);
            return response.data;
             const response = await fetch(`${API_URL}/appointments/user`, {
            method: "GET",
            credentials: "include", // IMPORTANTE: Permite enviar la cookie de sesión
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
            },
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
    };*/


    const cancelAppointment = async (appointmentId, token) => {
        await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
            withCredentials: true, // 👈 Agregado
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    export { api, /* getAppointments, */ requestAppointment, getPatientAppointments, cancelAppointment };
