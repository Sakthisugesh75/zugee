// components/admin/AdminLoginForm.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MascotLogo from "@/components/ui/MascotLogo";
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      // The server sets an httpOnly session cookie on success; no token is handled in the browser.
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }

      setError(data.error || "Authentication failed.");
      setShake(true);
      setTimeout(() => setShake(false), 600);

      if (data.locked) {
        setIsLocked(true);
      } else if (data.remainingAttempts !== undefined) {
        setRemainingAttempts(data.remainingAttempts);
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#06090F] bg-cyber-grid text-white overflow-hidden">
      {/* Ambient center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div
        className={`relative z-10 w-full max-w-md bg-[#0A0F1D]/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-white/[0.12] shadow-[0_20px_70px_rgba(0,0,0,0.8)] transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center mb-8">
          <MascotLogo size={44} showWordmark={true} showSubline={true} />
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <Lock className="w-3.5 h-3.5" />
            <span>Administrator Access Portal</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2"
            >
              Admin Master Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                disabled={loading || isLocked}
                className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-mono text-sm outline-none transition-colors pr-10"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-400"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{error}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="text-[11px] font-mono text-rose-400">
                    Remaining attempts before lockout: {remainingAttempts}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="btn-primary w-full text-xs font-mono uppercase tracking-wider !py-3.5 cursor-pointer shadow-lg justify-center"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Authenticate Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
            Secure httpOnly session
          </span>
          <Link href="/" className="text-slate-400 hover:text-[#00F0FF] transition-colors">
            Return to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
