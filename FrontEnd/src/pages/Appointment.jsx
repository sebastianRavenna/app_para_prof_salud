import { useState, useEffect, useContext } from "react";
import { AppointmentForm } from "../components/AppointmentForm";
import { Layout } from "../components/Layout";
import { getPatientAppointments, cancelAppointment } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Appointments = () => {
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Usuario en contexto:", user);
    console.log(user._id)

    if (!user || !user._id) {
      console.warn("No hay usuario autenticado o no tiene ID");
      return;
    }
    
    const fetchAppointments = async () => {
      try {
        console.log("Obteniendo turnos para usuario:", user._id);
        const data = await getPatientAppointments();
        console.log("Turnos obtenidos:", data);
        setAppointments(data || []);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        setError(error.message);
      }
    };
    fetchAppointments();
  }, [user]);

  const addAppointment = (newAppointment) => {
    if (!newAppointment) return;
    setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar este turno?")) return;
    try {
      await cancelAppointment(id, user);
      console.log("id seleccionado", id)
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error("Error al cancelar turno", error);
    }
  };

  return (
    <><Layout>
        <div className="container mt-5">
            <h1 className="title has-text-centered">Gestión de Turnos</h1>
            <div className="columns">
                <div className="column is-half">
                  <AppointmentForm addAppointment={addAppointment} />
                </div>
                
                <div className="column is-half">
            <h2 className="subtitle has-text-centered">Mis Turnos</h2>
            {error && <p className="notification is-danger">{error}</p>}
            {appointments.length === 0 ? (
              <p className="notification is-info">No tienes turnos agendados.</p>
            ) : (
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{new Date(appointment.date).toLocaleTimeString()}</td>
                      <td>{appointment.status}</td>
                      <td>
                        <button
                          className="button is-danger is-small"
                          onClick={() => handleCancel(appointment._id)}
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
            </div>
        </div>
    </Layout> 
    </>
  );
};

export { Appointments };
