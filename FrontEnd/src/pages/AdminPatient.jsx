import { useEffect, useState } from "react";
import { 
  getAllPatients, 
  createPatient, 
  updateUser,
  getAppointmentsByPatient, 
  scheduleAppointment, 
  cancelAppointment 
  } from "../services/api";
import { Layout } from "../components/Layout";

const AdminPatient = () => {
    const [patients, setPatients] = useState([]); // Lista de pacientes
    const [form, setForm] = useState({ name: "", email: "", password: "123456", role: "patient" }); // Formulario para crear pacientes
    const [editing, setEditing] = useState(null); // ID del paciente a editar
    const [appointments, setAppointments] = useState({}); // Turnos por paciente
    const [appointmentForm, setAppointmentForm] = useState({ patientId: "", date: "", reason: "", status: "pending" }); // Formulario para agendar turnos
    const [selectedPatientId, setSelectedPatientId] = useState(""); // ID del paciente seleccionado
    const [searchPatient, setSearchPatient] = useState(""); // Filtro de pacientes
    const [appointmentFilter, setAppointmentFilter] = useState("all"); // Filtro de turnos por estado


    useEffect(() => {
        //fetch para obtener todos los pacientes
      const fetchPatients = async () => {
        try {
          const data = await getAllPatients();
          const sortedPatients = data.sort((a, b) => a.name.localeCompare(b.name));
          setPatients(data);
        } catch (error) {
          console.error("❌ Error al obtener pacientes:", error);
        }
      };
      fetchPatients();
  }, []);

    //funcion para editar pacientes
     const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    //fetch para obtener los turnos de un paciente
    const fetchAppointments = async (patientId) => {
        try {
            const data = await getAppointmentsByPatient(patientId);
            const sortedAppointments = data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setAppointments ({[patientId]: data });
            setSelectedPatientId(patientId); 
        } catch (error) {
            console.error("❌ Error al obtener turnos del paciente:", error);
        }
    };

    //funcion para CREAR o EDITAR pacientes
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateUser(editing, form);
            } else {
                await createPatient(form.name, form.email, "123456", "patient");
            }
            setForm({ name: "", email: "", password: "123456", role: "patient" });
            setEditing(null);
            const data = await getAllPatients();
            setPatients(data);
        } catch (error) {
            console.error("❌ Error al guardar paciente:", error);
        }
    };

    const handleEdit = (patient) => {
        setForm({ name: patient.name, email: patient.email,  role: patient.role });
        setEditing(patient._id);
    };
    
    //funcion para manejar el cambio de datos en el formulario de turnos
    /* const handleAppointmentChange = (e) => {
        let { name, value } = e.target;
        if (name === "date") {
            let date = new Date(value);
            let minutes = date.getMinutes();
            let roundedMinutes = Math.round(minutes / 10) * 10;
            date.setMinutes(roundedMinutes, 0, 0);
            value = date.toISOString().slice(0, 16);
        } 
      setAppointmentForm({ ...appointmentForm, [name]: value });
  }; */

  const handleAppointmentChange = (e) => {
      setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value 
      });
  };
    
    //funcion para AGENDAR turnos
    const handleScheduleAppointment = async (e) => {
      e.preventDefault();
      try {
          await scheduleAppointment(selectedPatientId, appointmentForm.date, appointmentForm.reason);
          setAppointmentForm({ patientId: "", date: "", reason: ""});
          fetchAppointments(selectedPatientId);
      } catch (error) {
          console.error("❌ Error al agendar turno:", error);
      }
  };

  const handleCancelAppointment = async (appointmentId, patientId) => {
    if (!window.confirm("¿Seguro que quieres cancelar este turno?")) return;
    try {
        await cancelAppointment(appointmentId);
        fetchAppointments(patientId);
    } catch (error) {
        console.error("❌ Error al cancelar turno:", error);
    }
  };

    return (
      <>
        <Layout>
        <div className="container">
            <h2 className="title is-3">Gestión de Pacientes</h2>

            

            {/* Filtro de Pacientes */}
            <input 
                type="text" 
                className="input mb-3" 
                placeholder="Buscar paciente por nombre..." 
                value={searchPatient} 
                onChange={(e) => setSearchPatient(e.target.value)}
            />

            {/* Lista de Pacientes con Turnos */}
            <table className="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {patients
                        .filter((p) => p.name.toLowerCase().includes(searchPatient.toLowerCase()))
                        .map((patient) => (
                        <tr key={patient._id}>
                            <td>{patient.name}</td>
                            <td>{patient.email}</td>
                            <td>
                                <button className="button is-small is-info" onClick={() => handleEdit(patient)}>Editar</button>
                                <button className="button is-small is-warning ml-2" onClick={() => fetchAppointments(patient._id)}>Ver Turnos</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Turnos por Paciente */}
            {Object.keys(appointments).map((patientId) => (
                <div key={patientId} className="box">
                    {/* Filtro de Turnos */}
                    <div className="select mb-3">
                        <select value={appointmentFilter} onChange={(e) => setAppointmentFilter(e.target.value)}>
                            <option value="all">Todos</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Realizado">Realizado</option>
                            <option value="Ausente">Ausente</option>
                        </select>
                    </div>
                    <h3 className="title is-5">Turnos de {patients.find(p => p._id === patientId)?.name}</h3>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Motivo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments[patientId] .filter((a) => appointmentFilter === "all" || a.status === appointmentFilter)
                                    .map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>
                                        <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                                            {new Date(appointment.date).toLocaleDateString("es-AR")}
                                        </span>
                                        {new Date(appointment.date).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}
                                    </td>
                                    <td>{appointment.reason}</td>
                                    <td> 
                                        <div className={`is-medium tag
                                            ${appointment.status === "Pendiente" ? "has-background-warning-light" :
                                            appointment.status === "Realizado" ? "has-background-success" :
                                            appointment.status === "Ausente" ? "has-background-danger-light" : ""}`}
                                        >
                                            {appointment.status}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="button is-small is-danger" onClick={() => handleCancelAppointment(appointment._id, patientId)}>Cancelar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Formulario para Agendar Turno */}
                    <form onSubmit={handleScheduleAppointment} className="box">
                        <h3 className="title is-4">Agendar Turno</h3>
                        <h3 className="title is-5">{patients.find(p => p._id === selectedPatientId)?.name || ""}</h3>
        
                        <div className="field">
                            <label className="label">Fecha y Hora</label>
                            <div className="field has-addons">
                                <div className="control">
                                    <input 
                                    className="input" 
                                    type="date" 
                                    name="date" 
                                    value={appointmentForm.date?.split('T')[0] || ''} 
                                    onChange={handleAppointmentChange} 
                                    required 
                                    />
                                </div>

                                <div className="control">
                                    <div className="select">
                                    <select 
                                        name="time"
                                        value={appointmentForm.date?.split('T')[1] || ''}
                                        onChange={(e) => {
                                            const date = appointmentForm.date?.split('T')[0] || new Date().toISOString().split('T')[0];
                                            setAppointmentForm({
                                                ...appointmentForm,
                                                date: `${date}T${e.target.value}`
                                            });
                                        }}
                                        required
                                    >
                                        {Array.from({ length: 12 }, (_, index) => {  // 16 horas desde 8:00 hasta 23:00
                                        const hour = index + 8; // Empezamos desde la hora 8
                                        const formattedHour = hour.toString().padStart(2, '0');
                                        return Array.from({ length: 6 }, (_, minuteIndex) => {
                                            const minutes = (minuteIndex * 10).toString().padStart(2, '0');
                                            return (
                                            <option key={`${formattedHour}:${minutes}`} value={`${formattedHour}:${minutes}`}>
                                                {`${formattedHour}:${minutes}`}
                                            </option>
                                            );
                                        });
                                        }).flat()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Motivo</label>
                            <input className="input" type="text" name="reason" value={appointmentForm.reason} onChange={handleAppointmentChange} required />
                        </div>

                        <button type="submit" className="button is-success">Agendar Turno</button>
                    </form>
                </div>
            ))}

            {/* Formulario para crear Pacientes */}
            <form onSubmit={handleSubmit} className="box">
            <h3 className="title is-4">Crear nuevo Paciente</h3>
                <div className="field">
                    <label className="label">Nombre</label>
                    <input className="input" type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>

                <button type="submit" className="button is-primary">{editing ? "Actualizar" : "Crear"}</button>
            </form>
        </div>
        </Layout>
      </>
    );
};

export { AdminPatient };
