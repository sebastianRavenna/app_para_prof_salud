import { sendVerificationEmail } from "./utils/emailService.js";

sendVerificationEmail("sebastian.ravenna@gmail.com", "123456")
    .then(() => console.log("✅ Email enviado"))
    .catch((err) => console.error("❌ Error:", err));
