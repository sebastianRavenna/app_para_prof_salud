import { useState, useContext } from "react";
import { requestAppointment } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
/* import { toast } from "react-toastify"; */

const AppointmentForm = () => {
  /* const { token } = useContext(AuthContext); */
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await requestAppointment(date, reason);
      /* if (response.data && response.data.appointment) {
        addAppointment(response.data.appointment);
      } */
      setMessage("✅ Turno solicitado correctamente.");
      setDate("");
      setReason("");
      navigate("/appointments")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al solicitar el turno";
      setMessage("❌ Error al solicitar el turno.");
    }
  };

  return (
    <div className="box">
      <h2 className="title is-4">Solicitar Turno</h2>
      {message && <p className="notification">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Fecha y Hora</label>
          <div className="control">
            <input
              type="datetime-local"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)} // Evitar fechas pasadas
            />
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
