// components/chat/ChatWidget.jsx
// "Ask Tutu": the website chat assistant (Tutu is the ZUGEE mascot). The live mascot
// (components/chat/TutuCompanion.jsx) in the bottom corner opens a panel; replies
// stream in from /api/chat. The conversation lives in this browser tab only (sessionStorage) and is
// gone when the tab closes: nothing is saved on our side (see the Privacy Policy).
//
// Hand-off: the assistant ends a reply with [[demo:<product id>]] when the visitor wants a demo; the
// marker is hidden and a "Book a demo" button appears, which pre-selects that product in the form.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageCircle, Send, X, CalendarCheck } from "lucide-react";
import TutuCompanion from "@/components/chat/TutuCompanion";
import { PHONE_DISPLAY, WHATSAPP_CHAT_URL } from "@/lib/site";
import { getProduct } from "@/lib/products";
import { richSegments, splitReply } from "@/lib/chatbot/format";
import { GUEST_LIMIT_MESSAGE } from "@/lib/chatbot/guest-copy";

const STORAGE_KEY = "zugee-chat";
// Guests: 1,000 characters; signed-in users: 2,000 (the server enforces both).
const GUEST_MAX_INPUT = 1000;
const SIGNED_IN_MAX_INPUT = 2000;
// Matches the server's guest cooldown, so the Send button simply waits instead of erroring.
const CLIENT_COOLDOWN_MS = 3000;
const SUGGESTIONS = [
  "Which product fits my business?",
  "How does pricing work?",
  "How long does setup take?",
  "Does it work with Tally?"
];
const WELCOME =
  "Vanakkam! I'm Tutu. Tell me about your business and I'll help you find the right ZUGEE product.";
// Network failures and server errors (5xx): shown with a Retry button.
const SERVER_UNREACHABLE = `I couldn't reach the server. You can WhatsApp us at ${PHONE_DISPLAY} or try again.`;

function loadConversation() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((m) => m && typeof m.content === "string") : [];
  } catch {
    return [];
  }
}

/** Scroll to the demo form on this page with the product pre-selected, or go to the homepage form. */
function openDemoForm(slug, router) {
  const form = document.getElementById("contact");
  if (!form) {
    router.push("/#contact");
    return;
  }
  if (slug && slug !== "other") {
    window.dispatchEvent(new CustomEvent("zugee:select-product", { detail: { slug } }));
  }
  const navbarHeight = document.querySelector("header")?.getBoundingClientRect().height || 0;
  window.scrollTo({ top: Math.max(0, form.getBoundingClientRect().top + window.scrollY - navbarHeight - 16), behavior: "smooth" });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // The question to resend when the visitor presses Retry (only after a network or server error).
  const [retryQuestion, setRetryQuestion] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const panelRef = useRef(null);
  // The live mascot (<tutu-companion>): its moods follow the chat, and focus returns to its
  // "Ask Tutu" pill when the panel closes.
  const tutuRef = useRef(null);
  const returnFocusRef = useRef(false);
  // The saved conversation is read when the panel first opens, and saved only after that, so the
  // empty initial state never overwrites a chat kept from before a reload.
  const restoredRef = useRef(false);
  const router = useRouter();
  // Guest quota from the server: { guest: true, remaining, limit } or { guest: false } when signed in.
  // Display only; the server enforces every limit.
  const [quota, setQuota] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const maxInput = quota?.guest === false ? SIGNED_IN_MAX_INPUT : GUEST_MAX_INPUT;

  function applyQuota(next) {
    setQuota(next);
    if (next?.guest && next.remaining === 0) setLimitReached(true);
  }

  function toggle() {
    if (!restoredRef.current) {
      restoredRef.current = true;
      setMessages(loadConversation());
      fetch("/api/chat", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && applyQuota(data))
        .catch(() => {});
    }
    // Closing from the launcher's own close button also hands focus back to "Ask Tutu".
    if (open) returnFocusRef.current = true;
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Private mode or storage blocked: the chat still works, it just isn't kept across reloads.
    }
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  function closeChat() {
    returnFocusRef.current = true;
    setOpen(false);
  }

  useEffect(() => {
    const pill = tutuRef.current?.shadowRoot?.querySelector(".pill");
    pill?.setAttribute("aria-expanded", String(open));
    // Opening the chat dismisses Tutu's greeting bubble, which would otherwise peek out under the panel.
    if (open) tutuRef.current?.shadowRoot?.querySelector(".bubble")?.classList.remove("show");
    if (!open) {
      // Back to the "Ask Tutu" pill after the panel closes (Esc, ×, or a link on a phone).
      if (returnFocusRef.current) {
        returnFocusRef.current = false;
        pill?.focus();
      }
      return;
    }
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Keeps Tab and Shift+Tab inside the open panel. */
  function trapFocus(e) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /** A link in a reply: "#id" or "/#id" scrolls when that section is on this page (and closes the panel on phones). */
  function followAnchor(e, href) {
    const target = document.getElementById(href.slice(href.indexOf("#") + 1));
    if (!target) return; // not on this page: let the browser handle it
    e.preventDefault();
    const navbarHeight = document.querySelector("header")?.getBoundingClientRect().height || 0;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16), behavior: "smooth" });
    if (window.matchMedia("(max-width: 639px)").matches) closeChat();
  }

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text) {
    const question = text.trim().slice(0, maxInput);
    if (!question || busy || coolingDown || limitReached) return;
    setError("");
    setRetryQuestion(null);
    setInput("");
    const history = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    if (quota?.guest !== false) {
      setCoolingDown(true);
      setTimeout(() => setCoolingDown(false), CLIENT_COOLDOWN_MS);
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const tutu = tutuRef.current;
    tutu?.setMood?.("thinking"); // held until the reply ends
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The whole conversation so far (the API is stateless); empty replies from failed turns are dropped.
        body: JSON.stringify({ messages: history.filter((m) => m.content.trim()) }),
        signal: controller.signal
      });
      const remaining = response.headers.get("X-Chat-Guest-Remaining");
      if (remaining !== null) {
        applyQuota({ guest: true, remaining: Number(remaining), limit: Number(response.headers.get("X-Chat-Guest-Limit")) });
      }
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 429 && data.reason === "daily") setLimitReached(true);
        throw Object.assign(new Error(data.error || "Something went wrong. Please try again."), { status: response.status });
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) throw Object.assign(new Error("No answer came back."), { status: 502 });
      tutu?.clearMood?.();
      tutu?.setMood?.("happy", 1500);
    } catch (err) {
      tutu?.clearMood?.();
      if (err.name === "AbortError") return;
      tutu?.setMood?.("sad", 2000);
      setMessages(history.slice(0, -1)); // drop the unanswered question
      // Network failure (no status) or a server error: the brief's message with WhatsApp and Retry.
      // Limits and validation (4xx) keep the server's own message, and the question goes back in the box.
      if (!err.status || err.status >= 500) {
        setError(SERVER_UNREACHABLE);
        setRetryQuestion(question);
      } else {
        setError(err.message);
        setInput(question);
      }
    } finally {
      setBusy(false);
    }
  }

  function newChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
    setRetryQuestion(null);
    setBusy(false);
    inputRef.current?.focus();
  }

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ask Tutu, ZUGEE's chat assistant"
          onKeyDown={trapFocus}
          className="fixed z-40 inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-[10.5rem] sm:w-[380px] h-[min(600px,calc(100dvh-6.5rem))] sm:h-[min(600px,calc(100dvh-13rem))] flex flex-col rounded-2xl bg-surface border border-line shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line bg-canvas-alt">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30" aria-hidden="true">
                <span className="tutu-float absolute -inset-1 block">
                  <Image src="/zugee-tutu-avatar.webp" alt="" width={48} height={48} className="w-full h-full select-none" draggable={false} />
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-fg leading-tight">Ask Tutu</p>
                <p className="text-[11px] text-slate-400 leading-tight">Answers about ZUGEE products</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button type="button" onClick={newChat} className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-fg hover:bg-ink/[0.06] cursor-pointer">
                  New chat
                </button>
              )}
              <button type="button" onClick={closeChat} aria-label="Close chat" className="p-1.5 rounded-lg text-slate-400 hover:text-fg hover:bg-ink/[0.06] cursor-pointer">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            <Bubble role="assistant">{WELCOME}</Bubble>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="px-3 py-1.5 rounded-full text-xs text-slate-200 bg-ink/[0.04] border border-ink/[0.12] hover:border-cyan-400/50 hover:text-fg text-left cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => {
              if (m.role === "user") return <Bubble key={i} role="user">{m.content}</Bubble>;
              const { visible, demoSlugs } = splitReply(m.content);
              const streaming = busy && i === messages.length - 1;
              return (
                <div key={i} className="space-y-2">
                  <Bubble role="assistant">{visible ? <RichText text={visible} onAnchor={followAnchor} /> : streaming ? <TypingDots /> : ""}</Bubble>
                  {!streaming && demoSlugs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {demoSlugs.map((slug) => {
                        const product = slug !== "other" ? getProduct(slug) : null;
                        return (
                          <button key={slug} type="button" onClick={() => openDemoForm(slug, router)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 cursor-pointer">
                            <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            {product ? `Book a ${product.name} demo` : "Book a demo"}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {limitReached ? (
              <p role="status" className="text-xs text-slate-200 bg-cyan-500/10 border border-cyan-400/30 rounded-xl px-3 py-2">
                {GUEST_LIMIT_MESSAGE}
              </p>
            ) : (
              error && (
                <div role="alert" className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                  <p>{error}</p>
                  {retryQuestion && (
                    <button type="button" onClick={() => send(retryQuestion)} disabled={busy || coolingDown} className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold text-fg bg-ink/[0.06] border border-ink/[0.12] hover:border-cyan-400/50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                      Try again
                    </button>
                  )}
                </div>
              )
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-line px-3 pt-3 pb-2 bg-canvas-alt"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">Your question</label>
              <textarea
                id="chat-input"
                ref={inputRef}
                // Tutu looks up, thinking, while the visitor types (lib/tutu-companion.js).
                data-tutu-think=""
                rows={1}
                value={input}
                maxLength={maxInput}
                disabled={limitReached}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={limitReached ? "Today's free messages are used up" : "Type your question…"}
                // 16px on phones: iOS zooms the page when a smaller input is focused.
                className="flex-1 resize-none max-h-28 bg-canvas border border-ink/[0.12] focus:border-cyan-400 rounded-xl px-3 py-2.5 text-base sm:text-sm text-fg outline-none"
              />
              <button type="submit" disabled={busy || coolingDown || limitReached || !input.trim()} aria-label="Send" className="p-2.5 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            {quota?.guest && !limitReached && (
              <p className="mt-1.5 text-[11px] text-slate-400" aria-live="polite">
                {quota.remaining} of {quota.limit} free messages left today
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <button type="button" onClick={() => openDemoForm(null, router)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-ink/[0.04] border border-ink/[0.12] hover:border-cyan-400/50 cursor-pointer">
                <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                Book a demo
              </button>
              <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-ink/[0.04] border border-[#25D366]/40 hover:border-[#25D366]/70">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>
            <p className="mt-2 text-[10.5px] leading-snug text-slate-500">
              AI assistant. Answers can be wrong; confirm important details with our team. Chats are processed by Google — please don&apos;t
              share personal, health or payment details.{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-300">Privacy</Link>
            </p>
          </form>
        </div>
      )}

      {/* Launcher: Tutu, the live mascot, docked on its "Ask Tutu" pill */}
      <TutuCompanion ref={tutuRef} onOpen={toggle} />
    </>
  );
}

function Bubble({ role, children }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          mine ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md" : "bg-card border border-line text-slate-200 rounded-bl-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

const LINK_CLASS = "font-semibold text-cyan-400 underline underline-offset-2 hover:text-cyan-300";

/**
 * The assistant's light formatting: **bold** for key figures, "* " bullets shown as "• ", and
 * Markdown links (only safe targets; see lib/chatbot/format.js). Built from React elements (never
 * HTML), so model output cannot inject markup.
 */
function RichText({ text, onAnchor }) {
  return richSegments(text).map((segment, i) => {
    const { href } = segment;
    if (href?.startsWith("#") || href?.startsWith("/#")) {
      return (
        <a key={i} href={href} onClick={(e) => onAnchor(e, href)} className={LINK_CLASS}>
          {segment.text}
        </a>
      );
    }
    if (href?.startsWith("/")) {
      return (
        <Link key={i} href={href} className={LINK_CLASS}>
          {segment.text}
        </Link>
      );
    }
    if (href?.startsWith("https://")) {
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {segment.text}
        </a>
      );
    }
    if (href) {
      return (
        <a key={i} href={href} className={LINK_CLASS}>
          {segment.text}
        </a>
      );
    }
    return segment.bold ? (
      <strong key={i} className="font-semibold text-fg">
        {segment.text}
      </strong>
    ) : (
      segment.text
    );
  });
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Typing">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}
