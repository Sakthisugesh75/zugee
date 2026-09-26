// lib/email.js
// Handles outgoing email notifications when a lead books a demo.
// Default notification recipient: sugeshwebdevops@gmail.com

import nodemailer from "nodemailer";
import { businessTypeLabel } from "./products.js";

export const DEFAULT_ADMIN_EMAIL = "sugeshwebdevops@gmail.com";

/**
 * Returns a configured nodemailer transporter, or null if SMTP credentials are missing.
 */
export function getEmailTransporter() {
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  // Direct Gmail configuration
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  // Generic SMTP configuration (e.g. Gmail SMTP, SendGrid, Resend, Brevo, AWS SES)
  if (process.env.SMTP_HOST && gmailUser && gmailPass) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: isSecure,
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
  }

  // Fallback: If only SMTP_USER and SMTP_PASS are set, check if SMTP_USER is a Gmail address
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
  }

  return null;
}

/**
 * Formats a phone number for an instant WhatsApp web/app link.
 */
export function cleanPhoneForWhatsApp(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d]/g, "");
  // If 10 digits (common Indian mobile without country code), prefix 91
  if (cleaned.length === 10) return `91${cleaned}`;
  return cleaned;
}

/**
 * Builds the notification email payload sent to admin.
 */
export function buildLeadNotificationPayload(lead) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;
  const productName = businessTypeLabel(lead.industry) || lead.industry || "General / Core ERP";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zugee.in";
  const waNumber = cleanPhoneForWhatsApp(lead.phone);
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;
  const adminLeadsUrl = `${siteUrl}/admin/leads`;
  const formattedTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  });

  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    `"Zugee Demo Request" <no-reply@zugee.in>`;

  const subject = `🚀 New Demo Request: ${lead.name} - ${productName} (${lead.reference_id || "Lead"})`;

  const textBody = `
New Demo Request Submitted on Zugee!

Reference ID: ${lead.reference_id || "N/A"}
Time: ${formattedTime} (IST)

Customer Details:
- Name: ${lead.name}
- Phone: ${lead.phone}
- Email: ${lead.email || "Not provided"}
- Business / Product: ${productName}
- Company Name: ${lead.company_name || "Not provided"}
- Specific Request / Notes: ${lead.message || "None"}

Quick Actions:
- WhatsApp: ${waLink || "N/A"}
- Admin Portal: ${adminLeadsUrl}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Demo Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #070B13; color: #E2E8F0; }
    .wrapper { max-width: 600px; margin: 20px auto; background-color: #0B132B; border-radius: 16px; border: 1px solid #1E293B; overflow: hidden; }
    .header { background: linear-gradient(135deg, #091024 0%, #0F1E3D 100%); padding: 32px 28px; border-bottom: 1px solid #1E293B; text-align: center; }
    .badge { display: inline-block; background-color: rgba(0, 240, 255, 0.12); color: #00F0FF; border: 1px solid rgba(0, 240, 255, 0.35); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 9999px; margin-bottom: 12px; }
    .title { color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
    .content { padding: 32px 28px; }
    .card { background-color: #0F182E; border-radius: 12px; border: 1px solid #1E2E4E; padding: 20px; margin-bottom: 24px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; background-color: #080D1A; }
    .btn { display: inline-block; background: #00F0FF; color: #050B14; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 0 6px 10px; }
    .btn-wa { background: #25D366; color: #FFFFFF; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="badge">Live Demo Notification</span>
      <h1 class="title">New Demo Request Received</h1>
    </div>
    <div class="content">
      <div class="card">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px;">Reference ID</td>
            <td style="padding: 10px 0; color: #00F0FF; font-weight: 700; font-size: 14px; text-align: right;">${lead.reference_id || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px;">Full Name</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-weight: 700; font-size: 14px; text-align: right;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px;">Mobile / WhatsApp</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-weight: 700; font-size: 14px; text-align: right;">
              <a href="tel:${lead.phone}" style="color: #00F0FF; text-decoration: none;">${lead.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px;">Product / Business</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-weight: 600; font-size: 14px; text-align: right;">${productName}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px;">Email Address</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-size: 14px; text-align: right;">
              ${lead.email ? `<a href="mailto:${lead.email}" style="color: #00F0FF; text-decoration: none;">${lead.email}</a>` : '<span style="color: #64748B;">Not provided</span>'}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px;">Company Name</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-size: 14px; text-align: right;">
              ${lead.company_name ? lead.company_name : '<span style="color: #64748B;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94A3B8; font-size: 14px; vertical-align: top;">Requirements / Notes</td>
            <td style="padding: 10px 0; color: #CBD5E1; font-size: 14px; text-align: right; line-height: 1.4;">
              ${lead.message ? lead.message : '<span style="color: #64748B;">None</span>'}
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0 10px;">
        ${waLink ? `<a href="${waLink}" class="btn btn-wa" target="_blank" style="background:#25D366;color:#FFF;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;margin:0 6px 10px;">Chat on WhatsApp</a>` : ""}
        <a href="${adminLeadsUrl}" class="btn" target="_blank" style="background:#00F0FF;color:#050B14;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;margin:0 6px 10px;">View in Admin Portal</a>
      </div>
    </div>
    <div class="footer">
      Sent automatically by Zugee Platform &bull; ${formattedTime}
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    to: adminEmail,
    from: fromAddress,
    subject,
    text: textBody,
    html: htmlBody
  };
}

/**
 * Builds customer confirmation email payload.
 */
export function buildLeadConfirmationPayload(lead) {
  if (!lead.email) return null;

  const productName = businessTypeLabel(lead.industry) || lead.industry || "Zugee Business Software";
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    `"Zugee Team" <no-reply@zugee.in>`;

  const subject = `Your Demo Request with Zugee (${lead.reference_id || "Confirmed"})`;

  const textBody = `
Hi ${lead.name},

Thank you for your interest in ${productName}!

We have received your demo request (Reference: ${lead.reference_id || "N/A"}).

Our product team will connect with you on ${lead.phone} shortly to arrange your live interactive walkthrough and answer any questions.

Best regards,
The Zugee Team
https://www.zugee.in
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Demo Request - Zugee</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #070B13; color: #E2E8F0; }
    .wrapper { max-width: 600px; margin: 20px auto; background-color: #0B132B; border-radius: 16px; border: 1px solid #1E293B; overflow: hidden; }
    .header { background: linear-gradient(135deg, #091024 0%, #0F1E3D 100%); padding: 32px 28px; border-bottom: 1px solid #1E293B; text-align: center; }
    .title { color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .highlight { color: #00F0FF; font-weight: 600; }
    .card { background-color: #0F182E; border-radius: 12px; border: 1px solid #1E2E4E; padding: 18px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; background-color: #080D1A; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="title">Demo Request Received</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; color: #FFFFFF;">Hi <strong>${lead.name}</strong>,</p>
      <p style="color: #CBD5E1;">
        Thank you for requesting a live demo of <strong class="highlight">${productName}</strong>.
      </p>
      <p style="color: #CBD5E1;">
        Our team will contact you on <strong style="color: #FFFFFF;">${lead.phone}</strong> via call or WhatsApp to schedule a convenient time for your 1-on-1 walkthrough.
      </p>
      <div class="card">
        <div style="font-size: 13px; color: #94A3B8;">Your Reference Number:</div>
        <div style="font-size: 18px; font-weight: 700; color: #00F0FF; margin-top: 4px;">${lead.reference_id || "N/A"}</div>
      </div>
      <p style="color: #94A3B8; font-size: 13px;">
        If you have any urgent queries, feel free to reply directly to this email.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Zugee. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    to: lead.email,
    from: fromAddress,
    subject,
    text: textBody,
    html: htmlBody
  };
}

/**
 * Sends a notification email to the admin (sugeshwebdevops@gmail.com)
 * when a user fills out the demo request form.
 */
export async function sendLeadNotificationEmail(lead, customTransporter = null) {
  const payload = buildLeadNotificationPayload(lead);
  const transporter = customTransporter || getEmailTransporter();

  if (!transporter) {
    console.warn(
      `\n⚠️  [EMAIL NOTICE - SMTP NOT CONFIGURED]\n` +
      `New Demo Booking Received for ${payload.to}:\n` +
      `• Reference: ${lead.reference_id}\n` +
      `• Name: ${lead.name}\n` +
      `• Phone: ${lead.phone}\n` +
      `• Email: ${lead.email || "Not provided"}\n` +
      `• Product: ${lead.industry}\n` +
      `• Company: ${lead.company_name || "Not provided"}\n` +
      `• Message / Plan: ${lead.message || "None"}\n` +
      `To send live emails, configure GMAIL_USER and GMAIL_APP_PASSWORD (or SMTP_HOST, SMTP_USER, SMTP_PASS) in .env.local.\n`
    );
    return { sent: false, reason: "SMTP not configured" };
  }

  const info = await transporter.sendMail(payload);
  return { sent: true, messageId: info.messageId };
}

/**
 * Sends a confirmation email to the user if they provided an email address.
 */
export async function sendLeadConfirmationEmail(lead, customTransporter = null) {
  const payload = buildLeadConfirmationPayload(lead);
  if (!payload) return { sent: false, reason: "No email provided by lead" };

  const transporter = customTransporter || getEmailTransporter();
  if (!transporter) return { sent: false, reason: "SMTP not configured" };

  const info = await transporter.sendMail(payload);
  return { sent: true, messageId: info.messageId };
}
