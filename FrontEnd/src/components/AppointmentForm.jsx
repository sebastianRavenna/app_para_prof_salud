import { useState, useContext } from "react";
import { requestAppointment } from "../services/api";
import PropTypes from 'prop-types';
import { AuthContext } from "../context/AuthContext";
/* import { toast } from "react-toastify"; */

const AppointmentForm = ({addAppointment}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) { // Rango de horario permitido
      options.push(`${hour.toString().padStart(2, "0")}:00`);
      options.push(`${hour.toString().padStart(2, "0")}:30`);
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
      }else {
        console.error("Estructura de respuesta incorrecta:", response);
        setMessage("❌ Error en la estructura de la respuesta.");
      }
      
    } catch (error) {
      console.error("Error completo:", error);
      const errorMessage = error.response?.data?.message || "Error al solicitar el turno";
      setMessage(`❌ ${errorMessage}`);
    }
  };
  
  AppointmentForm.propTypes = {
    addAppointment: PropTypes.func.isRequired,
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
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
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

export { AppointmentForm };
