import { ClinicalHistory } from "../models/clinicalHistoryModel.js"; 
import { User } from '../models/userModel.js'

const getClinicalHistory = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    
    const history = await ClinicalHistory.findOne({ user: req.params.id });
    if (!history) return res.status(404).json({ msg: "Historia clínica no encontrada" });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la historia clínica");
  }
};

const addNote = async (req, res) => {
  const { note } = req.body;
  try {
    let history = await ClinicalHistory.findOne({ user: req.params.id });
    if (!history) {
      history = new ClinicalHistory({ user: req.params.id });
    }
    history.notes.push({ note });
    await history.save();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar la nota");
  }
};

export {
    getClinicalHistory,
    addNote
}
