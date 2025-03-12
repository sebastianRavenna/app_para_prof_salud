import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_RESEND = process.env.EMAIL_RESEND
const sendVerificationEmail = async (email, code) => {
    try {
        const verificationLink = `${process.env.LOCAL_HOST}/verifyAccount?email=${email}`;

        const response = await resend.emails.send({
          from: EMAIL_RESEND,
          to: email,
          subject: "Verificación de cuenta",
          text: `Tu código de verificación es: ${code}\nVerificá tu cuenta aquí: ${verificationLink}`
        });
        console.log("📧 Email de verificación enviado desde", process.env.EMAIL_RESEND);
        console.log("📧 Email de verificación enviado a", email);
        return response;
    } catch (error) {
        console.error("❌ Error enviando email:", error.response || error.message);
        throw new Error(error.response?.data || error.message);
    }
};

export { sendVerificationEmail }