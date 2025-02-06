import nodemailer from 'nodemailer';
import { User } from '../models/userModel.js';

const getTransporter = async () => {
  const admin = await User.findOne({ role: "admin" });

  if (!admin || !admin.emailConfig.user || !admin.emailConfig.pass) {
    console.error("❌ No hay credenciales de email configuradas.");
    return null;
  }

  return nodemailer.createTransport({
    service: admin.emailConfig.service,
    auth: {
      user: admin.emailConfig.user,
      pass: admin.emailConfig.pass,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) return;

    await transporter.sendMail({
      from: `"Consultorio" <${transporter.options.auth.user}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email enviado a: ${to}`);
  } catch (error) {
    console.error("❌ Error enviando email:", error);
  }
};

export { sendEmail };