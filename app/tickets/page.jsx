"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Minus,
  Plus,
  Percent,
  ShieldCheck,
} from "lucide-react";

// ---------- Config ----------
const CURRENCY = "KES";
const SERVICE_FEE_RATE = 0.05;
const TAX_RATE = 0.16;

const TIERS = [
  {
    id: "ga",
    name: "General Admission",
    desc: "Early access, dance floor, no reserved seating.",
    price: 1500,
    perks: ["Entry", "Dance floor", "1 re-entry"],
  },
  {
    id: "vip",
    name: "VIP",
    desc: "Raised deck + fast lane + 1 complimentary drink.",
    price: 3000,
    perks: ["Fast lane", "Raised deck", "1 drink"],
  },
  {
    id: "vvip",
    name: "VVIP Table (4 pax)",
    desc: "Reserved table for 4 + bottle service + host.",
    price: 12000,
    perks: ["Bottle service", "Host support", "Reserved area"],
  },
];

// Hero slides (use local images in /public)
const HERO_SLIDES = [
  {
    src: "/party1.jpg",
    title: "Secret Villa Night",
    subtitle: "Sat, 27 Sep • Karen",
    href: "/events?type=villa",
  },
  {
    src: "/party2.jpg",
    title: "Amapiano Sundowner",
    subtitle: "This Friday • Westlands",
    href: "/events?type=amapiano",
  },
  {
    src: "/party3.jpg",
    title: "Rooftop Rave",
    subtitle: "Next Weekend • CBD",
    href: "/events?type=rooftop",
  },
];

// ---------- Page ----------
export default function TicketsPage() {
  const router = useRouter();

  // TODO: Replace with your real auth state
  const [isAuthenticated] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login?next=/tickets");
  }, [isAuthenticated, router]);

  const [quantities, setQuantities] = useState({ ga: 0, vip: 0, vvip: 0 });
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discountRate } | null
  const [payMethod, setPayMethod] = useState("mpesa");

  const steps = ["Select", "Details", "Pay"]; // visual only

  // Totals
  const subtotal = useMemo(
    () => TIERS.reduce((sum, t) => sum + t.price * (quantities[t.id] || 0), 0),
    [quantities]
  );
  const promoDiscount = useMemo(
    () => (!appliedPromo ? 0 : Math.round(subtotal * appliedPromo.discountRate)),
    [appliedPromo, subtotal]
  );
  const serviceFee = useMemo(
    () => Math.round((subtotal - promoDiscount) * SERVICE_FEE_RATE),
    [subtotal, promoDiscount]
  );
  const taxable = Math.max(0, subtotal - promoDiscount + serviceFee);
  const tax = useMemo(() => Math.round(taxable * TAX_RATE), [taxable]);
  const total = Math.max(0, taxable + tax);

  const anySelected = TIERS.some((t) => (quantities[t.id] || 0) > 0);

  const handleAdjust = (id, delta) =>
    setQuantities((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + delta) }));

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    const known = { DUNDA10: 0.1, EARLYBIRD: 0.2 };
    if (known[code]) setAppliedPromo({ code, discountRate: known[code] });
    else {
      setAppliedPromo(null);
      alert("Promo code not valid");
    }
  };

  const quickPick = (id, qty) => setQuantities((q) => ({ ...q, [id]: qty }));

  const checkout = () => {
    if (total <= 0) {
      alert("Please select at least one ticket.");
      return;
    }
    const order = {
      items: TIERS.filter((t) => (quantities[t.id] || 0) > 0).map((t) => ({
        id: t.id,
        qty: quantities[t.id],
        price: t.price,
      })),
      subtotal,
      promo: appliedPromo,
      serviceFee,
      tax,
      total,
      payMethod,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("pendingOrder", JSON.stringify(order));
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Top bar with breadcrumb + stepper */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li aria-hidden>›</li>
              <li>
                <a href="/events" className="hover:underline">
                  Events
                </a>
              </li>
              <li aria-hidden>›</li>
              <li aria-current="page" className="font-medium text-gray-900">
                Tickets
              </li>
            </ol>
          </nav>
          <ol className="hidden items-center gap-2 sm:flex" aria-label="Checkout steps">
            {steps.map((s, i) => (
              <li
                key={s}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  i === 0 ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}. {s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Hero with slides */}
      <HeroSlider />

      {/* Sub-nav for quick jumps */}
      <div className="sticky top-12 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 text-sm">
          <a href="#ga" className="rounded-full border border-gray-300 px-3 py-1 hover:border-black">
            General Admission
          </a>
          <a href="#vip" className="rounded-full border border-gray-300 px-3 py-1 hover:border-black">
            VIP
          </a>
          <a href="#vvip" className="rounded-full border border-gray-300 px-3 py-1 hover:border-black">
            VVIP
          </a>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/account/tickets"
              className="rounded-full bg-gray-900 px-3 py-1 font-medium text-white hover:bg-black"
            >
              My Tickets
            </a>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <main className="mx-auto -mt-12 max-w-6xl gap-6 px-4 pb-28 sm:grid sm:grid-cols-3">
        {/* Tickets */}
        <div className="space-y-4 sm:col-span-2">
          {/* Quick picks */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-gray-800">Quick Picks:</span>
              <button
                onClick={() => quickPick("ga", 1)}
                className="rounded-full border px-3 py-1 hover:border-black"
              >
                1 × GA
              </button>
              <button
                onClick={() => quickPick("vip", 2)}
                className="rounded-full border px-3 py-1 hover:border-black"
              >
                2 × VIP
              </button>
              <button
                onClick={() => quickPick("vvip", 1)}
                className="rounded-full border px-3 py-1 hover:border-black"
              >
                1 × VVIP Table
              </button>
              {anySelected && (
                <button
                  onClick={() => setQuantities({ ga: 0, vip: 0, vvip: 0 })}
                  className="ml-auto rounded-full border px-3 py-1 text-gray-600 hover:border-black"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {TIERS.map((t) => (
            <div
              id={t.id}
              key={t.id}
              className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {t.id.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{t.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                    {t.perks.map((p) => (
                      <li key={p} className="rounded-full bg-gray-100 px-2 py-1">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a href="#top" className="sr-only">
                    Back to top
                  </a>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-2xl font-bold">KES {t.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">incl. base price</div>
                  </div>
                  <div
                    className="flex items-center rounded-full border border-gray-200"
                    role="group"
                    aria-label={`${t.name} quantity`}
                  >
                    <button
                      onClick={() => handleAdjust(t.id, -1)}
                      className="p-2 hover:bg-gray-50"
                      aria-label={`decrease ${t.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium" aria-live="polite">
                      {quantities[t.id] || 0}
                    </span>
                    <button
                      onClick={() => handleAdjust(t.id, 1)}
                      className="p-2 hover:bg-gray-50"
                      aria-label={`increase ${t.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Promo */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">Have a promo code?</span>
              </div>
              <div className="flex w-full flex-1 items-center gap-2 sm:w-auto">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter code (e.g., DUNDA10)"
                  className="h-10 w-full flex-1 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-black sm:w-64"
                />
                <button
                  onClick={applyPromo}
                  className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="w-full text-sm text-green-600">
                  Applied <b>{appliedPromo.code}</b> −{Math.round(appliedPromo.discountRate * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="mt-6 space-y-4 sm:mt-0">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="text-base font-semibold">Order Summary</h4>
            <div className="mt-4 space-y-2 text-sm">
              {!anySelected ? (
                <div className="text-gray-500">No tickets selected yet.</div>
              ) : (
                TIERS.filter((t) => (quantities[t.id] || 0) > 0).map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span>
                      {t.name} × {quantities[t.id]}
                    </span>
                    <span>KES {(t.price * quantities[t.id]).toLocaleString()}</span>
                  </div>
                ))
              )}

              <hr className="my-3" />

              <Row label="Subtotal" value={subtotal} />
              {promoDiscount > 0 && <Row label="Promo" value={-promoDiscount} />}
              <Row label="Service fee" value={serviceFee} />
              <Row label={`VAT ${Math.round(TAX_RATE * 100)}%`} value={tax} />

              <div className="mt-3 flex items-center justify-between text-base font-bold">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">Payment method</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "mpesa", label: "M-Pesa" },
                  { id: "card", label: "Card" },
                  { id: "paypal", label: "PayPal" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      payMethod === m.id
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-black"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={checkout}
              className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-black/90"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4" /> Secure checkout • Encrypted payments
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700">
            <h4 className="mb-2 font-semibold">Need to know</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>No re-entry after 1:00 AM unless VIP/VVIP.</li>
              <li>Valid ID required. Tickets are non-refundable.</li>
              <li>Management reserves the right of admission.</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="text-sm">
            <div className="font-semibold">Total</div>
            <div className="-mt-0.5 text-gray-700">KES {total.toLocaleString()}</div>
          </div>
          <button
            onClick={checkout}
            disabled={!anySelected}
            className={`flex-1 rounded-lg px-4 py-3 text-center text-sm font-semibold text-white ${
              anySelected ? "bg-black" : "bg-gray-400"
            }`}
          >
            {anySelected ? "Checkout" : "Select tickets"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Helpers ----------
function Row({ label, value }) {
  const sign = value < 0 ? "-" : "";
  const absVal = Math.abs(value).toLocaleString();
  return (
    <div className="flex items-center justify-between text-sm text-gray-700">
      <span>{label}</span>
      <span>
        {sign}KES {absVal}
      </span>
    </div>
  );
}

// ---------- Hero Slider ----------
function HeroSlider() {
  const [i, setI] = useState(0);

  // Auto-advance every 5s
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const go = (next) => {
    setI((p) => (p + (next ? 1 : -1) + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative" id="top">
      <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden">
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {HERO_SLIDES.map((s, idx) => (
            <div key={idx} className="relative h-full w-full flex-shrink-0">
              <Image src={s.src} alt={s.title} fill priority={idx === 0} className="object-cover" />
              {/* Gradient + text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-6xl px-4 text-white">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                      Featured
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {s.title}
                    </h2>
                    <p className="text-sm text-white/90">{s.subtitle}</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <a
                      href={s.href}
                      className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white"
                    >
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          aria-label="Previous slide"
          onClick={() => go(false)}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          onClick={() => go(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 w-2 rounded-full transition ${
                i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
