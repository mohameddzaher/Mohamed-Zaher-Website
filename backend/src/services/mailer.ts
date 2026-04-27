import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../utils/logger";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
  });
  return transporter;
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<void> {
  if (!env.SMTP_USER) {
    logger.warn("SMTP not configured — skipping email:", opts.subject);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? opts.html.replace(/<[^>]+>/g, ""),
      replyTo: opts.replyTo,
    });
  } catch (err) {
    logger.error("Email send failed:", err);
  }
}

export const mailTemplates = {
  contactNotification: (s: {
    name: string;
    email: string;
    company?: string;
    subject: string;
    message: string;
    budget?: string;
    type?: string;
  }) => ({
    subject: `[Portfolio] New inquiry: ${s.subject}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e5e5ee; padding: 32px; border-radius: 16px;">
        <h2 style="color: #22d3ee; margin: 0 0 16px;">New Contact Inquiry</h2>
        <p style="margin: 4px 0;"><b>From:</b> ${s.name} &lt;${s.email}&gt;</p>
        ${s.company ? `<p style="margin: 4px 0;"><b>Company:</b> ${s.company}</p>` : ""}
        ${s.budget ? `<p style="margin: 4px 0;"><b>Budget:</b> ${s.budget}</p>` : ""}
        ${s.type ? `<p style="margin: 4px 0;"><b>Type:</b> ${s.type}</p>` : ""}
        <h3 style="margin-top: 24px; color: #a78bfa;">${s.subject}</h3>
        <p style="line-height: 1.6; white-space: pre-line;">${s.message}</p>
        <hr style="border: 0; border-top: 1px solid #2d2d40; margin: 24px 0;" />
        <p style="font-size: 12px; color: #7a7a95;">Mohamed Zaher Platform · Admin notification</p>
      </div>
    `,
  }),
  newsletterWelcome: (email: string) => ({
    subject: "Welcome aboard — Mohamed Zaher",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <h2>Welcome 👋</h2>
        <p>Thanks for subscribing to my newsletter. I'll send occasional notes on building products, scaling teams, and navigating the tech-business intersection.</p>
        <p>— Mohamed</p>
        <hr/>
        <p style="font-size: 11px; color: #999;">If you didn't subscribe, ignore this email or unsubscribe: <a href="#">unsubscribe</a></p>
      </div>
    `,
  }),
};
