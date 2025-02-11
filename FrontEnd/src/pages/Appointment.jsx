import { AppointmentForm } from "../components/AppointmentForm";
import { Dashboard } from "./Dashboard";
import { Layout } from "../components/Layout";

const Appointments = () => {
    
  return (
    <><Layout>
        <div className="container mt-5">
            <h1 className="title has-text-centered">Gestión de Turnos</h1>
            <div className="columns">
                <div className="column is-half">
                <AppointmentForm />
                </div>
                <div className="column is-half">
                <Dashboard />
                </div>
            </div>
        </div>
    </Layout> 
    </>
  );
};

export { Appointments };
