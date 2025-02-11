import { Layout } from "../components/Layout"
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getPatientAppointments, cancelAppointment } from "../services/api";

const Dashboard = () => {

  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        console.log("⚠️ No hay usuario autenticado");
        return;
    }
      
        try {
          console.log("🔍 Intentando obtener appointments para usuario:", user.id);
        const data = await getPatientAppointments();
        console.log("📌 Datos recibidos:", data);
        setAppointments(data);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        setError(error.message);
      }
    };

   
      fetchAppointments();
   
}, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar este turno?")) return;
    try {
      await cancelAppointment(id, user);
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error("Error al cancelar turno", error);
    }
  };

  return (
    <><Layout>
    <div className="container mt-5">
      <h1 className="title has-text-centered">Mis Turnos</h1>
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
  </Layout>
  </>
  );
};

console.log("🚀 Dashboard renderizado");
export { Dashboard }