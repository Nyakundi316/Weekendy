'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  SunMedium,
  Info,
  QrCode,
  Ticket,
  MapPin,
} from 'lucide-react';

/**
 * Where do we get the ticket?
 * - Prefers localStorage 'userTicket' (e.g. set after checkout)
 *   {
 *     code: "OP-ABC123-0001",
 *     title: "Dunda Night • Volume 6",
 *     venue: "Ngong Racecourse, Nairobi",
 *     holder: "Your Name",
 *     price: 1500
 *   }
 * - Falls back to query params (?code=...&title=...&venue=...)
 * - Ultimately falls back to a demo code
 */

export default function PresentTicketPage() {
  const sp = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [bright, setBright] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const imgRef = useRef(null);

  // 1) Try localStorage
  const stored = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      // Your code could save a normalized ticket after purchase:
      // localStorage.setItem('userTicket', JSON.stringify({...}))
      return JSON.parse(localStorage.getItem('userTicket') || 'null')
        || JSON.parse(localStorage.getItem('pendingOrder') || 'null'); // lenient fallback
    } catch {
      return null;
    }
  }, []);

  // 2) Fall back to query params
  const codeFromQuery = sp.get('code') || '';
  const titleFromQuery = sp.get('title') || '';
  const venueFromQuery = sp.get('venue') || '';

  // 3) Build our ticket object
  const ticket = useMemo(() => {
    if (stored?.code) {
      return {
        code: stored.code,
        title: stored.title || 'Your Event',
        venue: stored.venue || 'Nairobi',
        holder: stored.holder || 'Ticket Holder',
        price: stored.price || undefined,
      };
    }
    if (codeFromQuery) {
      return {
        code: codeFromQuery,
        title: titleFromQuery || 'Your Event',
        venue: venueFromQuery || 'Nairobi',
        holder: 'Ticket Holder',
      };
    }
    // Final fallback demo
    return {
      code: 'OP-DEMO-123456',
      title: 'Only Parties • Demo Event',
      venue: 'Nairobi',
      holder: 'Ticket Holder',
    };
  }, [stored, codeFromQuery, titleFromQuery, venueFromQuery]);

  // Build a QR image URL using a free, zero-config service.
  // We purposely use a plain <img> (NOT next/image) to avoid domain config for remote images.
  const [nonce, setNonce] = useState(Date.now()); // bust caching when refreshing
  const qrUrl = useMemo(() => {
    const data = encodeURIComponent(ticket.code);
    return `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${data}&t=${nonce}`;
  }, [ticket.code, nonce]);

  // Copy code UX
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(ticket.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  };

  // Download PNG (draw the <img> to a canvas to ensure we always download)
  const downloadPng = async () => {
    try {
      const img = imgRef.current;
      if (!img) return;
      const cnv = document.createElement('canvas');
      cnv.width = img.naturalWidth || 600;
      cnv.height = img.naturalHeight || 600;
      const ctx = cnv.getContext('2d');
      // fill white for nice passbook look
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cnv.width, cnv.height);
      ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

      const link = document.createElement('a');
      link.download = `${ticket.code}.png`;
      link.href = cnv.toDataURL('image/png');
      link.click();
    } catch {
      // fallback: just open QR URL
      window.open(qrUrl, '_blank');
    }
  };

  // Fullscreen helpers
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  const enterFs = async () => {
    const el = document.getElementById('qr-presenter');
    if (el?.requestFullscreen) await el.requestFullscreen();
  };
  const exitFs = async () => {
    if (document.exitFullscreen) await document.exitFullscreen();
  };

  return (
    <div className={`min-h-screen ${bright ? 'bg-white' : 'bg-white'} text-zinc-900`}>
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">My Ticket</h1>
            <p className="text-sm text-zinc-600">Show this code at the entrance — staff will scan it.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNonce(Date.now())}
              className="rounded-lg px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50"
              title="Refresh QR (new cache-bust)"
            >
              Refresh
            </button>
            <button
              onClick={() => setBright((b) => !b)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50"
              title="Increase screen brightness"
            >
              <SunMedium className="h-4 w-4" /> {bright ? 'Normal' : 'Bright'}
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="mx-auto max-w-4xl px-4 pb-28">
        <div
          id="qr-presenter"
          className={`mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm`}
        >
          <div className="p-4 sm:p-6">
            {/* Event meta */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs ring-1 ring-zinc-200">
                <Ticket className="h-3.5 w-3.5" />
                Ticket
              </span>
              <div className="text-sm text-zinc-600 inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {ticket.venue}
              </div>
            </div>

            <h2 className="mt-2 text-xl sm:text-2xl font-bold leading-snug">{ticket.title}</h2>
            {ticket.holder && (
              <p className="text-sm text-zinc-600">Holder: <span className="font-medium text-zinc-900">{ticket.holder}</span></p>
            )}
          </div>

          {/* QR block */}
          <div className="grid place-items-center px-4 pb-6">
            <div className={`relative ${fullscreen ? 'w-full' : 'w-[82vw] max-w-[420px]'} aspect-square`}>
              {/* We use a plain <img> for remote QR to avoid next/image domain config */}
              <img
                ref={imgRef}
                src={qrUrl}
                alt="Your ticket QR"
                className="h-full w-full rounded-xl border border-zinc-200 bg-white object-contain"
                crossOrigin="anonymous"
              />
              {/* Action buttons overlay (top-right) */}
              <div className="absolute right-1 top-1 flex gap-1">
                {!fullscreen ? (
                  <button
                    onClick={enterFs}
                    className="rounded-md bg-white/90 p-2 ring-1 ring-zinc-200 hover:bg-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={exitFs}
                    className="rounded-md bg-white/90 p-2 ring-1 ring-zinc-200 hover:bg-white"
                    title="Exit fullscreen"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Code + actions */}
            <div className="mt-4 w-full max-w-[520px]">
              <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-2 ring-1 ring-zinc-200">
                <code className="truncate px-2 text-sm font-medium">{ticket.code}</code>
                <div className="flex items-center gap-1">
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-zinc-200 hover:bg-white"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadPng}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-zinc-200 hover:bg-white"
                  >
                    <Download className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs ring-1 ring-amber-200">
                <Info className="mt-0.5 h-4 w-4 text-amber-700" />
                <p className="text-amber-800">
                  Keep the QR large and steady. Turn your screen brightness up. If scanning fails, the door team can type your code manually.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet row */}
          <div className="border-t p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => window.print()}
                className="rounded-lg px-3 py-2 text-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
              >
                Print ticket
              </button>
              <a
                href={`data:text/calendar;charset=utf-8,${encodeURIComponent(buildICS(ticket))}`}
                download={`${ticket.title.replace(/\s+/g,'_')}.ics`}
                className="rounded-lg px-3 py-2 text-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
              >
                Add reminder (.ics)
              </a>
              <a
                href={qrUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-3 py-2 text-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
              >
                Open QR in new tab
              </a>
            </div>
          </div>
        </div>

        {/* Secondary: How it works */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <How icon={<QrCode className="h-5 w-5" />} title="1. Open your ticket">
            Come to this page from your order email or the app’s “My tickets”.
          </How>
          <How icon={<SunMedium className="h-5 w-5" />} title="2. Max brightness">
            Tap Bright → “Bright” so scanners read the code fast.
          </How>
          <How icon={<Ticket className="h-5 w-5" />} title="3. Show at entrance">
            Staff will scan it. Keep the code visible until you’re admitted.
          </How>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          Lost your ticket? Contact support with your <b>code</b> and purchase email.
        </p>
      </div>
    </div>
  );
}

/* Helpers */

function How({ icon, title, children }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 rounded-md bg-zinc-100 p-1.5 text-zinc-600">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-zinc-600">{children}</p>
        </div>
      </div>
    </div>
  );
}

// Barebones .ics builder (reminder only; no time since events can be "coming soon")
function buildICS(ticket) {
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${ticket.code}@onlyparties`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OnlyParties//Ticket//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `SUMMARY:${escapeICS(ticket.title)} (Ticket)`,
    `DESCRIPTION:Ticket code: ${ticket.code}\\nVenue: ${ticket.venue}`,
    `LOCATION:${escapeICS(ticket.venue)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
function escapeICS(s='') {
  return String(s).replace(/([,;])/g, '\\$1');
}
