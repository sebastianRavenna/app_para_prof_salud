const emailTemplates = {
    appointmentBooked: (name, date) => `
      <h2>¡Turno Confirmado!</h2>
      <p>Hola ${name},</p>
      <p>Tu turno ha sido agendado para el <strong>${date}</strong>.</p>
      <p>¡Nos vemos pronto!</p>
    `,
    
    appointmentCancelled: (name, date) => `
      <h2>Turno Cancelado</h2>
      <p>Hola ${name},</p>
      <p>Tu turno programado para el <strong>${date}</strong> ha sido cancelado.</p>
      <p>Si fue un error, por favor agenda un nuevo turno.</p>
    `,
  
    appointmentReminder: (name, date) => `
      <h2>Recordatorio de Turno</h2>
      <p>Hola ${name},</p>
      <p>Te recordamos que tienes un turno agendado para el <strong>${date}</strong>.</p>
      <p>¡Te esperamos!</p>
    `,
  
    feedbackRequest: (name) => `
      <h2>¿Cómo fue tu experiencia?</h2>
      <p>Hola ${name},</p>
      <p>Queremos saber tu opinión sobre la consulta. ¿Nos dejas un comentario?</p>
      <a href="https://example.com/feedback">Dejar mi opinión</a>
    `,
  };
  
export { emailTemplates };
  