import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY:", success);
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log("MULAI KIRIM EMAIL...");
    console.log("TUJUAN:", to);

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log("EMAIL BERHASIL DIKIRIM");
    console.log(info.response);

    return info;
  } catch (error) {
    console.error("EMAIL GAGAL DIKIRIM:");
    console.error(error);
  }
};
