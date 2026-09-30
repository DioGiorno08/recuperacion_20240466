import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

export const sendVerificationEmail = async (email, code) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `Recuperacion Backend <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Codigo de verificacion",
    text: `Tu codigo de verificacion es ${code}. Vence en 10 minutos.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#111827">Verifica tu correo</h2>
        <p>Usa el siguiente codigo para completar tu registro:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#2563eb;margin:24px 0">${code}</div>
        <p>El codigo vence en 10 minutos.</p>
        <p style="color:#6b7280;font-size:13px">Si no solicitaste este registro, ignora el mensaje.</p>
      </div>
    `,
  });
};
