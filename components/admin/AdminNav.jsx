// components/admin/AdminNav.jsx
// Section switcher shared by the admin portal pages (Leads / Subscriptions).

import Link from "next/link";
import { Inbox, Receipt } from "lucide-react";

const SECTIONS = [
  { href: "/admin/dashboard", label: "Leads", icon: Inbox },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Receipt }
];

export default function AdminNav({ active }) {
  return (
    <nav aria-label="Admin sections" className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
      {SECTIONS.map(({ href, label, icon: Icon }) => {
        const isActive = active === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              isActive
                ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-semibold"
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
