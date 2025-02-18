import { connectDB } from "./config/connectDB.js";
import { Appointment } from "./models/appointmentModel.js";
import { User } from "./models/userModel.js";
import mongoose from "mongoose";




async function testRelation() {
    await connectDB();
    try{ 
        console.log("\n🔎 LISTANDO PACIENTES:");
        const users = await User.find().select("name email _id");
        console.log(users);

        console.log("\n📅 LISTANDO TURNOS:");
        const appointments = await Appointment.find();
        console.log(appointments);

        console.log("\n🔄 LISTANDO TURNOS CON PACIENTES POPULADOS:");
        const populatedAppointments = await Appointment.find().populate("patient", "name email");
        console.log(populatedAppointments);

  } catch (error) {
        console.error("Error en la consulta:", error);
  } finally {
        mongoose.connection.close();
  }
}
testRelation();
