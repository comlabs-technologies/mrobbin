import nodemailer from "nodemailer";
import QRCode from "qrcode";
import {
  bookingPassSurprise,
  GUEST_EMAIL,
  GUEST_NAME,
  STAY_BRAND,
} from "@/lib/content";
import { BOOKING_QR_CID, buildBookingConfirmationEmail } from "./booking-pass-email";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  };
}

export async function sendBookingConfirmationEmail() {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env.local",
    );
  }

  const qrBuffer = await QRCode.toBuffer(bookingPassSurprise.url, {
    type: "png",
    width: 160,
    margin: 1,
    color: { dark: "#222222", light: "#ffffff" },
  });

  const { html, text } = buildBookingConfirmationEmail();
  const from = process.env.SMTP_FROM ?? `"${STAY_BRAND}" <${smtpConfig.auth.user}>`;

  const transporter = nodemailer.createTransport(smtpConfig);

  await transporter.sendMail({
    from,
    to: GUEST_EMAIL,
    subject: `Booking confirmed at ${STAY_BRAND}`,
    text,
    html,
    replyTo: process.env.SMTP_REPLY_TO ?? smtpConfig.auth.user,
    attachments: [
      {
        filename: "booking-qr.png",
        content: qrBuffer,
        cid: BOOKING_QR_CID,
        contentType: "image/png",
        contentDisposition: "inline",
      },
    ],
  });

  return { to: GUEST_EMAIL, guestName: GUEST_NAME };
}
