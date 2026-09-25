// lib/site-content.js
// Marketing copy that isn't product-specific. Rendered on the page AND emitted as JSON-LD, so the
// two can never drift apart.
//
// Claim rule: every sentence must pass "can the product (or our team) actually do this today?".
// If not, remove it or say "coming soon". No statistics, customer names or timelines we can't prove.

// Sales run through a demo meeting (founder, 2026-09-25).
export const HOW_WE_WORK = [
  {
    title: "Tell us about your business",
    body: "Share your trade, how many people and branches you have, and what you track today."
  },
  {
    title: "See a live demo",
    body: "We arrange a meeting and show you the ZUGEE product built for your industry, using your own examples."
  },
  {
    title: "Get set up",
    body: "We help you set up your account and bring in your existing customer and item lists."
  }
];

export const FAQ_ITEMS = [
  {
    question: "Which ZUGEE products can I use today?",
    answer:
      "Every product marked Available is ready to use today. Book a demo and we will arrange a meeting to show you the product working before you decide. Products marked Coming Soon are still being built."
  },
  {
    question: "Can I use more than one ZUGEE product?",
    answer:
      "Yes. Today each product is set up separately. A single ZUGEE account that opens all your products, with shared users and branches, is being built."
  },
  {
    question: "How is pricing worked out?",
    answer:
      "Pricing depends on the product, the number of users and branches, and the support you need. Tell us about your business and we will send you a quote."
  },
  {
    question: "My industry isn't listed. Can ZUGEE still help?",
    answer:
      "Choose \"Something else\" in the form and tell us what you need. We will tell you honestly whether one of our products fits."
  }
];
