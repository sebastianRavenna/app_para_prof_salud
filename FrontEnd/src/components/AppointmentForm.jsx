import { useState, useEffect } from "react";
import { requestAppointment, getBookedAppointments } from "../services/api";
import PropTypes from 'prop-types';
/* import { toast } from "react-toastify"; */

const AppointmentForm = ({addAppointment}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [bookedTimes, setBookedTimes] = useState([])
  
  useEffect(() => {
    if (!date) return;

    const fetchAppointments = async (selectedDate) => {
      try {
          const booked = await getBookedAppointments();

          // Filtra los turnos que coincidan con la fecha seleccionada
          const formattedBooked = booked
              .filter(app => app.date === selectedDate) // Compara con la fecha actual seleccionada
              .map(app => app.time); // Extrae solo las horas reservadas para ese día
              setBookedTimes(formattedBooked);
      } catch (error) {
          console.error("Error al obtener turnos ocupados:", error);
      }
  };

    fetchAppointments(date);
  }, [date]);

  // Generar horarios disponibles filtrando los ocupados
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) {
      ["00", "30"].forEach(min => {
        const timeSlot = `${hour.toString().padStart(2, "0")}:${min}`;
        if (!bookedTimes.includes(timeSlot)) {
          options.push(timeSlot);
        }
      });
    }
    return options;
  };

  const handleAppointmentRequest = async (e) => {
    e.preventDefault();
    
    if (!date || !time) {
      setMessage("❌ Debes seleccionar fecha y hora.");
      return;
    }

    const appointmentDateTime = `${date}T${time}:00`;

    try {
      const response = await requestAppointment(appointmentDateTime, reason);

      if (response && response.appointment) {
        addAppointment(response.appointment);
        setMessage("✅ Turno solicitado correctamente.");
        setDate("");
        setTime("");
        setReason("");
        setBookedTimes(prev => [...prev, time]);
      } else {
        console.error("Estructura de respuesta incorrecta:", response);
        setMessage("❌ Error en la estructura de la respuesta.");
      }

    } catch (error) {
      console.error("Error completo:", error);
      const errorMessage = error.response?.data?.message || "Error al solicitar el turno";
      setMessage(`❌ ${errorMessage}`);
    }
  };
  
  
  return (
    <div className="box">
      <h2 className="title is-4">Solicitar Turno</h2>
      {message && <p className="notification">{message}</p>}
      <form onSubmit={handleAppointmentRequest}>
      <div className="field">
      <label className="label">Fecha</label>
      <div className="control">
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          />
      </div>
    </div>

    <div className="field">
      <label className="label">Hora</label>
      <div className="control">
        <div className="select">
          <select value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">Selecciona una hora</option>
            {generateTimeOptions().map((timeOption) => (
              <option key={timeOption} value={timeOption}>
                {timeOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

        <div className="field">
          <label className="label">Motivo</label>
          <div className="control">
            <textarea
              className="textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              maxLength={500} // Limitar longitud
              placeholder="Describe brevemente el motivo de tu consulta"
              ></textarea>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Solicitar Turno
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

AppointmentForm.propTypes = {
  addAppointment: PropTypes.func.isRequired,
}; 

export { AppointmentForm };
