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
  escapeHtml,
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

// A lead whose every visitor-supplied field carries markup. `industry` is not in the catalog, so
// it reaches the email as typed (the API rejects such values, but the email must not rely on that).
const HOSTILE_LEAD = {
  reference_id: "ZUG-XSS001",
  name: '<img src=x onerror="alert(1)">',
  phone: '"><script>alert("phone")</script>',
  email: 'a"onmouseover="alert(2)"@example.com',
  industry: "<b>fleet</b>",
  company_name: "<a href='https://evil.example'>Click & win</a>",
  message: "<script>alert('message')</script>"
};

// Every tag the templates themselves use. Anything else in the output came from the lead.
const TEMPLATE_TAGS = new Set([
  "!doctype", "html", "head", "meta", "title", "style", "body", "div", "span", "h1", "p",
  "table", "tr", "td", "a", "strong"
]);

function tagNames(html) {
  return [...html.matchAll(/<\/?([!a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1].toLowerCase());
}

test("escapeHtml escapes the five HTML-significant characters", () => {
  assert.equal(escapeHtml(`<a href="x" title='y'>Tom & Jerry</a>`),
    "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;Tom &amp; Jerry&lt;/a&gt;");
  assert.equal(escapeHtml("Rajesh Kumar"), "Rajesh Kumar");
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
});

test("notification email escapes HTML in every visitor-supplied field", () => {
  const { html, text } = buildLeadNotificationPayload(HOSTILE_LEAD);

  assert.ok(html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"), "name");
  assert.ok(html.includes("&quot;&gt;&lt;script&gt;alert(&quot;phone&quot;)&lt;/script&gt;"), "phone");
  assert.ok(html.includes("a&quot;onmouseover=&quot;alert(2)&quot;@example.com"), "email");
  assert.ok(html.includes("&lt;b&gt;fleet&lt;/b&gt;"), "business type");
  assert.ok(html.includes("&lt;a href=&#39;https://evil.example&#39;&gt;Click &amp; win&lt;/a&gt;"), "company");
  assert.ok(html.includes("&lt;script&gt;alert(&#39;message&#39;)&lt;/script&gt;"), "message");

  // None of the raw values survive, and no tag outside the template's own set appears.
  for (const field of ["name", "phone", "email", "industry", "company_name", "message"]) {
    assert.ok(!html.includes(HOSTILE_LEAD[field]), `raw ${field} must not appear in the HTML`);
  }
  for (const tag of tagNames(html)) {
    assert.ok(TEMPLATE_TAGS.has(tag), `unexpected <${tag}> in notification HTML`);
  }
  // The phone and email sit inside href="…"; a quote must not be able to close the attribute.
  assert.ok(!/href="(tel|mailto):[^"]*"[^ >]/.test(html));

  // The plain-text part is not HTML and keeps what the visitor typed.
  assert.ok(text.includes(HOSTILE_LEAD.message));
});

test("confirmation email escapes HTML in every visitor-supplied field", () => {
  const { html, text, to } = buildLeadConfirmationPayload(HOSTILE_LEAD);

  assert.equal(to, HOSTILE_LEAD.email);
  assert.ok(html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"), "name");
  assert.ok(html.includes("&quot;&gt;&lt;script&gt;alert(&quot;phone&quot;)&lt;/script&gt;"), "phone");
  assert.ok(html.includes("&lt;b&gt;fleet&lt;/b&gt;"), "business type");

  for (const field of ["name", "phone", "industry"]) {
    assert.ok(!html.includes(HOSTILE_LEAD[field]), `raw ${field} must not appear in the HTML`);
  }
  for (const tag of tagNames(html)) {
    assert.ok(TEMPLATE_TAGS.has(tag), `unexpected <${tag}> in confirmation HTML`);
  }
  assert.ok(text.includes(HOSTILE_LEAD.name));
});

test("ordinary lead values pass through the HTML unchanged", () => {
  const lead = {
    reference_id: "ZUG-PLAIN01",
    name: "Priya Sharma",
    phone: "+91 98765 00000",
    email: "priya@example.com",
    industry: "aqua-erp",
    company_name: "Sharma Aqua",
    message: "Need a demo next week."
  };
  const { html } = buildLeadNotificationPayload(lead);
  for (const value of [lead.name, lead.phone, lead.email, lead.company_name, lead.message]) {
    assert.ok(html.includes(value));
  }
  assert.ok(html.includes('href="mailto:priya@example.com"'));
});
