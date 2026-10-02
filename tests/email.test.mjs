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
  getAdminNotificationEmail,
  getSenderAddress
} from "../lib/email.js";

const TEAM_EMAIL = "leads@example.test";
const SUPPORT_EMAIL = "support@example.test";

const MAIL_ENV_KEYS = [
  "SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "SMTP_FROM",
  "GMAIL_USER", "GMAIL_APP_PASSWORD"
];

// Runs fn with exactly the given mail variables set (every other one unset), then restores them.
async function withMailEnv(values, fn) {
  const orig = Object.fromEntries(MAIL_ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of MAIL_ENV_KEYS) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try {
    return await fn();
  } finally {
    for (const key of MAIL_ENV_KEYS) {
      if (orig[key] === undefined) delete process.env[key];
      else process.env[key] = orig[key];
    }
  }
}

const ZOHO_ENV = { SMTP_HOST: "smtp.zoho.test", SMTP_USER: SUPPORT_EMAIL, SMTP_PASS: "zoho-pass" };
const GMAIL_ENV = { GMAIL_USER: "legacy@gmail.test", GMAIL_APP_PASSWORD: "gmail-pass" };

// Runs fn with ADMIN_NOTIFICATION_EMAIL set to `value` (or unset when undefined), then restores it.
async function withAdminEmail(value, fn) {
  const orig = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (value === undefined) delete process.env.ADMIN_NOTIFICATION_EMAIL;
  else process.env.ADMIN_NOTIFICATION_EMAIL = value;
  try {
    return await fn();
  } finally {
    if (orig === undefined) delete process.env.ADMIN_NOTIFICATION_EMAIL;
    else process.env.ADMIN_NOTIFICATION_EMAIL = orig;
  }
}

test("getAdminNotificationEmail has no built-in fallback address", async () => {
  await withAdminEmail(undefined, () => assert.equal(getAdminNotificationEmail(), null));
  await withAdminEmail("   ", () => assert.equal(getAdminNotificationEmail(), null));
  await withAdminEmail(` ${TEAM_EMAIL} `, () => assert.equal(getAdminNotificationEmail(), TEAM_EMAIL));
});

test("cleanPhoneForWhatsApp handles standard formats", () => {
  assert.equal(cleanPhoneForWhatsApp("9876543210"), "919876543210");
  assert.equal(cleanPhoneForWhatsApp("+91 98765 43210"), "919876543210");
  assert.equal(cleanPhoneForWhatsApp("+1 (555) 123-4567"), "15551234567");
  assert.equal(cleanPhoneForWhatsApp(""), "");
});

test("buildLeadNotificationPayload addresses the email to ADMIN_NOTIFICATION_EMAIL", async () => {
  const sampleLead = {
    reference_id: "ZUG-PAYLOAD01",
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    industry: "transposs",
    company_name: "Kumar Travels",
    message: "Interested in the Growth plan"
  };

  const payload = await withAdminEmail(TEAM_EMAIL, () => buildLeadNotificationPayload(sampleLead));
  assert.equal(payload.to, TEAM_EMAIL);
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

  const result = await withAdminEmail(TEAM_EMAIL, () => sendLeadNotificationEmail(sampleLead, mockTransporter));
  assert.equal(result.sent, true);
  assert.equal(result.messageId, "mock-message-id-123");
  assert.equal(sentMails.length, 1);
  assert.equal(sentMails[0].to, TEAM_EMAIL);
});

test("sendLeadNotificationEmail warns and sends nothing when ADMIN_NOTIFICATION_EMAIL is unset", async (t) => {
  const sentMails = [];
  const mockTransporter = {
    sendMail: async (payload) => {
      sentMails.push(payload);
      return { messageId: "should-not-be-sent" };
    }
  };
  const warn = t.mock.method(console, "warn", () => {});

  const lead = { reference_id: "ZUG-NOADMN", name: "No Recipient", phone: "9876543210", industry: "transposs" };
  const result = await withAdminEmail(undefined, () => sendLeadNotificationEmail(lead, mockTransporter));

  assert.deepEqual(result, { sent: false, reason: "ADMIN_NOTIFICATION_EMAIL not set" });
  assert.equal(sentMails.length, 0);
  assert.equal(warn.mock.callCount(), 1);
  const warning = warn.mock.calls[0].arguments[0];
  assert.ok(warning.includes("ADMIN_NOTIFICATION_EMAIL"));
  assert.ok(warning.includes("ZUG-NOADMN"));
  assert.ok(!warning.includes("gmail.com"));
});

test("getEmailTransporter returns null when environment variables are not set", async () => {
  await withMailEnv({}, () => assert.equal(getEmailTransporter(), null));
});

test("getEmailTransporter uses the SMTP server even when Gmail is also configured", async () => {
  await withMailEnv({ ...ZOHO_ENV, ...GMAIL_ENV }, () => {
    const { options } = getEmailTransporter();
    assert.equal(options.host, "smtp.zoho.test");
    assert.equal(options.service, undefined);
    assert.deepEqual(options.auth, { user: SUPPORT_EMAIL, pass: "zoho-pass" });
    // No port given: 587 with STARTTLS.
    assert.equal(options.port, 587);
    assert.equal(options.secure, false);
  });
});

test("getEmailTransporter turns TLS on for port 465 or SMTP_SECURE=true", async () => {
  await withMailEnv({ ...ZOHO_ENV, SMTP_PORT: "465" }, () => {
    const { options } = getEmailTransporter();
    assert.equal(options.port, 465);
    assert.equal(options.secure, true);
  });
  await withMailEnv({ ...ZOHO_ENV, SMTP_PORT: "587", SMTP_SECURE: "true" }, () => {
    assert.equal(getEmailTransporter().options.secure, true);
  });
});

test("getEmailTransporter falls back to Gmail only when SMTP is not fully configured", async () => {
  await withMailEnv(GMAIL_ENV, () => {
    const { options } = getEmailTransporter();
    assert.equal(options.service, "gmail");
    assert.deepEqual(options.auth, { user: "legacy@gmail.test", pass: "gmail-pass" });
  });
  // SMTP_HOST without a password is incomplete, so Gmail is used.
  await withMailEnv({ SMTP_HOST: "smtp.zoho.test", SMTP_USER: SUPPORT_EMAIL, ...GMAIL_ENV }, () => {
    assert.equal(getEmailTransporter().options.service, "gmail");
  });
});

test("getEmailTransporter never sends a bare user and password to Gmail", async () => {
  await withMailEnv({ SMTP_USER: SUPPORT_EMAIL, SMTP_PASS: "zoho-pass" }, () => {
    assert.equal(getEmailTransporter(), null);
  });
  await withMailEnv({ GMAIL_USER: "legacy@gmail.test", SMTP_PASS: "zoho-pass" }, () => {
    assert.equal(getEmailTransporter(), null);
  });
});

const REPLY_LEAD = {
  reference_id: "ZUG-REPLY01",
  name: "Meena Iyer",
  phone: "+91 98765 33333",
  email: "meena@example.com",
  industry: "transposs"
};

test("both emails are sent From the authenticated SMTP mailbox", async () => {
  await withMailEnv({ ...ZOHO_ENV, ...GMAIL_ENV, SMTP_FROM: '"Other" <other@example.test>' }, () => {
    assert.equal(getSenderAddress(), SUPPORT_EMAIL);
    assert.equal(buildLeadNotificationPayload(REPLY_LEAD).from, `"ZUGEE" <${SUPPORT_EMAIL}>`);
    assert.equal(buildLeadConfirmationPayload(REPLY_LEAD).from, `"ZUGEE Support" <${SUPPORT_EMAIL}>`);
  });
});

test("the From address falls back to the Gmail mailbox, and is absent with no mailbox", async () => {
  await withMailEnv(GMAIL_ENV, () => {
    assert.equal(buildLeadNotificationPayload(REPLY_LEAD).from, '"ZUGEE" <legacy@gmail.test>');
    assert.equal(buildLeadConfirmationPayload(REPLY_LEAD).from, '"ZUGEE Support" <legacy@gmail.test>');
  });
  await withMailEnv({}, () => {
    assert.equal(getSenderAddress(), null);
    const notification = buildLeadNotificationPayload(REPLY_LEAD);
    const confirmation = buildLeadConfirmationPayload(REPLY_LEAD);
    assert.equal(notification.from, undefined);
    assert.equal(confirmation.from, undefined);
    assert.ok(!("replyTo" in confirmation));
    assert.ok(!JSON.stringify([notification.from, confirmation.from]).includes("no-reply"));
  });
});

test("notification replyTo is the lead's email, and is omitted when they gave none", async () => {
  await withMailEnv(ZOHO_ENV, () => {
    assert.equal(buildLeadNotificationPayload(REPLY_LEAD).replyTo, "meena@example.com");

    const withoutEmail = buildLeadNotificationPayload({ ...REPLY_LEAD, email: null });
    assert.ok(!("replyTo" in withoutEmail));
  });
});

test("confirmation replyTo is the support mailbox", async () => {
  await withMailEnv(ZOHO_ENV, () => {
    const confirmation = buildLeadConfirmationPayload(REPLY_LEAD);
    assert.equal(confirmation.to, "meena@example.com");
    assert.equal(confirmation.replyTo, SUPPORT_EMAIL);
  });
});

test("the sent emails carry From and replyTo through to the transporter", async () => {
  const sentMails = [];
  const mockTransporter = {
    sendMail: async (payload) => {
      sentMails.push(payload);
      return { messageId: "mock-reply-id" };
    }
  };

  await withMailEnv(ZOHO_ENV, async () => {
    await withAdminEmail(TEAM_EMAIL, () => sendLeadNotificationEmail(REPLY_LEAD, mockTransporter));
    await sendLeadConfirmationEmail(REPLY_LEAD, mockTransporter);
  });

  assert.equal(sentMails.length, 2);
  assert.equal(sentMails[0].from, `"ZUGEE" <${SUPPORT_EMAIL}>`);
  assert.equal(sentMails[0].replyTo, "meena@example.com");
  assert.equal(sentMails[1].from, `"ZUGEE Support" <${SUPPORT_EMAIL}>`);
  assert.equal(sentMails[1].replyTo, SUPPORT_EMAIL);
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

  const result = await withMailEnv({}, () =>
    withAdminEmail(TEAM_EMAIL, () => sendLeadNotificationEmail(sampleLead))
  );
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

test("notification email links to the admin dashboard page", () => {
  const origSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";

  const { html, text } = buildLeadNotificationPayload({
    reference_id: "ZUG-LINK01",
    name: "Link Check",
    phone: "9876543210",
    industry: "transposs"
  });
  assert.ok(html.includes('href="https://example.test/admin/dashboard"'));
  assert.ok(text.includes("Admin Portal: https://example.test/admin/dashboard"));
  assert.ok(!html.includes("/admin/leads"));
  assert.ok(!text.includes("/admin/leads"));

  if (origSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = origSiteUrl;
});

test("a pricing-call lead is labelled as one in both emails", async () => {
  const lead = {
    reference_id: "ZUG-PRICE01",
    name: "Anita Rao",
    phone: "+91 98765 11111",
    email: "anita@example.com",
    industry: "transposs",
    request_type: "pricing_call",
    message: "12 users across 2 branches"
  };

  const notification = await withAdminEmail(TEAM_EMAIL, () => buildLeadNotificationPayload(lead));
  assert.ok(notification.subject.includes("New Pricing Call Request"));
  assert.ok(notification.html.includes("New Pricing Call Request Received"));
  assert.ok(notification.html.includes(">Pricing call</td>"));
  assert.ok(notification.html.includes("12 users across 2 branches"));
  assert.ok(notification.text.includes("Request: Pricing call"));

  const confirmation = buildLeadConfirmationPayload(lead);
  assert.ok(confirmation.subject.includes("Your Pricing Call Request"));
  assert.ok(confirmation.html.includes("Pricing Call Request Received"));
  assert.ok(confirmation.html.includes("share a clear quote"));
  assert.ok(!confirmation.html.includes("live demo"));
});

test("a demo lead keeps the demo wording in both emails", async () => {
  const lead = {
    reference_id: "ZUG-DEMO01",
    name: "Vikram Shah",
    phone: "+91 98765 22222",
    email: "vikram@example.com",
    industry: "aqua-erp",
    request_type: "demo",
    message: "Call after 5pm"
  };

  const notification = await withAdminEmail(TEAM_EMAIL, () => buildLeadNotificationPayload(lead));
  assert.ok(notification.subject.includes("New Demo Request"));
  assert.ok(notification.html.includes(">Product demo</td>"));
  assert.ok(notification.html.includes("Call after 5pm"));

  const confirmation = buildLeadConfirmationPayload(lead);
  assert.ok(confirmation.subject.includes("Your Demo Request"));
  assert.ok(confirmation.html.includes("requesting a live demo of"));

  // A lead saved before the request_type column existed is treated as a demo.
  const legacy = buildLeadConfirmationPayload({ ...lead, request_type: undefined });
  assert.ok(legacy.subject.includes("Your Demo Request"));
});
