// components/chat/ChatWidget.jsx
// "Ask ZUGEE": the website chat assistant. A button in the bottom corner opens a panel; replies
// stream in from /api/chat. The conversation lives in this browser tab only (sessionStorage) and is
// gone when the tab closes: nothing is saved on our side (see the Privacy Policy).
//
// Hand-off: the assistant ends a reply with [[demo:<product id>]] when the visitor wants a demo; the
// marker is hidden and a "Book a demo" button appears, which pre-selects that product in the form.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, Sparkles, X, CalendarCheck } from "lucide-react";
import { WHATSAPP_CHAT_URL } from "@/lib/site";
import { getProduct } from "@/lib/products";

const STORAGE_KEY = "zugee-chat";
const MAX_INPUT = 800;
const SUGGESTIONS = [
  "Which ZUGEE product fits my business?",
  "How does pricing work?",
  "How long does setup take?",
  "Can my staff use it on mobile?"
];
const WELCOME =
  "Hi! I can answer questions about ZUGEE's products, setup and pricing. What kind of business do you run?";

// The marker, complete or still arriving at the end of a streaming reply.
const MARKER = /\[\[demo:([a-z0-9-]+)\]\]/;
const PARTIAL_MARKER = /\[(\[(d(e(m(o(:[a-z0-9-]*\]?)?)?)?)?)?)?$/;

function splitReply(text) {
  const match = text.match(MARKER);
  const visible = text.replace(MARKER, "").replace(PARTIAL_MARKER, "").trimEnd();
  return { visible, demoSlug: match ? match[1] : null };
}

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
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  // The saved conversation is read when the panel first opens, and saved only after that, so the
  // empty initial state never overwrites a chat kept from before a reload.
  const restoredRef = useRef(false);
  const router = useRouter();

  function toggle() {
    if (!restoredRef.current) {
      restoredRef.current = true;
      setMessages(loadConversation());
    }
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

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text) {
    const question = text.trim().slice(0, MAX_INPUT);
    if (!question || busy) return;
    setError("");
    setInput("");
    const history = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The whole conversation so far (the API is stateless); empty replies from failed turns are dropped.
        body: JSON.stringify({ messages: history.filter((m) => m.content.trim()) }),
        signal: controller.signal
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
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
      if (!reply.trim()) throw new Error("No answer came back. Please try again, or book a demo.");
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages(history.slice(0, -1)); // drop the unanswered question; it goes back in the box
      setInput(question);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function newChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
    setBusy(false);
    inputRef.current?.focus();
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Ask ZUGEE chat assistant"
          className="fixed z-40 inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[380px] h-[min(600px,calc(100dvh-6.5rem))] flex flex-col rounded-2xl bg-surface border border-line shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line bg-canvas-alt">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-fg leading-tight">Ask ZUGEE</p>
                <p className="text-[11px] text-slate-400 leading-tight">AI assistant · answers from our website</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button type="button" onClick={newChat} className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-fg hover:bg-ink/[0.06] cursor-pointer">
                  New chat
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded-lg text-slate-400 hover:text-fg hover:bg-ink/[0.06] cursor-pointer">
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
              const { visible, demoSlug } = splitReply(m.content);
              const product = demoSlug && demoSlug !== "other" ? getProduct(demoSlug) : null;
              const streaming = busy && i === messages.length - 1;
              return (
                <div key={i} className="space-y-2">
                  <Bubble role="assistant">{visible || (streaming ? <TypingDots /> : "")}</Bubble>
                  {demoSlug && !streaming && (
                    <button type="button" onClick={() => openDemoForm(demoSlug, router)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 cursor-pointer">
                      <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      {product ? `Book a ${product.name} demo` : "Book a demo"}
                    </button>
                  )}
                </div>
              );
            })}
            {error && (
              <p role="alert" className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                {error}
              </p>
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
                rows={1}
                value={input}
                maxLength={MAX_INPUT}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Type your question…"
                // 16px on phones: iOS zooms the page when a smaller input is focused.
                className="flex-1 resize-none max-h-28 bg-canvas border border-ink/[0.12] focus:border-cyan-400 rounded-xl px-3 py-2.5 text-base sm:text-sm text-fg outline-none"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="p-2.5 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
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
              AI answers can be wrong; our team confirms details on a call. Chats are processed by Google — please don&apos;t
              share personal, health or payment details.{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-300">Privacy</Link>
            </p>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask ZUGEE: chat with our assistant"}
        className={`fixed z-40 right-4 bottom-4 sm:right-5 sm:bottom-5 items-center gap-2 rounded-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_8px_30px_rgba(6,182,212,0.45)] hover:scale-105 transition-transform cursor-pointer ${
          open ? "hidden sm:inline-flex p-3.5" : "inline-flex pl-4 pr-5 py-3.5"
        }`}
      >
        {open ? <X className="w-5 h-5" aria-hidden="true" /> : <MessageCircle className="w-5 h-5" aria-hidden="true" />}
        {!open && <span className="text-sm font-bold">Ask ZUGEE</span>}
      </button>
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

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Typing">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}
