import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  getAllAppointments, 
  cancelAppointment, 
  getClinicalHistory, 
  addNote, 
  removeNote, 
  editNote,  
  updateAppointmentStatus,
} from "../services/api";
import { Layout } from "../components/Layout";

const AdminPanel = () => {
  const { user, loading, token } = useContext(AuthContext); 
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState({});
  const [note, setNote] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState(""); 

  useEffect(() => {
    //fetch para obtener todos los turnos
    const fetchAppointments = async () => {
      try {
        if (!token) return console.error("❌ No hay token disponible");
        
        const data = await getAllAppointments(token); 
        setAppointments(data);
      } catch (error) {
        console.error("❌ Error al obtener turnos:", error);
      }
    };
    fetchAppointments();
  }, [user, token]);

  //fetch para obtener la historia clínica de un paciente
  const fetchHistory = async (patientId, patientName) => {
    if (!patientId) return console.error("❌ Error: patientId es undefined");
    try {
      setSelectedPatient(patientId);
      setSelectedPatientName(patientName);

       // Obtener token
      if (!token) return console.error("❌ No hay token disponible");

      const data = await getClinicalHistory(patientId, token);
      setHistory(data);
    } catch (error) {
      console.error("❌ Error al obtener la historia clínica:", error);
    }
  };

  //funcion para AGREGAR notas a la historia clínica
  const handleAddNote = async () => {
    if (!note.trim()) return alert("La nota no puede estar vacía");
    try {
      
      if (!token) return console.error("❌ No hay token disponible");

      await addNote(selectedPatient, note, token);
      setHistory(prev => ({ ...prev, notes: [...prev.notes, { date: new Date(), note }] }));
      setNote("");
    } catch (error) {
      console.error("❌ Error al agregar la nota:", error);
    }
  };

  //funcion para EDITAR notas a la historia clínica
  const handleEditNote = async (noteId) => {
    try {
      
      if (!token) return console.error("❌ No hay token disponible");
        await editNote(selectedPatient, noteId, editedNote, token);
        setHistory((prev) => ({
            ...prev,
            notes: prev.notes.map((note) =>
                note._id === noteId ? { ...note, note: editedNote } : note
            ),
        }));
        setEditingNoteId(null);  // Salir del modo edición
    } catch (error) {
        console.error("❌ Error al editar nota:", error);
    }
};
  //funcion para ELIMINAR notas de la historia clínica
  const deleteNote = async (noteId) => {
    
    if (!window.confirm("¿Seguro que quieres eliminar esta nota?")) return;
  
    try {
      
      if (!token) return console.error("❌ No hay token disponible");

      await removeNote(selectedPatient, noteId, token);
      setHistory((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note._id !== noteId),
      }));
    } catch (error) {
      console.error("❌ Error al eliminar nota:", error);
    }
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
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app._id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("❌ Error al actualizar estado del turno:", error);
      alert("Hubo un error al cambiar el estado del turno.");
    }
  };


  if (loading) return <div>🔄 Cargando...</div>;

  return (
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
                    <select className={`select is-small
                    ${appointment.status === "Pendiente" ? "has-background-warning-light" :
                    appointment.status === "Realizado" ? "has-background-success" :
                    appointment.status === "Ausente" ? "has-background-danger-light" : ""}`}
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}>
                      <option value="Pendiente" >Pendiente</option>
                      <option value="Realizado" >Realizado</option>
                      <option value="Ausente" >Ausente</option>  
                    </select>
                </td>
                <td>
                  <div className="buttons">
                    <button className="button is-info is-small" onClick={() => fetchHistory(appointment.patient?._id, appointment.patient?.name)}>
                      📖 Ver Historia
                    </button>
                    <button className="button is-danger is-small" onClick={() => handleCancel(appointment._id)}>
                      ❌ Cancelar
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedPatient && (
          <div className="box">
            <h3 className="subtitle">
              Historia Clínica de <span className="tag is-link is-light ml-2">{selectedPatientName}</span>
            </h3>
            <div className="field">
              <textarea 
                className="textarea" 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="Escribe una nota sobre la evolución del paciente"
              />
            </div>
            <button className="button is-primary" onClick={handleAddNote}>➕ Agregar Nota</button>

            <h4 className="subtitle mt-4">Notas de la Historia</h4>
            <div className="content">
              <ul>
                {history.notes?.length > 0 ? (
                  history.notes?.map((note) => (
                    
                    <li key={note._id} className="box">
                      <strong>{new Date(note.date).toLocaleDateString()}</strong>:{" "} 
                      {editingNoteId === note._id ? (
                        <>
                          <input
                            type="text"
                            value={editedNote}
                            onChange={(e) => setEditedNote(e.target.value)}
                            className="input"
                          />
                          <div className="buttons pt-3">
                            <button className="button is-success is-small ml-2" onClick={() => handleEditNote(note._id)}>
                              💾 Guardar
                            </button>
                            <button className="button is-light is-small ml-2" onClick={() => setEditingNoteId(null)}>
                              ❌ Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {note.note}
                          <div className="buttons is-flex is-justify-content-flex-end">
                            <button className="button is-info is-small ml-2" onClick={() => { 
                              setEditingNoteId(note._id);
                              setEditedNote(note.note);
                            }}>
                              ✏️ Editar
                            </button>
                            <button className="button is-danger is-small ml-2" onClick={() => deleteNote(note._id)}>
                              🗑️ Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </li>

                  ))
                ) : (
                  <p className="tag is-warning">📌 No hay notas registradas</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export { AdminPanel };
