import { ClinicalHistory } from "../models/clinicalHistoryModel.js"; 
import { User } from '../models/userModel.js'

const getClinicalHistory = async (req, res) => {
  try {
    const history = await ClinicalHistory.findOne({ user: req.params.id });
    
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

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

const editNote = async (req, res) => {
  const { noteId } = req.params;
  const { note } = req.body;

  try {
    const history = await ClinicalHistory.findOne({  user: req.params.id });

    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }

    const noteIndex = history.notes.findIndex(n => n._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    history.notes[noteIndex].note = note;
    await history.save();

    res.status(200).json({ message: "Nota actualizada correctamente", updatedNote: history.notes[noteIndex] });
  } catch (error) {
    console.error("❌ Error al editar la nota:", error);
    res.status(500).json({ message: "Error al editar la nota" });
  }
};

const removeNote = async (req, res) => {
  const { noteId } = req.params;
  const { userId } = req.params.id
  
  try {
    const history = await ClinicalHistory.findOne({ user: req.params.id });

    if (!history) {
      return res.status(404).json({ message: "Historia clínica no encontrada" });
    }

    const noteIndex = history.notes.findIndex(n => n._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    history.notes.splice(noteIndex, 1);
    await history.save();

    res.status(200).json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar la nota:", error);
    res.status(500).json({ message: "Error al eliminar la nota" });
  }
};

export {
    getClinicalHistory,
    addNote,
    editNote,
    removeNote
}
