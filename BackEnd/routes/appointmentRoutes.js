import express from 'express';
import authMiddleware from '../middleware/authMiddleware';

const appointmentRouter = express.Router();

router.post("/", authMiddleware, (req, res) => {
    res.json({ message: "Turno agendado con éxito" });
  });
  
  router.put("/:id", authMiddleware, (req, res) => {
    res.json({ message: "Turno modificado con éxito" });
  });
  
  router.delete("/:id", authMiddleware, (req, res) => {
    res.json({ message: "Turno eliminado con éxito" });
  });
  
  export { appointmentRouter };