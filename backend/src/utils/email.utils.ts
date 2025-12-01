import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "../templates/verifyEmail.template";

const { EMAIL_USER, EMAIL_PASS, CLIENT_URL } = process.env;
if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("Missing required environment variables for email sending.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface SendVerificationEmailOptions {
  email: string;
  name: string;
  token: string;
}

export const sendVerificationEmail = async ({
  email,
  name,
  token,
}: SendVerificationEmailOptions): Promise<void> => {
  const link = `${CLIENT_URL}/verify-email?email=${email}&token=${token}`;

  const html = verifyEmailTemplate(name, link);

  try {
    await transporter.sendMail({
      from: `"Read Stack" <${EMAIL_USER}>`,
      to: email,
      subject: "Verify your ArticleFlow email",
      html,
    });

    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};
