import { useState, useEffect, useContext } from "react";
import { AppointmentForm } from "../components/AppointmentForm";
import { Dashboard } from "./Dashboard";
import { Layout } from "../components/Layout";
import { getPatientAppointments } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const data = await getPatientAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
      }
    };
    fetchAppointments();
  }, [user]);

  const addAppointment = (newAppointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
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
                  <Dashboard appointments={appointments} />
                </div>
            </div>
        </div>
    </Layout> 
    </>
  );
};

export { Appointments };
