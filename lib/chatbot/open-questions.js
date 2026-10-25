// lib/chatbot/open-questions.js
// Things visitors are likely to ask that the site does not answer, plus places where the site's own
// copy disagrees with itself. The assistant treats each as UNVERIFIED (says it is not confirmed and
// offers to check with the team); content/ask-zugee/feature-status.md lists them for the founder.
// When the founder confirms one, move the fact into the site copy (and lib/chatbot/capabilities.js
// with evidence), then delete it here.
// No JSX and relative imports only, so `node --test` can load this file.

/** @type {{ question: string, say: string }[]} */
export const OPEN_QUESTIONS = [
  { question: "What is ZUGEE's registered office street address?", say: "Only the city (Salem, Tamil Nadu) is published." },
  { question: "Who are the founders / team?", say: "Not published on the site yet." },
  { question: "Which companies use ZUGEE? Are there case studies or testimonials?", say: "No customer names or case studies are published; the team can answer questions about similar businesses on WhatsApp." },
  { question: "Is there a free trial?", say: "Not stated; ZUGEE is shown on a live demo first." },
  { question: "Are there discounts or annual billing?", say: "Not stated; pricing is quoted on a call." },
  { question: "Does ZUGEE integrate with SAP, Zoho, QuickBooks or other ERPs?", say: "No ready integrations are listed; Enterprise mentions custom ERP integrations scoped on a call." },
  { question: "What is the uptime / SLA and support response time?", say: "Support hours are published (Mon–Sat, 10am–6pm IST); no uptime figure or response-time guarantee is published." },
  { question: "Is there a native Android / iOS app?", say: "The products run in the phone's web browser; an app-store app is not confirmed." },
  { question: "Which country is the data stored in? Any security certification?", say: "Hosting details are shared on request; no certification is claimed." },
  {
    question: "Site copy conflict: the homepage lifecycle says Fleet 'generates a digital payment link' and Schools have 'integrated payment links', but the comparison section says payment links are coming soon.",
    say: "Treat payment links as coming soon."
  },
  {
    question: "Site copy conflict: the Pricing comparison matrix lists 'Automated Bank Reconciliation', 'Custom Payment Gateway / Escrow', 'Automated Reminders' and 'Real-time Multi-Branch Sync'; none is described on a product page.",
    say: "Do not claim these; say they are not confirmed."
  },
  { question: "When will WhatsApp sending, e-invoicing, GSTR-1 and Tally XML launch?", say: "No dates are published." }
];
