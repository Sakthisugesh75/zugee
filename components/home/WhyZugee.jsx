// components/home/WhyZugee.jsx
// Server component: exactly three differentiators. No "AI-powered".

import { MotionReveal } from "@/components/ui/MotionReveal";
import { MessageSquare, ReceiptIndianRupee, KeyRound } from "lucide-react";

const REASONS = [
  {
    Icon: MessageSquare,
    title: "Customers hear from your business on WhatsApp",
    body:
      "Invoices, payment links and reminders go from your business number, not a staff member's phone. When staff leave, the chats stay with you."
  },
  {
    Icon: ReceiptIndianRupee,
    title: "GST is built in, not bolted on",
    body: "CGST, SGST and IGST are worked out on every bill. At month-end, your GSTR-1 data is ready for your CA."
  },
  {
    Icon: KeyRound,
    title: "One login instead of five tools",
    body: "Billing, stock, payments and customer messages in one place. No copying numbers between Tally, Excel and WhatsApp."
  }
];

export default function WhyZugee() {
  return (
    <section id="why-zugee" className="section-wrapper bg-[#06090F] border-b border-white/[0.08]">
      <div className="container">
        <MotionReveal className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Why owners switch to Zugee</h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {REASONS.map((r, i) => (
            <MotionReveal
              key={r.title}
              delay={i * 0.08}
              className="rounded-3xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6 sm:p-7 h-full"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center justify-center mb-5">
                <r.Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">{r.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{r.body}</p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
