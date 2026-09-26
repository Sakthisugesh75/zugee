// tests/email.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  getEmailTransporter,
  sendLeadNotificationEmail,
  sendLeadConfirmationEmail,
  buildLeadNotificationPayload,
  buildLeadConfirmationPayload,
  cleanPhoneForWhatsApp,
  DEFAULT_ADMIN_EMAIL
} from "../lib/email.js";

test("DEFAULT_ADMIN_EMAIL is sugeshwebdevops@gmail.com", () => {
  assert.equal(DEFAULT_ADMIN_EMAIL, "sugeshwebdevops@gmail.com");
});

test("cleanPhoneForWhatsApp handles standard formats", () => {
  assert.equal(cleanPhoneForWhatsApp("9876543210"), "919876543210");
  assert.equal(cleanPhoneForWhatsApp("+91 98765 43210"), "919876543210");
  assert.equal(cleanPhoneForWhatsApp("+1 (555) 123-4567"), "15551234567");
  assert.equal(cleanPhoneForWhatsApp(""), "");
});

test("buildLeadNotificationPayload formats email correctly to sugeshwebdevops@gmail.com", () => {
  const sampleLead = {
    reference_id: "ZUG-PAYLOAD01",
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    industry: "transposs",
    company_name: "Kumar Travels",
    message: "Interested in the Growth plan"
  };

  const payload = buildLeadNotificationPayload(sampleLead);
  assert.equal(payload.to, "sugeshwebdevops@gmail.com");
  assert.ok(payload.subject.includes("Rajesh Kumar"));
  assert.ok(payload.subject.includes("ZUG-PAYLOAD01"));
  assert.ok(payload.html.includes("Rajesh Kumar"));
  assert.ok(payload.html.includes("+91 9876543210"));
  assert.ok(payload.html.includes("Kumar Travels"));
  assert.ok(payload.html.includes("Interested in the Growth plan"));
  assert.ok(payload.text.includes("wa.me/919876543210"));
});

test("buildLeadConfirmationPayload creates customer confirmation email", () => {
  const sampleLead = {
    reference_id: "ZUG-CONFIRM01",
    name: "Priya Sharma",
    phone: "+91 9876500000",
    email: "priya@example.com",
    industry: "aqua-erp"
  };

  const payload = buildLeadConfirmationPayload(sampleLead);
  assert.ok(payload);
  assert.equal(payload.to, "priya@example.com");
  assert.ok(payload.subject.includes("ZUG-CONFIRM01"));
  assert.ok(payload.html.includes("Priya Sharma"));
  assert.ok(payload.html.includes("+91 9876500000"));
});

test("sendLeadNotificationEmail with mock transporter succeeds", async () => {
  const sentMails = [];
  const mockTransporter = {
    sendMail: async (payload) => {
      sentMails.push(payload);
      return { messageId: "mock-message-id-123" };
    }
  };

  const sampleLead = {
    reference_id: "ZUG-MOCK01",
    name: "Demo Requester",
    phone: "+91 9123456789",
    industry: "school-erp"
  };

  const result = await sendLeadNotificationEmail(sampleLead, mockTransporter);
  assert.equal(result.sent, true);
  assert.equal(result.messageId, "mock-message-id-123");
  assert.equal(sentMails.length, 1);
  assert.equal(sentMails[0].to, "sugeshwebdevops@gmail.com");
});

test("getEmailTransporter returns null when environment variables are not set", () => {
  const origGmailUser = process.env.GMAIL_USER;
  const origGmailPass = process.env.GMAIL_APP_PASSWORD;
  const origSmtpHost = process.env.SMTP_HOST;
  const origSmtpUser = process.env.SMTP_USER;
  const origSmtpPass = process.env.SMTP_PASS;

  delete process.env.GMAIL_USER;
  delete process.env.GMAIL_APP_PASSWORD;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;

  const transporter = getEmailTransporter();
  assert.equal(transporter, null);

  // Restore
  if (origGmailUser) process.env.GMAIL_USER = origGmailUser;
  if (origGmailPass) process.env.GMAIL_APP_PASSWORD = origGmailPass;
  if (origSmtpHost) process.env.SMTP_HOST = origSmtpHost;
  if (origSmtpUser) process.env.SMTP_USER = origSmtpUser;
  if (origSmtpPass) process.env.SMTP_PASS = origSmtpPass;
});

test("sendLeadNotificationEmail safely returns status when SMTP is unconfigured", async () => {
  const sampleLead = {
    reference_id: "ZUG-TEST01",
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john@example.com",
    industry: "transposs",
    company_name: "Doe Logistics",
    message: "Interested in the Growth plan"
  };

  const result = await sendLeadNotificationEmail(sampleLead);
  assert.equal(typeof result, "object");
  assert.equal(result.sent, false);
  assert.equal(result.reason, "SMTP not configured");
});

test("sendLeadConfirmationEmail skips sending when lead has no email", async () => {
  const leadWithoutEmail = {
    reference_id: "ZUG-TEST02",
    name: "Jane Doe",
    phone: "+91 9876543211",
    email: null,
    industry: "aqua-erp"
  };

  const result = await sendLeadConfirmationEmail(leadWithoutEmail);
  assert.equal(result.sent, false);
  assert.equal(result.reason, "No email provided by lead");
});
