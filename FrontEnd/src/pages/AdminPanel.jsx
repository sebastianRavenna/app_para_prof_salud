import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllAppointments, cancelAppointment, getClinicalHistory, addNote } from "../services/api";
import { Layout } from "../components/Layout";

const AdminPanel = () => {
  const { user, userId, loading } = useContext(AuthContext); 
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState({});
  const [note, setNote] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  console.log("User ID en AdminPanel:", userId);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments(); 
        /* console.log(data) */
        setAppointments(data);
      } catch (error) {
        console.error("Error al obtener turnos", error);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!loading && userId) {
      getClinicalHistory(userId)
        .then(data => {
          setHistory(data);
        })
        .catch(err => {
          console.error("Error al obtener la historia clínica:", err);
        });
    }
  }, [userId, loading]);

  if (loading) {
    return <div>Loading...</div>; // Mostrar cargando mientras se recupera la sesión
  }

  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar este turno?")) return;
    try {
      await cancelAppointment(id);
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error("Error al cancelar turno", error);
    }
  };

  const fetchHistory = async (patientId) => {
    if (!patientId) {
      console.error("Error: patientId es undefined");
      return;
    }
    try {
      const data = await getClinicalHistory(patientId);
      setHistory(data);
    } catch (error) {
      console.error("Error al obtener la historia clínica", error);
    } [];
  };

  const handleViewHistory = (patientId) => {
    setSelectedPatient(patientId); // Guarda el paciente seleccionado
    fetchHistory(patientId); // Ahora sí se pide la historia del paciente correcto
  };

  const handleAddNote = async () => {
    if (note.trim()) {
      try {
        await addNote(selectedPatient, note);
        setNote(""); // Limpiar el campo de la nota
        fetchHistory(selectedPatient); // Refrescar la historia clínica
      } catch (error) {
        console.error("Error al agregar la nota", error);
      }
    }
  };

  return (
    <> 
    <Layout>
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title">Panel de Administración</p>
          <p className="subtitle">Gestionar Turnos y Evoluciones</p>
        </div>
      </section>
      <div className="container mt-5">
        <p className="subtitle">Gestionar Turnos</p>
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
              
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patient?.name || "Sin nombre"}</td>
                <td>{appointment.date ? new Date(appointment.date).toLocaleDateString() : "Fecha no disponible"}</td>
                <td>{appointment.date ? new Date(appointment.date).toLocaleTimeString() : "Hora no disponible"}</td>
                <td>
                  <span className={`tag ${appointment.status === "Confirmado" ? "is-success" : "is-warning"}`}>
                    {appointment.status || "Pendiente"}
                  </span>
                </td>
                <td>
                  <div className="buttons">
                  <button className="button is-info is-small" onClick={() => handleViewHistory(appointment.patient?._id)}>📖 Ver Historia</button>
                  <button className="button is-danger is-small" onClick={() => handleCancel(appointment._id)}>❌ Cancelar</button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        {selectedPatient && (
          <div className="box">
            <h3 className="subtitle">Historia Clínica de <span className="tag is-link is-light ml-2">{selectedPatient}</span></h3>
            <div className="field">
            <div className="control">
              <textarea 
                className="textarea" 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="Escribe una nota sobre la evolución del paciente"
              />
            </div>
            </div>
              
              <button className="button is-primary" onClick={handleAddNote}>➕ Agregar Nota</button>

            <h4 className="subtitle mt-4">Notas de la Historia</h4>
            <div className="content">
              <ul>
                {history.notes?.map((note, index) => (
                  <li key={index} className="box">
                    <strong>{new Date(note.date).toLocaleDateString()}</strong>: {note.note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout> 
    </>
  );
};

export { AdminPanel };
