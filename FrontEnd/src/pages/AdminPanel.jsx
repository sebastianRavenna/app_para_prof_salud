import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  getAllAppointments, 
  cancelAppointment, 
  updateAppointmentStatus
} from "../services/api.js";
import { Layout } from "../components/Layout.jsx";
import { ClinicalHistory } from "../components/ClinicalHistory.jsx"

const AdminPanel = () => {
  const { user, loading, token } = useContext(AuthContext); 
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [showClinicalHistory, setShowClinicalHistory] = useState(false);
  
  useEffect(() => {
    //fetch para obtener todos los turnos
    const fetchAppointments = async () => {
      try {
        if (!token) return console.error("❌ No hay token disponible");
        
        const data = await getAllAppointments(token);
        const filteredAppointments = data
        .filter(app => app.status !== "Ausente" && app.status !== "Realizado") 
        // Ordenar los turnos cronológicamente
        .sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error("❌ Error al obtener turnos:", error);
      }
    };
    fetchAppointments();
  }, [user, token]);

  // Manejador para mostrar la historia clínica
  const handleShowHistory = (patientId, patientName) => {
    if (!patientId) return console.error("❌ Error: patientId es undefined");
    setSelectedPatient(patientId);
    setSelectedPatientName(patientName);
    setShowClinicalHistory(true);
  };

  // Cerrar la historia clínica
  const handleCloseHistory = () => {
    setShowClinicalHistory(false);
  };

  //funcion para CANCELAR turnos
  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar este turno?")) return;
    try {
      if (!token) return console.error("❌ No hay token disponible");
      await cancelAppointment(id, token);
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error("❌ Error al cancelar turno:", error);
    }
  };

  //funcion para CAMBIAR estado de los turnos
  const handleStatusChange = async (appointmentId, newStatus) => {
    if (!window.confirm("¿Seguro que quieres cambiar el estado de este turno?")) return;
    try {
      if (!token) return console.error("❌ No hay token disponible");
      await updateAppointmentStatus(appointmentId, newStatus, token);
      
      // Si el estado es "Realizado" o "Ausente", lo eliminamos de la vista
      if (newStatus === "Realizado" || newStatus === "Ausente") {
        setAppointments(prevAppointments =>
          prevAppointments.filter(app => app._id !== appointmentId)
        );
      } else {
        // Si el estado es otro (por ejemplo, vuelve a "Pendiente"), actualizamos su estado
        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app._id === appointmentId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      console.error("❌ Error al actualizar estado del turno:", error);
      alert("Hubo un error al cambiar el estado del turno.");
    }
  };
  
  // Función para formatear la fecha en DD/MM/AAAA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Función para formatear la hora en formato 24hs (Argentina)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  };

  if (loading) return <div>🔄 Cargando...</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <section className="hero is-primary mb-5">
          <div className="hero-body">
            <p className="title">Turnos Agendados</p>
            <p className="subtitle">Gestionar Turnos y Evoluciones</p>
          </div>
        </section>
        
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th className="has-text-centered">Paciente</th>
              <th className="has-text-centered">Fecha</th>
              <th className="has-text-centered">Hora</th>
              <th className="has-text-centered">Estado</th>
              <th className="has-text-centered">Acción</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patient?.name || "Sin nombre"}</td>
                <td className="has-text-centered">{appointment.date ? formatDate(appointment.date) : "Fecha no disponible"}</td>
                <td className="has-text-centered">{appointment.date ? formatTime(appointment.date) : "Hora no disponible"}</td>
                <td className="has-text-centered">
                  <select className={`select is-small 
                    ${appointment.status === "Pendiente" ? "has-background-warning-light" :
                    appointment.status === "Realizado" ? "has-background-success" :
                    appointment.status === "Ausente" ? "has-background-danger-light" : ""}`}
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Realizado">Realizado</option>
                    <option value="Ausente">Ausente</option>  
                  </select>
                </td>
                <td className="has-text-centered">
                  <div className="buttons is-flex is-justify-content-center">
                    <button 
                      className="button is-info is-small" 
                      onClick={() => handleShowHistory(appointment.patient?._id, appointment.patient?.name)}
                    >
                      📖 Ver Historia
                    </button>
                    <button 
                      className="button is-danger is-small" 
                      onClick={() => handleCancel(appointment._id)}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mostramos el componente de historia clínica solo cuando es necesario */}
        {showClinicalHistory && selectedPatient && (
          <ClinicalHistory 
            patientId={selectedPatient} 
            patientName={selectedPatientName}
            onClose={handleCloseHistory}
          />
        )}
      </div>
    </Layout>
  );
};

export { AdminPanel };