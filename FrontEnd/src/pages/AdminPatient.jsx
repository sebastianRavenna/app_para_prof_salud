import { useEffect, useState } from "react";
import { 
  getAllPatients, 
  createPatient, 
  updateUser,
  getAppointmentsByPatient, 
  scheduleAppointment, 
  cancelAppointment,
  getBookedAppointments,
  updateAppointmentStatus 
  } from "../services/api";
import { Layout } from "../components/Layout";

const AdminPatient = () => {
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", password: "123456", role: "patient" });
    const [editing, setEditing] = useState(null);
    const [appointments, setAppointments] = useState({});
    const [appointmentForm, setAppointmentForm] = useState({ patientId: "", date: "", reason: "", status: "pending" });
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [searchPatient, setSearchPatient] = useState("");
    const [appointmentFilter, setAppointmentFilter] = useState("all");
    const [bookedTimes, setBookedTimes] = useState([]);
    const [showPatientForm, setShowPatientForm] = useState(false); // Initialize as false to keep form hidden

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getAllPatients();
                const sortedPatients = data.sort((a, b) => a.name.localeCompare(b.name));
                setPatients(data);
            } catch (error) {
                console.error("❌ Error al obtener pacientes:", error);
            }
        };

        const fetchBookedTimes = async () => {
            try {
                const data = await getBookedAppointments();
                setBookedTimes(data);
            } catch (error) {
                console.error("❌ Error al obtener turnos ocupados:", error);
            }
        };

        fetchPatients();
        fetchBookedTimes();
    }, []);

    const isTimeSlotBooked = (date, time) => {
        const formattedDate = date;
        return bookedTimes.some(
            bookedTime => bookedTime.date === formattedDate && bookedTime.time === time
        );
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const fetchAppointments = async (patientId) => {
        try {
            const data = await getAppointmentsByPatient(patientId);
            const sortedAppointments = data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setAppointments({[patientId]: data});
            setSelectedPatientId(patientId); 
        } catch (error) {
            console.error("❌ Error al obtener turnos del paciente:", error);
        }
    };

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
            setShowPatientForm(false); // Hide form after submission
            const data = await getAllPatients();
            setPatients(data);
        } catch (error) {
            console.error("❌ Error al guardar paciente:", error);
        }
    };

    const handleEdit = (patient) => {
        setForm({ name: patient.name, email: patient.email, role: patient.role });
        setEditing(patient._id);
        setShowPatientForm(true); // Show form when editing
    };
    
    const handleAppointmentChange = (e) => {
        setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value });
    };
    
    const handleScheduleAppointment = async (e) => {
        e.preventDefault();
        try {
            await scheduleAppointment(selectedPatientId, appointmentForm.date, appointmentForm.reason);
            setAppointmentForm({ patientId: "", date: "", reason: ""});
            const bookedData = await getBookedAppointments();
            setBookedTimes(bookedData);
            fetchAppointments(selectedPatientId);
        } catch (error) {
            console.error("❌ Error al agendar turno:", error);
        }
    };

    const handleCancelAppointment = async (appointmentId, patientId) => {
        if (!window.confirm("¿Seguro que quieres cancelar este turno?")) return;
        try {
            await cancelAppointment(appointmentId);
            const bookedData = await getBookedAppointments();
            setBookedTimes(bookedData);
            fetchAppointments(patientId);
        } catch (error) {
            console.error("❌ Error al cancelar turno:", error);
        }
    };

    const handleStatusChange = async (appointmentId, newStatus, patientId) => {
        if (!window.confirm("¿Seguro que quieres cambiar el estado de este turno?")) return;
        try {
            await updateAppointmentStatus(appointmentId, newStatus);
            // Refresh the appointments after status update
            fetchAppointments(patientId);
        } catch (error) {
            console.error("❌ Error al actualizar estado del turno:", error);
            alert("Hubo un error al cambiar el estado del turno.");
        }
    };

    const closeAppointmentsView = (patientId) => {
        const updatedAppointments = {...appointments};
        delete updatedAppointments[patientId];
        setAppointments(updatedAppointments);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
      <>
        <Layout>
        <div className="container">
            <section className="hero is-primary mb-6">
                <div className="hero-body">
                    <p className="title">Gestión de Pacientes</p>
                </div>
            </section>
            <h2 className="title is-3"></h2>

            <div className="is-flex is-justify-content mb-3">
                <input 
                    type="text" 
                    className="input mr-5" 
                    style={{ width: "70%" }}
                    placeholder="Buscar paciente por nombre..." 
                    value={searchPatient} 
                    onChange={(e) => setSearchPatient(e.target.value)}
                />
                
                <button 
                    className="button is-primary" 
                    onClick={() => setShowPatientForm(true)}
                >
                    Crear Paciente
                </button>
            </div>

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

            {Object.keys(appointments).map((patientId) => (
                <div key={patientId} className="box" style={{ position: 'relative' }}>
                    <button 
                        onClick={() => closeAppointmentsView(patientId)} 
                        className="delete is-medium buttonClose" 
                        aria-label="close"
                    ></button>
                    
                    <h3 className="title is-5">Turnos de {patients.find(p => p._id === patientId)?.name}</h3>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Motivo</th>
                                <th className="is-flex is-align-items-center">
                                    Estado
                                    <div className="select is-small ml-2">
                                        <select 
                                        value={appointmentFilter} 
                                        onChange={(e) => setAppointmentFilter(e.target.value)}
                                        aria-label="Filtrar por estado">
                                        <option value="all">Todos</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Realizado">Realizado</option>
                                        <option value="Ausente">Ausente</option>
                                        </select>
                                    </div>
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments[patientId]
                            .filter((a) => appointmentFilter === "all" || a.status === appointmentFilter)
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
                                    <div className="select">
                                            <select
                                                value={appointment.status}
                                                onChange={(e) => handleStatusChange(appointment._id, e.target.value, patientId)}
                                                className={`
                                                    ${appointment.status === "Pendiente" ? "has-background-warning-light" :
                                                    appointment.status === "Realizado" ? "has-background-success" :
                                                    appointment.status === "Ausente" ? "has-background-danger-light" : ""}
                                                `}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Realizado">Realizado</option>
                                                <option value="Ausente">Ausente</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="button is-small is-danger" onClick={() => handleCancelAppointment(appointment._id, patientId)}>Cancelar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleScheduleAppointment} className="box" style={{ position: 'relative' }}>
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
                                    min={today}
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
                                        {Array.from({ length: 32 }, (_, index) => {  // 16 horas desde 8:00 hasta 23:30
                                        const hour = Math.floor(index / 2) + 8; // Empezamos a las 8:00
                                        const minutes = index % 2 === 0 ? "00" : "30"; // Alternamos entre 00 y 30 minutos
                                        const timeStr = `${hour.toString().padStart(2, '0')}:${minutes}`;
                                        const isBooked = appointmentForm.date?.split('T')[0] && 
                                                         isTimeSlotBooked(appointmentForm.date?.split('T')[0], timeStr);
                                        
                                        // Solo incluimos horarios que no estén ocupados
                                        return !isBooked ? (
                                            <option key={timeStr} value={timeStr}>
                                                {timeStr}
                                            </option>
                                        ) : null;
                                        }).filter(Boolean)}
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

            {showPatientForm && (
                <div className="box" style={{ position: 'relative' }}>
                    {/* Botón X para cerrar el formulario de paciente */}
                    <button 
                        onClick={() => {
                            setShowPatientForm(false);
                            setEditing(null);
                            setForm({ name: "", email: "", password: "123456", role: "patient" });
                        }} 
                        className="delete is-medium" 
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                        aria-label="close"
                    ></button>
                    
                    <form onSubmit={handleSubmit}>
                        <h3 className="title is-4">{editing ? "Editar Paciente" : "Crear nuevo Paciente"}</h3>
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
            )}
        </div>
        </Layout>
      </>
    );
};

export { AdminPatient };