// app/admin/dashboard/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MascotLogo from "@/components/ui/MascotLogo";
import StatusBadge from "@/components/ui/StatusBadge";
<<<<<<< Updated upstream
import { VERTICALS } from "@/lib/verticals";
=======
import AdminNav from "@/components/admin/AdminNav";
import { BUSINESS_TYPES, PRODUCTS, businessTypeLabel } from "@/lib/products";
>>>>>>> Stashed changes
import {
  Search,
  Download,
  RefreshCw,
  LogOut,
  Eye,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Receipt
} from "lucide-react";

const PAGE_SIZE = 25;
const EXPORT_PAGE_SIZE = 100;
const STATUS_OPTIONS = ["new", "contacted", "qualified", "archived"];
const EMPTY_STATS = { total: 0, new: 0, contacted: 0, qualified: 0, archived: 0 };

function buildQuery({ page, limit, status, industry, search, stats = true }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
    industry,
    search
  });
  if (!stats) params.set("stats", "0");
  return params.toString();
}

// Quote a CSV cell and neutralise spreadsheet formula injection (cells starting with = + - @).
// Link to the admin subscriptions page with the "New subscription" form prefilled from a lead.
function newSubscriptionHref(lead) {
  const params = new URLSearchParams({ lead_id: lead.id, business_name: lead.company_name || lead.name || "" });
  if (lead.phone) params.set("phone", lead.phone);
  if (lead.email) params.set("email", lead.email);
  if (PRODUCTS.some((p) => p.slug === lead.industry)) params.set("product", lead.industry);
  return `/admin/subscriptions?${params}`;
}

function csvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Latest server response, tagged with the query it answers
  const [result, setResult] = useState({ key: null, leads: [], total: 0, error: "" });
  const [stats, setStats] = useState(EMPTY_STATS);

  // Selected lead for detail drawer
  const [selectedLead, setSelectedLead] = useState(null);
  const [patchingId, setPatchingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const queryKey = JSON.stringify([page, statusFilter, industryFilter, debouncedSearch, refreshKey]);
  const loading = result.key !== queryKey;
  const { leads, total: totalCount, error } = result;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleUnauthorized = () => {
    router.replace("/admin");
    router.refresh();
  };

  // Debounce search input so we don't query on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch leads; aborting stale requests prevents out-of-order responses from overwriting newer ones
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/admin/leads?${buildQuery({
            page,
            limit: PAGE_SIZE,
            status: statusFilter,
            industry: industryFilter,
            search: debouncedSearch
          })}`,
          { signal: controller.signal, cache: "no-store" }
        );

        if (res.status === 401) {
          router.replace("/admin");
          router.refresh();
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          // The current page can fall past the end after a status change or filter; jump to the last page
          const lastPage = Math.max(1, Math.ceil((data.total || 0) / PAGE_SIZE));
          if (page > lastPage) {
            setPage(lastPage);
            return;
          }
          setResult({ key: queryKey, leads: data.leads || [], total: data.total || 0, error: "" });
          if (data.stats) setStats(data.stats);
        } else {
          setResult({ key: queryKey, leads: [], total: 0, error: data.error || "Failed to load lead records." });
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        setResult({ key: queryKey, leads: [], total: 0, error: "Network communication error." });
      }
    })();

    return () => controller.abort();
  }, [queryKey, page, statusFilter, industryFilter, debouncedSearch, router]);

  // Close the drawer with Escape
  useEffect(() => {
    if (!selectedLead) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedLead(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedLead]);

  const refresh = () => setRefreshKey((k) => k + 1);

  // Update lead status (PATCH)
  const handleStatusUpdate = async (id, newStatus) => {
    setPatchingId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setResult((prev) => ({
          ...prev,
          leads: prev.leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        }));
        setSelectedLead((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
        // Re-sync counts and the current filter view from the server
        refresh();
      } else {
        alert(data.error || "Status update failed.");
      }
    } catch {
      alert("Failed to update status over network.");
    } finally {
      setPatchingId(null);
    }
  };

  // CSV Export — every lead matching the current filters, not just the visible page
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const allLeads = [];
      for (let exportPage = 1; exportPage <= 500; exportPage++) {
        const res = await fetch(
          `/api/admin/leads?${buildQuery({
            page: exportPage,
            limit: EXPORT_PAGE_SIZE,
            status: statusFilter,
            industry: industryFilter,
            search: debouncedSearch,
            stats: false
          })}`,
          { cache: "no-store" }
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Export failed.");
        }
        allLeads.push(...(data.leads || []));
        if (!data.leads?.length || allLeads.length >= data.total) break;
      }

      if (!allLeads.length) {
        alert("No leads match the current filters.");
        return;
      }

      const headers = [
        "Reference ID",
        "Date",
        "Name",
        "Email",
        "Phone",
        "Industry",
        "Status",
        "Operational Goals",
        "Message",
        "Source Page"
      ];

      const rows = allLeads.map((l) =>
        [
          l.reference_id,
          l.created_at ? new Date(l.created_at).toISOString() : "",
          l.name,
          l.email,
          l.phone,
          l.industry,
          l.status,
          l.goal,
          l.message,
          l.source_page
        ].map(csvCell)
      );

      // Leading BOM so Excel opens UTF-8 (₹, non-Latin names) correctly
      const csvContent = "\uFEFF" + [headers.map(csvCell).join(","), ...rows.map((r) => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `zugee_leads_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      handleUnauthorized();
    }
  };

  const firstRow = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="min-h-screen bg-[#06090F] text-white p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div className="flex items-center gap-3">
          <MascotLogo size={40} showWordmark={true} showSubline={true} />
          <span className="hidden md:inline-block h-6 w-px bg-white/[0.1] mx-2" />
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 hidden md:inline-flex items-center gap-1.5 font-medium shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Lead Queue Administration
          </span>
          <AdminNav active="/admin/dashboard" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-400 hover:text-white cursor-pointer transition-colors"
            title="Refresh Leads"
            aria-label="Refresh leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#00F0FF]" : ""}`} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!totalCount || exporting}
            className="btn-secondary text-xs font-mono !py-2 !px-3.5 cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${exporting ? "animate-pulse" : ""}`} />
            <span className="hidden sm:inline">{exporting ? "Exporting..." : `Export CSV (${totalCount})`}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
            title="Log Out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
              Total Inquiries
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {stats.total}
            </div>
            <span className="text-[11px] font-mono text-[#00F0FF] mt-1 block font-medium">
              All time captures
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
              New / Uncontacted
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#38BDF8]">
              {stats.new}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-1 block">
              Pending solutions review
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
              Contacted
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00F0FF]">
              {stats.contacted}
            </div>
            <span className="text-[11px] font-mono text-[#00F0FF] mt-1 block font-medium">
              Discovery in progress
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
              Qualified
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
              {stats.qualified}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-1 block font-medium">
              Moving to 14-day setup
            </span>
          </div>
        </div>

        {/* Filters & Search Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
            {["all", ...STATUS_OPTIONS].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize border cursor-pointer whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                    : "bg-white/[0.02] text-slate-400 border-transparent hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search & Industry Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Name, email, phone or ref ID..."
                aria-label="Search leads"
                value={searchQuery}
                maxLength={100}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#06090F] border border-white/[0.1] focus:border-[#00F0FF] rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <select
              value={industryFilter}
              aria-label="Filter by industry"
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#06090F] border border-white/[0.1] focus:border-[#00F0FF] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none cursor-pointer w-auto"
            >
              <option value="all">All Verticals</option>
              {VERTICALS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.shortName}
                </option>
              ))}
              <option value="other">Other / Bespoke</option>
            </select>
          </div>
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-400 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Leads Table */}
        <div className="rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg overflow-hidden">
          <div className={`overflow-x-auto transition-opacity ${loading && leads.length ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[760px] text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 bg-[#0D1527]">
                  <th className="py-3 px-4 font-semibold">Ref ID</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Lead Contact</th>
                  <th className="py-3 px-4 font-semibold">Industry</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {loading && leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                      <span className="inline-block w-4 h-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mr-2" />
                      Querying secure lead queue...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                      No lead records matching selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Ref ID */}
                      <td className="py-3.5 px-4 font-bold text-[#00F0FF]">
                        {lead.reference_id || "—"}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white font-sans text-sm">
                          {lead.name}
                        </div>
                        <div className="text-slate-400 text-[11px]">{lead.email}</div>
                        {lead.phone && (
                          <div className="text-slate-400 text-[10px]">{lead.phone}</div>
                        )}
                      </td>

                      {/* Industry */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25 uppercase text-[10px] font-semibold">
                          {lead.industry}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          disabled={patchingId === lead.id}
                          aria-label={`Status for ${lead.name}`}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                          className="bg-[#06090F] border border-white/[0.12] rounded-lg px-2.5 py-1 text-xs text-white font-mono cursor-pointer outline-none capitalize"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] cursor-pointer transition-colors"
                          title="View Details"
                          aria-label={`View details for ${lead.name}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.08] bg-[#0D1527] text-xs font-mono text-slate-400">
            <span>
              {totalCount === 0 ? "No results" : `Showing ${firstRow}–${lastRow} of ${totalCount}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-300">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Detail Slide-Over Drawer */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Lead ${selectedLead.reference_id || selectedLead.name}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-[#0A0F1D] border-l border-white/[0.1] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] block font-semibold">
                    Inquiry Record
                  </span>
                  <h3 className="text-xl font-bold font-sans text-white mt-0.5">
                    {selectedLead.reference_id || "Lead Details"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.1] cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-[#06090F] border border-white/[0.08] flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-slate-400">Current Lead State:</span>
                <StatusBadge status={selectedLead.status} />
              </div>

              {/* Contact Metadata */}
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 uppercase block mb-1 font-semibold">Full Name</span>
                  <span className="text-white text-sm font-sans font-semibold">
                    {selectedLead.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 uppercase block mb-1 font-semibold">Official Email</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-white break-all hover:text-[#00F0FF]">
                      {selectedLead.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase block mb-1 font-semibold">Phone / WhatsApp</span>
                    <span className="text-white">{selectedLead.phone || "Not provided"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 uppercase block mb-1 font-semibold">Operating Industry</span>
                    <span className="text-[#00F0FF] capitalize font-medium">{selectedLead.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase block mb-1 font-semibold">Source Ingestion</span>
                    <span className="text-slate-300">{selectedLead.source_page || "homepage"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1 font-semibold">Operational Goals</span>
                  <div className="p-3.5 rounded-xl bg-[#06090F] text-slate-300 border border-white/[0.08] font-sans text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {selectedLead.goal || "No specific operational goals specified."}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1 font-semibold">Inquiry Message / Notes</span>
                  <div className="p-3.5 rounded-xl bg-[#06090F] text-slate-300 border border-white/[0.08] font-sans text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {selectedLead.message || "No additional message provided."}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1 font-semibold">Logged Timestamp</span>
                  <span className="text-slate-400">
                    {new Date(selectedLead.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Changers */}
            <div className="pt-6 border-t border-white/[0.08] mt-6">
              <Link
                href={newSubscriptionHref(selectedLead)}
                className="mb-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono hover:bg-emerald-500/25 font-medium transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                Create subscription
              </Link>
              <span className="text-xs font-mono text-slate-400 block mb-3 font-semibold">
                Update Pipeline Status:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={patchingId === selectedLead.id}
                  onClick={() => handleStatusUpdate(selectedLead.id, "contacted")}
                  className="py-2.5 px-3 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 text-xs font-mono cursor-pointer hover:bg-[#00F0FF]/25 font-medium transition-colors disabled:opacity-50"
                >
                  Mark Contacted
                </button>
                <button
                  type="button"
                  disabled={patchingId === selectedLead.id}
                  onClick={() => handleStatusUpdate(selectedLead.id, "qualified")}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono cursor-pointer hover:bg-emerald-500/25 font-medium transition-colors disabled:opacity-50"
                >
                  Mark Qualified
                </button>
                <button
                  type="button"
                  disabled={patchingId === selectedLead.id}
                  onClick={() => handleStatusUpdate(selectedLead.id, "archived")}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.05] text-slate-300 border border-white/[0.1] text-xs font-mono cursor-pointer hover:bg-white/[0.1] font-medium transition-colors disabled:opacity-50"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
