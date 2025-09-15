'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  MapPin,
  Wallet2,
  Search,
  Sparkles,
  Ticket,
  SlidersHorizontal,
  Users,
  Calendar,
  X,
  FilterX,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('House Party');
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    'House Party',
    'Rooftop',
    'Amapiano',
    'Afrobeats',
    'Rave',
    'Secret Villa',
    'Brunch',
    'Sundowner',
  ];

  const events = [
    { id: 1, title: 'Secret Villa Night', date: 'Coming Soon', img: '/party1.jpg', price: 1500, area: 'Karen' },
    { id: 2, title: 'Amapiano Sundowner', date: 'Last Week', img: '/party2.jpg', price: 1200, area: 'Westlands' },
    { id: 3, title: 'Rooftop Rave', date: 'This Friday', img: '/party3.jpg', price: 1800, area: 'CBD' },
    { id: 4, title: 'Afrobeats Brunch', date: '2 Weeks Ago', img: '/party4.jpg', price: 1600, area: 'Lavington' },
  ];

  // --- filter state ---
  const [q, setQ] = useState('');
  const [date, setDate] = useState('any'); // any | today | this-weekend | next-7 | custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [area, setArea] = useState('any'); // any | Westlands | Karen | CBD | Lavington
  const [vibeTags, setVibeTags] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('any'); // any | day | night

  const tagOptions = ['Amapiano', 'Afrobeats', 'House', 'Rave', 'Rooftop', 'Brunch', 'Villa'];

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      if (q && !ev.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (area !== 'any' && ev.area !== area) return false;
      if (ev.price < minPrice || ev.price > maxPrice) return false;
      return true;
    });
  }, [events, q, area, minPrice, maxPrice]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (activeTab) params.set('type', activeTab);
    if (area !== 'any') params.set('area', area);
    if (date !== 'any') params.set('date', date);
    if (startDate && endDate) {
      params.set('start', startDate);
      params.set('end', endDate);
    }
    params.set('min', String(minPrice));
    params.set('max', String(maxPrice));
    if (timeOfDay !== 'any') params.set('time', timeOfDay);
    if (vibeTags.length) params.set('tags', vibeTags.join(','));
    router.push(`/events?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setQ('');
    setDate('any');
    setStartDate('');
    setEndDate('');
    setMinPrice(0);
    setMaxPrice(3000);
    setArea('any');
    setVibeTags([]);
    setTimeOfDay('any');
  };

  const toggleTag = (t) => {
    setVibeTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <section className="bg-white text-zinc-900">
      {/* Top chips: location + wallet */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 ring-1 ring-zinc-200 bg-white text-sm text-zinc-700 hover:bg-zinc-50 transition">
            <MapPin className="h-4 w-4" />
            Nairobi, KE
            <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
          <div className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-zinc-200 bg-white text-sm">
            <Wallet2 className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-700">KSh 0.00</span>
            <button className="ml-2 rounded-lg bg-zinc-900 text-white px-2 py-1 text-xs font-medium hover:opacity-90">
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* ---------- HERO IMAGE SLIDER (inside the hero section) ---------- */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <HeroSlider slides={events} />
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-2 min-w-max">
            {tabs.map((t) => {
              const active = t === activeTab;
              return (
                <li key={t}>
                  <button
                    onClick={() => setActiveTab(t)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                      active ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {t}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Popular near you */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">🔥 Popular near you</h2>
          <Link href="/events" className="text-sm text-zinc-600 hover:text-zinc-900">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="h-px w-full bg-zinc-200" />
      </div>

      {/* Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-base font-semibold">Filters</h3>
              <button aria-label="Close filters" onClick={() => setShowFilters(false)} className="rounded p-1 hover:bg-zinc-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto px-4 py-4">
              {/* Search in drawer */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Search</label>
                <div className="mt-1 flex items-center gap-2 rounded-lg ring-1 ring-zinc-200 px-3 py-2">
                  <Search className="h-4 w-4 text-zinc-500" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="DJ, venue, vibe" className="w-full bg-transparent outline-none text-sm" />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Date</label>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  {['any','today','this-weekend','next-7','custom'].map((d) => (
                    <button key={d} onClick={() => setDate(d)} className={`rounded-lg px-3 py-2 ring-1 ${date===d? 'ring-zinc-900 bg-zinc-900 text-white':'ring-zinc-200 hover:bg-zinc-50'}`}>{labelForDate(d)}</button>
                  ))}
                </div>
                {date === 'custom' && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="rounded-lg ring-1 ring-zinc-200 px-3 py-2 text-sm" />
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="rounded-lg ring-1 ring-zinc-200 px-3 py-2 text-sm" />
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Price (KSh)</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-lg ring-1 ring-zinc-200 px-3 py-2 text-sm">
                    Min
                    <input type="number" value={minPrice} onChange={(e)=>setMinPrice(Number(e.target.value||0))} className="mt-1 w-full bg-transparent outline-none" />
                  </div>
                  <div className="rounded-lg ring-1 ring-zinc-200 px-3 py-2 text-sm">
                    Max
                    <input type="number" value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value||0))} className="mt-1 w-full bg-transparent outline-none" />
                  </div>
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Area</label>
                <select value={area} onChange={(e)=>setArea(e.target.value)} className="mt-2 w-full rounded-lg ring-1 ring-zinc-200 px-3 py-2 text-sm bg-white">
                  {['any','Westlands','Karen','CBD','Lavington'].map((a)=> (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Time of day */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Time</label>
                <div className="mt-2 flex gap-2 text-sm">
                  {['any','day','night'].map((t)=> (
                    <button key={t} onClick={()=>setTimeOfDay(t)} className={`rounded-full px-3 py-1 ring-1 ${timeOfDay===t? 'ring-zinc-900 bg-zinc-900 text-white':'ring-zinc-200 hover:bg-zinc-50'}`}>{labelForTime(t)}</button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-zinc-700">Vibe tags</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tagOptions.map((t)=> (
                    <button key={t} onClick={()=>toggleTag(t)} className={`rounded-full px-3 py-1 text-sm ring-1 ${vibeTags.includes(t)? 'ring-zinc-900 bg-zinc-900 text-white':'ring-zinc-200 hover:bg-zinc-50'}`}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Active chips preview */}
              <div className="pt-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  {q && <Chip onClear={()=>setQ('')}>{q}</Chip>}
                  {area!=='any' && <Chip onClear={()=>setArea('any')}>{area}</Chip>}
                  {date!=='any' && <Chip onClear={()=>setDate('any')}>{labelForDate(date)}</Chip>}
                  {timeOfDay!=='any' && <Chip onClear={()=>setTimeOfDay('any')}>{labelForTime(timeOfDay)}</Chip>}
                  {vibeTags.map((t)=> <Chip key={t} onClear={()=>toggleTag(t)}>{t}</Chip>)}
                  {(minPrice>0 || maxPrice<3000) && <Chip onClear={()=>{setMinPrice(0);setMaxPrice(3000);}}>KSh {minPrice} – {maxPrice}</Chip>}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-2 flex items-center gap-2 border-top bg-white p-3">
              <button onClick={clearFilters} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-zinc-200 text-sm">
                <FilterX className="h-4 w-4" /> Clear
              </button>
              <button onClick={applyFilters} className="ml-auto rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">Apply filters</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Helpers ---------- */
function labelForDate(d) {
  switch (d) {
    case 'today': return 'Today';
    case 'this-weekend': return 'This Weekend';
    case 'next-7': return 'Next 7 Days';
    case 'custom': return 'Custom';
    default: return 'Any time';
  }
}
function labelForTime(t) {
  switch (t) {
    case 'day': return 'Daytime';
    case 'night': return 'Night';
    default: return 'Any';
  }
}

function Chip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 ring-1 ring-zinc-200 text-zinc-700">
      {children}
      {onClear && (
        <button onClick={onClear} aria-label="Remove" className="rounded p-0.5 hover:bg-zinc-200">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl py-3 px-2 ring-1 ring-zinc-200 bg-white text-center">
      {icon}
      <p className="text-lg font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function EventCard({ ev }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image src={ev.img} alt={ev.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-xs font-medium ring-1 ring-zinc-200">{ev.area}</div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-zinc-900 leading-snug line-clamp-2">{ev.title}</p>
          <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-700">KSh {ev.price}</span>
        </div>
        <p className="mt-0.5 text-sm text-zinc-500">{ev.date}</p>
        <div className="mt-3 flex items-center gap-2">
          <Link href={`/tickets/${ev.id}`} className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95">Get Tickets</Link>
          <button className="rounded-lg px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero Slider Component ---------- */
function HeroSlider({ slides }) {
  const [i, setI] = useState(0);

  // Auto-play (5s)
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const go = (next) => {
    setI((p) => (p + (next ? 1 : -1) + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-zinc-200">
      <div className="relative h-60 sm:h-72 md:h-80 w-full">
        {/* Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <div key={s.id ?? idx} className="relative h-full w-full flex-shrink-0">
              <Image src={s.img} alt={s.title} fill priority={idx === 0} className="object-cover" />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {/* Content */}
              <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-6xl px-4 text-white">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                      <Sparkles className="h-4 w-4" /> Featured
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {s.title}
                    </h2>
                    <p className="text-sm text-white/90">{s.date} • {s.area}</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Link
                      href={`/events/${s.id ?? ''}`}
                      className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white"
                    >
                      Explore
                    </Link>
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
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 w-2 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
