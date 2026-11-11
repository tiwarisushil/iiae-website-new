'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { HELPLINE_PHONES } from '@/lib/site';
import { useSession } from '@/lib/student/session';

const HELPLINE_DIGITS = HELPLINE_PHONES[0].tel.replace(/\D/g, '');
const WHATSAPP_TEXT = encodeURIComponent('Hello, I would like to know more about admission at IIAE.');
const STAFF_HIDDEN_ROLES = new Set(['admin', 'manager', 'counsellor']);

const WELCOME =
  'Namaste! I’m your IIAE admission assistant. Ask about AIAEE, courses, fees, or say **“take me to apply”** and I’ll open the right page for you.';

const QUICK_PROMPTS = [
  { label: 'Where to apply?', text: 'Where can I apply?' },
  { label: 'AIAEE 2027', text: 'Tell me about AIAEE 2027' },
  { label: 'Pay fees', text: 'Where can I pay fees online?' },
  { label: 'Helpline', text: 'What is the admission helpline?' },
];

const PILL =
  'inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 text-[13px] font-semibold leading-none no-underline shadow-[0_6px_20px_rgba(4,31,69,0.28)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(4,31,69,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-[479px]:px-[13px]';

type Navigation = { path: string; label: string; external?: boolean };
type ChatMessage = { role: 'user' | 'assistant'; content: string; navigation?: Navigation | null; isError?: boolean };
type Status = 'checking' | 'online' | 'offline';

const SITE_HOSTS = new Set(['iiae.in', 'www.iiae.in']);

/** Chatbot links were written for the student portal and iiae.in. Keep them on this site. */
function destination(nav: Navigation) {
  let path = nav.path;
  let external = Boolean(nav.external);
  if (external) {
    try {
      const url = new URL(path);
      if (SITE_HOSTS.has(url.hostname)) {
        path = `${url.pathname}${url.search}${url.hash}` || '/';
        external = false;
      }
    } catch {
      // Leave an unparseable link as an external URL.
    }
  }
  if (path === '/apply-now') path = '/apply-online';
  return { path, external };
}

function formatAssistantText(text: string) {
  return String(text || '').split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>,
  );
}

function AdmissionChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const session = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>('checking');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const goTo = useCallback(
    (navigation: Navigation | null | undefined) => {
      if (!navigation?.path) return;
      const next = destination(navigation);
      if (next.external) {
        window.open(next.path, '_blank', 'noopener,noreferrer');
        return;
      }
      router.push(next.path);
      onClose();
    },
    [onClose, router],
  );

  useEffect(() => {
    if (!open) return undefined;
    const mq = window.matchMedia('(max-width: 639px)');
    const applyScrollLock = () => {
      document.body.style.overflow = mq.matches ? 'hidden' : '';
    };
    applyScrollLock();
    mq.addEventListener('change', applyScrollLock);
    return () => {
      document.body.style.overflow = '';
      mq.removeEventListener('change', applyScrollLock);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setStatus('checking');
    fetch(`${API_BASE_URL}/chatbot/status`, { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) setStatus(body?.enabled ? 'online' : 'offline');
      })
      .catch(() => {
        if (!cancelled) setStatus('offline');
      });
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, sending]);

  const submitText = useCallback(
    async (text: string) => {
      const trimmed = String(text || '').trim();
      if (!trimmed || sending) return;

      const next = [...messagesRef.current, { role: 'user' as const, content: trimmed }];
      setMessages(next);
      setInput('');
      setSending(true);

      try {
        const res = await fetch(`${API_BASE_URL}/chatbot/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            messages: next
              .filter((m) => m.role === 'user' || m.role === 'assistant')
              .map((m) => ({ role: m.role, content: m.content })),
            context: { loggedIn: Boolean(session), role: session?.user.role || null },
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const fallback =
            data.message || 'Sorry, something went wrong. Please call +91 9870290575 for immediate help.';
          setMessages((prev) => [...prev, { role: 'assistant', content: fallback, isError: true }]);
          return;
        }
        const navigation = (data.navigation || null) as Navigation | null;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply || 'Sorry, I could not generate a reply. Please call +91 9870290575.',
            navigation,
          },
        ]);
        if (navigation) goTo(navigation);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, something went wrong. Please call +91 9870290575 for immediate help.', isError: true },
        ]);
      } finally {
        setSending(false);
      }
    },
    [goTo, sending, session],
  );

  if (!open) return null;

  return (
    <div
      className="pointer-events-auto flex h-[min(72vh,560px)] max-h-[calc(100dvh-140px)] min-h-0 w-[min(100vw-24px,400px)] animate-[iiae-chat-in_0.22s_ease-out] flex-col overflow-hidden rounded-2xl border border-[rgba(4,31,69,0.12)] bg-white shadow-[0_20px_50px_rgba(4,31,69,0.22)] motion-reduce:animate-none max-[639px]:fixed max-[639px]:inset-0 max-[639px]:z-[1052] max-[639px]:h-full max-[639px]:max-h-none max-[639px]:w-full max-[639px]:animate-[iiae-chat-in-mobile_0.2s_ease-out] max-[639px]:rounded-none max-[639px]:border-0"
      role="dialog"
      aria-label="IIAE admission chat"
      aria-modal="true"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-primary bg-[linear-gradient(135deg,#031a3a_0%,#041f45_55%,#0a2d5c_100%)] px-4 py-3.5 text-white max-[639px]:px-[max(16px,env(safe-area-inset-left))] max-[639px]:pt-[max(14px,env(safe-area-inset-top))] max-[639px]:pr-[max(16px,env(safe-area-inset-right))]">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/assets/web/images/IIAE-LOGO.png" alt="" className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1 shadow-[0_2px_8px_rgba(0,0,0,0.15)]" />
          <div className="min-w-0">
            <p className="m-0 text-base font-bold leading-tight tracking-tight">Admission Assistant</p>
            <p className="m-0 mt-[3px] flex items-center gap-1.5 text-[11px] font-medium opacity-90">
              <span
                className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                  status === 'online'
                    ? 'bg-[#4ade80] shadow-[0_0_0_3px_rgba(74,222,128,0.35)]'
                    : status === 'offline'
                      ? 'bg-[#fbbf24]'
                      : 'animate-pulse bg-[#94a3b8]'
                }`}
                aria-hidden="true"
              />
              {status === 'checking' && 'Connecting…'}
              {status === 'online' && 'Online · IIAE New Delhi'}
              {status === 'offline' && 'Helpline only · AI offline'}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-white/20 bg-white/10 text-white hover:bg-white/15"
          onClick={onClose}
          aria-label="Close chat"
        >
          <i className="fa-solid fa-xmark text-[16px]" aria-hidden="true" />
        </button>
      </header>

      <div
        ref={listRef}
        className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto bg-[#f4f6f9] px-3.5 py-4"
      >
        {messages.map((msg, index) => {
          const mine = msg.role === 'user';
          return (
            <div key={`${index}-${msg.role}`} className={`flex max-w-full items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
              {!mine && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-heading text-white" aria-hidden="true">
                  <i className="fa-solid fa-robot text-[13px]" />
                </span>
              )}
              <div
                className={`max-w-[min(100%,280px)] px-[13px] py-2.5 text-[13px] leading-normal max-[639px]:max-w-[min(100%,calc(100vw-72px))] ${
                  mine
                    ? '[border-radius:14px_14px_4px_14px] bg-[linear-gradient(145deg,#0a2d5c,#041f45)] text-white shadow-[0_2px_8px_rgba(4,31,69,0.2)]'
                    : msg.isError
                      ? '[border-radius:14px_14px_14px_4px] border border-[#fecaca] bg-[#fef2f2] text-[#991b1b]'
                      : '[border-radius:14px_14px_14px_4px] border border-[#e2e8f0] bg-white text-[#1e293b] shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
                }`}
              >
                <p className="m-0 whitespace-pre-wrap">{mine ? msg.content : formatAssistantText(msg.content)}</p>
                {msg.navigation && (
                  <button
                    type="button"
                    className="mt-2.5 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 bg-primary px-3 py-2 text-xs font-bold text-[#1a1a1a] hover:brightness-105"
                    onClick={() => goTo(msg.navigation)}
                  >
                    <i className={`fa-solid ${msg.navigation.external ? 'fa-arrow-up-right-from-square' : 'fa-arrow-right'} text-[12px]`} aria-hidden="true" />
                    Open {msg.navigation.label}
                  </button>
                )}
              </div>
              {mine && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e2e8f0] text-[#475569]" aria-hidden="true">
                  <i className="fa-solid fa-user text-[12px]" />
                </span>
              )}
            </div>
          );
        })}
        {sending && (
          <div className="flex items-end gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-heading text-white" aria-hidden="true">
              <i className="fa-solid fa-robot text-[13px]" />
            </span>
            <div className="[border-radius:14px_14px_14px_4px] border border-[#e2e8f0] bg-white px-4 py-3">
              <span className="inline-flex items-center gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 animate-[iiae-dot_1.2s_ease-in-out_infinite] rounded-full bg-[#94a3b8]" />
                <span className="h-1.5 w-1.5 animate-[iiae-dot_1.2s_ease-in-out_infinite] rounded-full bg-[#94a3b8] [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-[iiae-dot_1.2s_ease-in-out_infinite] rounded-full bg-[#94a3b8] [animation-delay:0.3s]" />
              </span>
              <span className="sr-only">Assistant is typing</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-[#eef2f6] bg-white px-3 pt-2">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="cursor-pointer rounded-full border border-[#d4d9e2] bg-[#f8fafc] px-2.5 py-1.5 text-[11px] font-semibold text-heading transition hover:border-primary hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={sending}
            onClick={() => submitText(item.text)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        className="shrink-0 border-t border-[#eef2f6] bg-white px-3 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] max-[639px]:px-[max(12px,env(safe-area-inset-left))] max-[639px]:pr-[max(12px,env(safe-area-inset-right))]"
        onSubmit={(event) => {
          event.preventDefault();
          submitText(input);
        }}
      >
        <div className="flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] py-1 pr-1 pl-3.5 transition focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(195,168,35,0.2)]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about admissions, AIAEE, apply…"
            disabled={sending}
            maxLength={2000}
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label="Send message"
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-[10px] border-0 bg-primary text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <i className={`fa-solid ${sending ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-[14px]`} aria-hidden="true" />
          </button>
        </div>
        <p className="m-0 mt-2 mb-0 text-center text-[10px] leading-snug text-[#94a3b8]">
          IIAE may use AI to answer. For official decisions, contact admissions.
        </p>
      </form>
    </div>
  );
}

export default function ContactDock() {
  const pathname = usePathname();
  const session = useSession();
  const [chatOpen, setChatOpen] = useState(false);

  const onDashboard = pathname.startsWith('/dashboard');
  const show = !onDashboard || (Boolean(session) && !STAFF_HIDDEN_ROLES.has(session?.user.role ?? ''));

  useEffect(() => {
    if (!chatOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatOpen]);

  if (!show) return null;

  return (
    <div
      className={`pointer-events-none fixed z-[1050] flex flex-col items-end gap-3 print:hidden right-[max(12px,env(safe-area-inset-right))] bottom-[max(14px,env(safe-area-inset-bottom))] ${
        chatOpen ? 'max-[639px]:inset-0 max-[639px]:items-stretch max-[639px]:gap-0' : ''
      }`}
      aria-label="Quick contact"
    >
      <AdmissionChat open={chatOpen} onClose={() => setChatOpen(false)} />
      <div className={`pointer-events-auto flex flex-col items-end gap-2.5 ${chatOpen ? 'max-[639px]:hidden' : ''}`}>
        <button
          type="button"
          className={`${PILL} font-bold ${
            chatOpen ? 'bg-heading text-white' : 'bg-[linear-gradient(145deg,#d4b42a,#c3a823)] text-[#1a1a1a]'
          }`}
          onClick={() => setChatOpen((open) => !open)}
          aria-expanded={chatOpen}
          aria-label={chatOpen ? 'Close chat assistant' : 'Open chat assistant'}
        >
          <i className={`${chatOpen ? 'fa-solid fa-xmark' : 'fa-regular fa-comment'} w-5 text-center text-[16px]`} aria-hidden="true" />
          <span className="hidden min-[480px]:inline">{chatOpen ? 'Close' : 'Ask IIAE'}</span>
        </button>
        <a href={`tel:+${HELPLINE_DIGITS}`} className={`${PILL} bg-[linear-gradient(145deg,#0a2d5c,#041f45)] text-white`} aria-label="Call admission helpline">
          <i className="fa-solid fa-phone w-5 text-center text-[16px]" aria-hidden="true" />
          <span className="hidden min-[480px]:inline">Call</span>
        </a>
        <a
          href={`https://wa.me/${HELPLINE_DIGITS}?text=${WHATSAPP_TEXT}`}
          target="_blank"
          rel="noreferrer"
          className={`${PILL} bg-[linear-gradient(145deg,#2adb67,#1da851)] text-white`}
          aria-label="Chat on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp inline-flex h-5 w-5 items-center justify-center text-[20px] leading-none" aria-hidden="true" />
          <span className="hidden min-[480px]:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
