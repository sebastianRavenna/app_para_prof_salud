import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  getClinicalHistory, 
  addNote, 
  removeNote, 
  editNote,
  getPatientFiles,
  uploadFile,
  deleteFile
} from "../services/api.js";
import PropTypes from "prop-types";

const ClinicalHistory = ({ patientId, patientName, onClose }) => {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState({});
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const [selectedTab, setSelectedTab] = useState('notes');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchHistory();
      fetchPatientFiles();
    }
  }, [patientId]);

  // Fetch de la historia clínica
  const fetchHistory = async () => {
    try {
      if (!token) return console.error("❌ No hay token disponible");
      const data = await getClinicalHistory(patientId, token);
      setHistory(data);
    } catch (error) {
      console.error("❌ Error al obtener la historia clínica:", error);
    }
  };

  // Fetch de los archivos
  const fetchPatientFiles = async () => {
    try {
      const data = await getPatientFiles(patientId);
      setFiles(data);
    } catch (error) {
      console.error("❌ Error al obtener archivos:", error);
    }
  };

  const handlePrint = () => {
  // Eliminar cualquier elemento printable-area anterior que pudiera existir
  const oldPrintable = document.getElementById('printable-area');
  if (oldPrintable) {
    document.body.removeChild(oldPrintable);
  }
  
  // Crear un nuevo elemento de estilo para controlar la impresión
  const printStyle = document.createElement('style');
  printStyle.id = 'print-style';
  printStyle.innerHTML = `
    @media print {
      @page { margin: 1cm; }
      body * { visibility: hidden; }
      #printable-area, #printable-area * { visibility: visible; }
      #printable-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        hight: auto;
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  `;
  document.head.appendChild(printStyle);
  
  // Crear un elemento temporal para imprimir
  const printableArea = document.createElement('div');
  printableArea.id = 'printable-area';
  printableArea.style.display = 'block';
  printableArea.style.position = 'absolute';
  printableArea.style.left = '0';
  printableArea.style.top = '0';
  printableArea.style.width = '100%';
  document.body.appendChild(printableArea);
  
  // Generar el contenido HTML para imprimir
  printableArea.innerHTML = `
    <div class="clinical-print-container">
      <header class="print-header">
        <h1>Historia Clínica</h1>
        <h2>${patientName}</h2>
        <p>Fecha de impresión: ${new Date().toLocaleDateString('es-AR')}</p>
      </header>
      
      <section class="print-section">
        <h3>📝 Notas del paciente</h3>
        ${history.notes?.length > 0 
          ? `<ul class="print-notes-list">
              ${history.notes.map(note => 
                `<li>
                  <div class="note-date">${new Date(note.date).toLocaleDateString('es-AR')}</div>
                  <div class="note-content">${note.note}</div>
                </li>`
              ).join('')}
            </ul>`
          : '<p class="no-data">No hay notas registradas</p>'
        }
      </section>
      
      <section class="print-section">
        <h3>📂 Archivos Adjuntos</h3>
        ${files.length > 0 
          ? `<ul class="print-files-list">
              ${files.map(file => 
                `<li>
                  <span class="file-name">${file.filename}</span>
                  <span class="file-date">Subido el: ${new Date(file.uploadDate).toLocaleDateString('es-AR')}</span>
                </li>`
              ).join('')}
            </ul>`
          : '<p class="no-data">No hay archivos adjuntos</p>'
        }
      </section>
    </div>
  `;
  
  // Dejar que el DOM se actualice antes de imprimir
  setTimeout(() => {
    window.print();
    
    // Eliminar el elemento temporal y los estilos después de imprimir
    setTimeout(() => {
      document.body.removeChild(printableArea);
      const styleElement = document.getElementById('print-style');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    }, 1000);
  }, 200);
};

  // Función para agregar nota
  const handleAddNote = async () => {
    if (!note.trim()) return alert("La nota no puede estar vacía");
    try {
      if (!token) return console.error("❌ No hay token disponible");
      await addNote(patientId, note, token);
      setHistory(prev => ({ ...prev, notes: [...(prev.notes || []), { date: new Date(), note }] }));
      setNote("");
    } catch (error) {
      console.error("❌ Error al agregar la nota:", error);
    }
  };

  // Función para editar nota
  const handleEditNote = async (noteId) => {
    try {
      if (!token) return console.error("❌ No hay token disponible");
      await editNote(patientId, noteId, editedNote, token);
      setHistory((prev) => ({
        ...prev,
        notes: prev.notes.map((note) =>
          note._id === noteId ? { ...note, note: editedNote } : note
        ),
      }));
      setEditingNoteId(null);
    } catch (error) {
      console.error("❌ Error al editar nota:", error);
    }
  };

  // Función para eliminar nota
  const deleteNote = async (noteId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta nota?")) return;
    try {
      if (!token) return console.error("❌ No hay token disponible");
      await removeNote(patientId, noteId, token);
      setHistory((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note._id !== noteId),
      }));
    } catch (error) {
      console.error("❌ Error al eliminar nota:", error);
    }
  };

  // Función para subir archivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      await uploadFile(patientId, file);
      fetchPatientFiles();
      event.target.value = null; // Limpiar el input de archivo
    } catch (error) {
      console.error("❌ Error al subir archivo:", error);
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  // Función para eliminar archivo
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este archivo?")) return;
    try {
      if (!token) return console.error("❌ No hay token disponible");
      await deleteFile(patientId, fileId, token);
      setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
    } catch (error) {
      console.error("❌ Error al eliminar archivo:", error);
      alert("Error al eliminar el archivo");
    }
  };

  // Función para determinar el tipo de archivo
  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'other';
    }
  };

  return (
    <div className="box clinical-history">
      <div className="clinical-history-header">
        <h3 className="subtitle">
          Historia Clínica de <span className="tag is-link is-light ml-2">{patientName}</span>
        </h3>
        <div className="buttons">
          <button className="button is-info is-small" onClick={handlePrint}>
            <span className="icon"><i className="fas fa-print"></i></span>
            <span>Imprimir / Guardar PDF</span>
          </button>
          {onClose && (
            <button className="button is-danger is-small" onClick={onClose}>
              <span className="icon">
                <i className="fas fa-times"></i>
              </span>
              <span>Cerrar</span>
            </button>
          )}
        </div>
      </div>

      <div className="tabs is-boxed">
        <ul>
          <li className={selectedTab === 'notes' ? 'is-active' : ''}>
            <a onClick={() => setSelectedTab('notes')}>
              <span className="icon"><i className="fas fa-clipboard"></i></span>
              <span>Notas</span>
            </a>
          </li>
          <li className={selectedTab === 'files' ? 'is-active' : ''}>
            <a onClick={() => setSelectedTab('files')}>
              <span className="icon"><i className="fas fa-file-medical"></i></span>
              <span>Archivos</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Contenido de la pestaña de notas */}
      {selectedTab === 'notes' && (
        <div className="clinical-history-content">
          <div className="field">
            <textarea 
              className="textarea" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Escribe una nota sobre la evolución del paciente"
            />
          </div>
          <button className="button is-primary" onClick={handleAddNote}>➕ Agregar Nota</button>

          <h4 className="subtitle mt-4">Notas de la Historia</h4>
          <div className="content">
            <ul className="notes-list">
              {history.notes?.length > 0 ? (
                history.notes.map((note) => (
                  <li key={note._id} className="box note-item">
                    <strong>{new Date(note.date).toLocaleDateString('es-AR')}</strong>:{" "} 
                    {editingNoteId === note._id ? (
                      <div>
                        <input
                          type="text"
                          value={editedNote}
                          onChange={(e) => setEditedNote(e.target.value)}
                          className="input"
                        />
                        <div className="buttons pt-3">
                          <button className="button is-success is-small ml-2" onClick={() => handleEditNote(note._id)}>
                            💾 Guardar
                          </button>
                          <button className="button is-light is-small ml-2" onClick={() => setEditingNoteId(null)}>
                            ❌ Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="note-content">{note.note}</div>
                        <div className="buttons is-flex is-justify-content-flex-end">
                          <button className="button is-info is-small ml-2" onClick={() => { 
                            setEditingNoteId(note._id);
                            setEditedNote(note.note);
                          }}>
                            ✏️ Editar
                          </button>
                          <button className="button is-danger is-small ml-2" onClick={() => deleteNote(note._id)}>
                            🗑️ Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              ) : (
                <p className="tag is-warning">📌 No hay notas registradas</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña de archivos */}
      {selectedTab === 'files' && (
        <div className="clinical-history-content">
          <div className="file-upload-container">
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input 
                  className="file-input" 
                  type="file" 
                  name="file" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    {uploading ? "Subiendo..." : "Seleccionar archivo"}
                  </span>
                </span>
              </label>
            </div>
            <p className="help">Formatos permitidos: imágenes (JPG, PNG) y documentos (PDF)</p>
          </div>

          <h4 className="subtitle mt-4">Archivos adjuntos</h4>
          <div className="content">
            {files.length > 0 ? (
              <div className="files-container">
                {files.map((file) => (
                  <div key={file._id} className="file-item box">
                    <div className="file-item-content">
                      <div className="file-preview">
                        {getFileType(file.filename) === 'image' ? (
                          <img src={file.url} alt={file.filename} className="file-thumbnail" />
                        ) : getFileType(file.filename) === 'pdf' ? (
                          <div className="pdf-preview">
                            <i className="fas fa-file-pdf fa-3x"></i>
                          </div>
                        ) : (
                          <div className="file-icon">
                            <i className="fas fa-file fa-3x"></i>
                          </div>
                        )}
                      </div>
                      <div className="file-info">
                        <p className="file-name">{file.filename}</p>
                        <p className="file-date">Subido el: {new Date(file.uploadDate).toLocaleDateString('es-AR')}</p>
                      </div>
                    </div>
                    <div className="file-actions">
                      <a href={file.url} download className="button is-info is-small mr-2">
                        <span className="icon"><i className="fas fa-download"></i></span>
                        <span>Descargar</span>
                      </a>
                      {getFileType(file.filename) === 'pdf' && (
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="button is-primary is-small mr-2">
                          <span className="icon"><i className="fas fa-eye"></i></span>
                          <span>Ver</span>
                        </a>
                      )}
                      <button className="button is-danger is-small" onClick={() => handleDeleteFile(file._id)}>
                        <span className="icon"><i className="fas fa-trash"></i></span>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="tag is-warning">📌 No hay archivos adjuntos</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ClinicalHistory.propTypes = {
  patientId: PropTypes.string.isRequired,
  patientName: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export { ClinicalHistory };