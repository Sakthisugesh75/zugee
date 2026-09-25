// components/home/ProductSection.jsx
// Server component: one dashboard preview, one paragraph, four outcomes.
// The preview uses clearly labelled sample data — no customer names, no placeholder dates.

import { MotionReveal } from "@/components/ui/MotionReveal";
import { HexCheck } from "@/components/ui/PrecisionIcons";
import { CheckCircle2, Clock } from "lucide-react";

const KPIS = [
  { label: "Sales today", value: "₹42,300", sub: "18 bills" },
  { label: "GST payable this month", value: "₹31,860", sub: "CGST + SGST" },
  { label: "Low-stock items", value: "6", sub: "Reorder today" },
  { label: "Pending payments", value: "₹1,18,500", sub: "14 customers" }
];

const ACTIVITY = [
  { Icon: CheckCircle2, tone: "text-emerald-400", text: "Invoice #0231 paid via UPI — matched to bank", when: "2 min ago" },
  { Icon: Clock, tone: "text-[#00F0FF]", text: "WhatsApp reminder sent — due in 2 days", when: "20 min ago" }
];

const OUTCOMES = [
  "Send a GST invoice in under a minute, tax already applied",
  "Know your exact stock before you promise a customer",
  "See who owes you money and send a reminder in one tap",
  "Hand your CA ready reports, not a shoebox of paper"
];

export default function ProductSection() {
  return (
    <section id="product" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container relative z-10">
        <MotionReveal className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            One dashboard for bills, stock and payments
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Open Zugee in the morning and see yesterday&apos;s sales, who has not paid, what is running low
            and how much GST you owe. Every number comes from where your bills are made, so it is never out
            of date.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-6xl mx-auto">
          {/* Dashboard preview */}
          <MotionReveal className="lg:col-span-8 rounded-3xl bg-[#090E1A]/90 border border-white/[0.12] shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="bg-[#0D1527] border-b border-white/[0.08] px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]/80" />
                <span className="ml-3 text-xs font-mono text-slate-300">Zugee · Dashboard</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Sample data</span>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {KPIS.map((k) => (
                  <div key={k.label} className="rounded-2xl bg-[#0C1424]/80 border border-white/[0.08] p-4">
                    <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      {k.label}
                    </span>
                    <div className="text-xl md:text-2xl font-bold text-white font-mono">{k.value}</div>
                    <span className="block text-[11px] text-[#38BDF8] font-mono mt-1">{k.sub}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-[#0C1424]/80 border border-white/[0.08] p-4">
                <span className="block text-xs font-mono text-white uppercase tracking-wider mb-3">
                  Today&apos;s activity
                </span>
                <ul className="space-y-2">
                  {ACTIVITY.map((a) => (
                    <li
                      key={a.text}
                      className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] px-3.5 py-3 text-xs"
                    >
                      <span className="flex items-start gap-2.5 text-slate-200">
                        <a.Icon className={`w-4 h-4 shrink-0 mt-0.5 ${a.tone}`} />
                        {a.text}
                      </span>
                      <span className="text-slate-500 font-mono whitespace-nowrap">{a.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MotionReveal>

          {/* Outcomes */}
          <MotionReveal delay={0.1} className="lg:col-span-4">
            <ul className="space-y-4">
              {OUTCOMES.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 p-4"
                >
                  <HexCheck className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
