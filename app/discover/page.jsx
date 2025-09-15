'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Ticket,
  Calendar,
  FilterX,
  ChevronDown,
  Share2,
  Star,
  Users,
  Heart,
  Flag,
  Layers,
} from 'lucide-react';

/* ------------------------------------------------
   MOCK EVENTS (all "Coming soon" – no real dates)
   Tip: swap with your API data later.
------------------------------------------------- */
const MOCK_EVENTS = [
  { id: 1,  title: 'Secret Villa Night',   when: 'Coming soon', img: '/party1.jpg', area: 'Karen',     city: 'Nairobi',  type: 'Secret Villa', tags: ['House','Villa'],     price: 1500, lat: -1.327, lng: 36.720, rating: 4.7, reviews: 128, ticketsLeft: 22, capacity: 180, friends: 6, isNew: true,  promoter: 'Only Parties' },
  { id: 2,  title: 'Amapiano Sundowner',   when: 'Coming soon', img: '/party2.jpg', area: 'Westlands', city: 'Nairobi',  type: 'Amapiano',     tags: ['Amapiano','Rooftop'], price: 1200, lat: -1.268, lng: 36.811, rating: 4.6, reviews: 96,  ticketsLeft: 14, capacity: 150, friends: 3, isNew: false, promoter: 'Only Parties' },
  { id: 3,  title: 'Rooftop Rave',         when: 'Coming soon', img: '/party3.jpg', area: 'CBD',       city: 'Nairobi',  type: 'Rooftop',      tags: ['Rave','Rooftop'],     price: 1800, lat: -1.283, lng: 36.823, rating: 4.8, reviews: 210, ticketsLeft: 9,  capacity: 120, friends: 1, isNew: false, promoter: 'Skyline' },
  { id: 4,  title: 'Afrobeats Brunch',     when: 'Coming soon', img: '/party4.jpg', area: 'Lavington',  city: 'Nairobi',  type: 'Brunch',       tags: ['Afrobeats','Brunch'],price: 1600, lat: -1.288, lng: 36.768, rating: 4.5, reviews: 75,  ticketsLeft: 55, capacity: 220, friends: 2, isNew: true,  promoter: 'Flavor' },
  { id: 5,  title: 'Sundowner House Set',  when: 'Coming soon', img: '/party2.jpg', area: 'Westlands', city: 'Nairobi',  type: 'Sundowner',    tags: ['House'],             price: 1400, lat: -1.268, lng: 36.811, rating: 4.4, reviews: 61,  ticketsLeft: 18, capacity: 140, friends: 0, isNew: false, promoter: 'Only Parties' },
  { id: 6,  title: 'Warehouse Rave',       when: 'Coming soon', img: '/party3.jpg', area: 'Industrial',city: 'Nairobi',  type: 'Rave',         tags: ['Rave'],              price: 2000, lat: -1.317, lng: 36.851, rating: 4.6, reviews: 133, ticketsLeft: 5,  capacity: 200, friends: 4, isNew: false, promoter: 'Underground' },
  { id: 7,  title: 'Villa Pool Party',     when: 'Coming soon', img: '/party1.jpg', area: 'Karen',     city: 'Nairobi',  type: 'House Party',  tags: ['House','Villa'],     price: 1700, lat: -1.327, lng: 36.720, rating: 4.9, reviews: 58,  ticketsLeft: 27, capacity: 160, friends: 7, isNew: true,  promoter: 'Only Parties' },
  { id: 8,  title: 'Afrobeats Night Live', when: 'Coming soon', img: '/party4.jpg', area: 'Lavington',  city: 'Nairobi',  type: 'Afrobeats',    tags: ['Afrobeats'],         price: 1900, lat: -1.288, lng: 36.768, rating: 4.3, reviews: 44,  ticketsLeft: 33, capacity: 190, friends: 2, isNew: false, promoter: 'Flavor' },
  { id: 9,  title: 'Amapiano Under Stars', when: 'Coming soon', img: '/party2.jpg', area: 'Westlands', city: 'Nairobi',  type: 'Amapiano',     tags: ['Amapiano'],          price: 1500, lat: -1.268, lng: 36.811, rating: 4.5, reviews: 83,  ticketsLeft: 40, capacity: 210, friends: 0, isNew: true,  promoter: 'Only Parties' },
  { id: 10, title: 'Rooftop Sunset Brunch',when: 'Coming soon', img: '/party3.jpg', area: 'CBD',       city: 'Nairobi',  type: 'Rooftop',      tags: ['Brunch','Rooftop'],  price: 1800, lat: -1.283, lng: 36.823, rating: 4.6, reviews: 92,  ticketsLeft: 20, capacity: 180, friends: 1, isNew: false, promoter: 'Skyline' },
];

/* ------------------------------------------------
   PAGE
------------------------------------------------- */
export default function DiscoverPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // initial params
  const initial = {
    q: sp.get('q') || '',
    type: sp.get('type') || 'All',
    area: sp.get('area') || 'any',
    city: sp.get('city') || 'Nairobi',
    date: 'any', // locked because we show "Coming soon"
    start: '',
    end: '',
    min: Number(sp.get('min') || 0),
    max: Number(sp.get('max') || 3000),
    time: 'any',
    tags: sp.get('tags') ? sp.get('tags').split(',') : [],
    sort: sp.get('sort') || 'recommended',
  };

  // UI state
  const [q, setQ] = useState(initial.q);
  const [activeTab, setActiveTab] = useState(initial.type);
  const [area, setArea] = useState(initial.area);
  const [city, setCity] = useState(initial.city);
  const [minPrice, setMinPrice] = useState(initial.min);
  const [maxPrice, setMaxPrice] = useState(initial.max);
  const [tags, setTags] = useState(initial.tags);
  const [sort, setSort] = useState(initial.sort);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'map'
  const [loading, setLoading] = useState(true); // for skeletons
  const [quick, setQuick] = useState(null); // quick-view modal
  const [pollOpen, setPollOpen] = useState(false);
  const [following, setFollowing] = useState({}); // promoter follow state
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  // Preload: simulate fetch delay for skeletons
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // tabs/collections
  const tabs = ['All','House Party','Rooftop','Amapiano','Afrobeats','Rave','Secret Villa','Brunch','Sundowner'];
  const collections = [
    { id: 'trending', label: 'Trending now',          filter: (e) => e.reviews > 80 },
    { id: 'under-1500', label: 'Under KSh 1,500',     filter: (e) => e.price <= 1500 },
    { id: 'selling-fast', label: 'Selling fast',      filter: (e) => fillRate(e) >= 0.8 },
    { id: 'rooftops', label: 'Rooftop sunsets',       filter: (e) => e.tags?.includes('Rooftop') },
  ];
  const tagOptions = ['Amapiano','Afrobeats','House','Rave','Rooftop','Brunch','Villa'];

  // helpers
  const pushParams = (extra = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (activeTab && activeTab !== 'All') params.set('type', activeTab);
    if (city && city !== 'Nairobi') params.set('city', city);
    if (area !== 'any') params.set('area', area);
    if (minPrice > 0) params.set('min', String(minPrice));
    if (maxPrice < 3000) params.set('max', String(maxPrice));
    if (tags.length) params.set('tags', tags.join(','));
    if (sort && sort !== 'recommended') params.set('sort', sort);
    Object.entries(extra).forEach(([k,v]) => v ? params.set(k, v) : null);
    router.push(`/discover?${params.toString()}`);
  };

  // filtering
  const filtered = useMemo(() => {
    let list = MOCK_EVENTS.filter(e => e.city === city);

    if (activeTab && activeTab !== 'All') {
      list = list.filter(e => e.type.toLowerCase() === activeTab.toLowerCase());
    }
    if (q) list = list.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));
    if (area !== 'any') list = list.filter(e => e.area === area);
    if (tags.length) list = list.filter(e => tags.every(t => e.tags?.includes(t)));

    list = list.filter(e => e.price >= minPrice && e.price <= (maxPrice || 999999));

    if (sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
    else if (sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
    else if (sort === 'rating-desc') list.sort((a,b)=>b.rating-a.rating);
    else if (sort === 'reviews-desc') list.sort((a,b)=>b.reviews-a.reviews);
    // recommended = seed order

    return list;
  }, [activeTab, q, area, tags, minPrice, maxPrice, sort, city]);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;
  useEffect(() => setPage(1), [activeTab, q, area, tags, minPrice, maxPrice, sort, city]);
  const visible = filtered.slice(0, page * pageSize);
  const hasMore = visible.length < filtered.length;

  // localStorage: saved searches, recently viewed, alerts
  const saveSearch = () => {
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const name = params.q || activeTab || 'My filter';
    saved.unshift({ name, params, ts: Date.now() });
    localStorage.setItem('savedSearches', JSON.stringify(saved.slice(0, 10)));
    alert('Search saved ✅');
  };
  const shareLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard 🔗');
    } catch {
      alert(url);
    }
  };
  const addRecent = (ev) => {
    const rec = JSON.parse(localStorage.getItem('recentEvents') || '[]');
    const exists = rec.find(r => r.id === ev.id);
    const next = exists ? [ev, ...rec.filter(r=>r.id!==ev.id)] : [ev, ...rec];
    localStorage.setItem('recentEvents', JSON.stringify(next.slice(0, 12)));
  };
  const recent = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('recentEvents') || '[]')
    : [];

  // recommended simple heuristic (same promoter or shared tags)
  const recommended = useMemo(() => {
    if (!recent.length) return MOCK_EVENTS.slice(0, 8);
    const last = recent[0];
    return MOCK_EVENTS
      .filter(e => e.id !== last.id && (e.promoter === last.promoter || e.tags?.some(t => last.tags?.includes(t))))
      .slice(0, 8);
  }, [recent]);

  // follow promoters
  const toggleFollow = (promoter) =>
    setFollowing(prev => ({ ...prev, [promoter]: !prev[promoter] }));

  const toggleAlerts = () => {
    const next = !alertsEnabled;
    setAlertsEnabled(next);
    localStorage.setItem('discoverAlerts', JSON.stringify({ enabled: next, ts: Date.now() }));
  };
  useEffect(() => {
    const a = JSON.parse(localStorage.getItem('discoverAlerts') || 'null');
    if (a?.enabled) setAlertsEnabled(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* SEO JSON-LD (no dates provided) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Discover Events",
            "hasPart": MOCK_EVENTS.slice(0, 8).map(e => ({
              "@type": "Event",
              "name": e.title,
              "location": { "@type": "Place", "name": `${e.area}, ${e.city}` },
              "image": e.img,
              "offers": { "@type": "Offer", "price": e.price, "priceCurrency": "KES", "availability": "https://schema.org/InStock" }
            })),
          }),
        }}
      />

      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Discover</h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs ring-1 ring-zinc-200">
            All events: <b>Coming soon</b>
          </span>
        </div>
        <p className="text-sm text-zinc-600">Explore rooftops, villas, raves, and brunch sessions without date pressure — everything’s coming soon.</p>
      </div>

      {/* Sticky search/filters bar */}
      <div className="sticky top-0 z-40 border-y bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <form
            onSubmit={(e)=>{e.preventDefault(); setPage(1); pushParams();}}
            className="flex flex-1 items-center gap-2 rounded-full bg-white ring-1 ring-zinc-200 px-4 py-3 shadow-sm"
          >
            <Search className="h-5 w-5 text-zinc-500" />
            <input
              value={q} onChange={(e)=>setQ(e.target.value)}
              placeholder="Search team, performer or venue"
              className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-400"
            />
            <button type="button" onClick={shareLink} className="rounded-full px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50">
              <Share2 className="inline h-4 w-4 mr-1" /> Copy link
            </button>
            <button type="submit" className="rounded-full bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-95">
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <CitySelect value={city} onChange={(v)=>{setCity(v); pushParams({ city: v });}} />
            <SortSelect value={sort} onChange={(v)=>{setSort(v); setPage(1); pushParams({ sort: v });}} />
            <button
              onClick={()=>setShowFilters(true)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium ring-1 ring-zinc-200 bg-white hover:bg-zinc-50"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button
              onClick={() => setView(v => v === 'grid' ? 'map' : 'grid')}
              className="rounded-full px-4 py-3 text-sm ring-1 ring-zinc-200 bg-white hover:bg-zinc-50"
            >
              {view === 'grid' ? 'Map view' : 'Grid view'}
            </button>
          </div>
        </div>

        {/* Tabs / Collections */}
        <div className="mx-auto max-w-6xl px-4 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {tabs.map((t) => {
              const active = t === activeTab;
              return (
                <button
                  key={t}
                  onClick={()=>{ setActiveTab(t); setPage(1); pushParams({ type: t === 'All' ? '' : t }); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${active ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                >
                  {t}
                </button>
              );
            })}
            <span className="mx-2 h-5 w-px bg-zinc-200" />
            {collections.map(c => (
              <button
                key={c.id}
                onClick={()=>{
                  setActiveTab('All'); setTags([]); setArea('any'); setMinPrice(0); setMaxPrice(3000);
                  setSort('recommended');
                  setPage(1);
                  // quick filter by collection (client-only)
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50"
                title="Collection"
              >
                <Layers className="h-3.5 w-3.5" /> {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results header row */}
      <div className="mx-auto max-w-6xl px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-600">
            {loading ? 'Loading events…' : <>Showing <b>{visible.length}</b> of {filtered.length} events</>}
          </p>
          <button onClick={saveSearch} className="rounded-full border px-3 py-1 text-sm hover:border-black">Save search</button>
          <label className="ml-1 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={alertsEnabled} onChange={toggleAlerts} />
            Alerts
          </label>
        </div>

        {(q || area!=='any' || tags.length || minPrice>0 || maxPrice<3000 || activeTab!=='All' || city!=='Nairobi' || sort!=='recommended') && (
          <button onClick={()=>{
            setQ(''); setActiveTab('All'); setArea('any'); setCity('Nairobi');
            setMinPrice(0); setMaxPrice(3000); setTags([]); setSort('recommended'); setPage(1);
            router.push('/discover');
          }} className="text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-2">
            Clear all
          </button>
        )}
      </div>

      {/* View switch */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        {view === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <EventSkeleton key={i} />)
              : visible.map((ev)=> (
                  <EventCard
                    key={ev.id}
                    ev={ev}
                    onQuick={() => { setQuick(ev); addRecent(ev); }}
                    onFollow={() => toggleFollow(ev.promoter)}
                    followed={!!following[ev.promoter]}
                  />
                ))
            }
          </div>
        ) : (
          <div className="h-[60vh] w-full rounded-2xl border border-zinc-200 bg-[url('/map-placeholder.png')] bg-cover bg-center flex items-center justify-center text-zinc-600 text-sm">
            Map coming soon — pins will reflect current filters
          </div>
        )}
      </div>

      {/* Load more */}
      {view === 'grid' && (
        <div className="mx-auto max-w-6xl px-4 pb-12">
          {!loading && (hasMore ? (
            <button onClick={()=>setPage(p=>p+1)} className="w-full rounded-xl bg-zinc-100 hover:bg-zinc-200 py-3 font-medium">
              Load more
            </button>
          ) : (
            <div className="text-center text-sm text-zinc-500">You’ve reached the end ✨</div>
          ))}
        </div>
      )}

      {/* Recommended row */}
      <Section title="Recommended for you" subtitle="Based on what you viewed recently">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recommended.map(ev => (
            <EventCard
              key={`rec-${ev.id}`}
              ev={ev}
              onQuick={() => { setQuick(ev); addRecent(ev); }}
              onFollow={() => toggleFollow(ev.promoter)}
              followed={!!following[ev.promoter]}
            />
          ))}
        </div>
      </Section>

      {/* Recently viewed row */}
      {recent.length > 0 && (
        <Section title="Recently viewed" subtitle="Pick up where you left off">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recent.slice(0,8).map(ev => (
              <EventCard
                key={`recent-${ev.id}`}
                ev={ev}
                onQuick={() => setQuick(ev)}
                onFollow={() => toggleFollow(ev.promoter)}
                followed={!!following[ev.promoter]}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Filters Drawer */}
      {showFilters && (
        <FiltersDrawer
          state={{
            q, setQ, area, setArea,
            minPrice, setMinPrice, maxPrice, setMaxPrice,
            tags, setTags, tagOptions
          }}
          onClose={()=>setShowFilters(false)}
          onClear={()=>{
            setQ(''); setArea('any'); setMinPrice(0); setMaxPrice(3000); setTags([]);
          }}
          onApply={()=>{ setPage(1); pushParams(); setShowFilters(false); }}
        />
      )}

      {/* Quick view modal */}
      {quick && <QuickView ev={quick} onClose={()=>setQuick(null)} />}

      {/* Group planning modal (simple stub) */}
      {pollOpen && <GroupPoll onClose={()=>setPollOpen(false)} />}
    </div>
  );
}

/* ------------------------------------------------
   UI COMPONENTS
------------------------------------------------- */

function CitySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const cities = ['Nairobi','Mombasa','Kisumu'];
  const current = value || cities[0];
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm ring-1 ring-zinc-200 bg-white hover:bg-zinc-50">
        {current} <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border bg-white shadow-md">
          {cities.map(c=>(
            <button key={c} onClick={()=>{ onChange(c); setOpen(false); }} className={`block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${current===c ? 'bg-zinc-50 font-medium' : ''}`}>
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const items = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'rating-desc', label: 'Rating (High → Low)' },
    { id: 'reviews-desc', label: 'Reviews (Most → Fewest)' },
    { id: 'price-asc',   label: 'Price (Low → High)' },
    { id: 'price-desc',  label: 'Price (High → Low)' },
  ];
  const current = items.find(i=>i.id===value) || items[0];

  return (
    <div className="relative">
      <button
        onClick={()=>setOpen(o=>!o)}
        className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm ring-1 ring-zinc-200 bg-white hover:bg-zinc-50"
      >
        {current.label} <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-md">
          {items.map(it=>(
            <button
              key={it.id}
              onClick={()=>{ onChange(it.id); setOpen(false); }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${value===it.id ? 'bg-zinc-50 font-medium' : ''}`}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function EventCard({ ev, onQuick, onFollow, followed }) {
  const sellingFast = fillRate(ev) >= 0.8;
  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image src={ev.img} alt={ev.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <div className="absolute left-2 top-2 flex gap-2">
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-xs font-medium ring-1 ring-zinc-200">{ev.area}</span>
          {ev.isNew && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">New</span>}
          {sellingFast && <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-medium text-white">Selling fast</span>}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-zinc-900 leading-snug line-clamp-2">{ev.title}</p>
          <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-700">KSh {ev.price}</span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">{ev.when} • {ev.city}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {ev.rating} <span className="text-zinc-400">({ev.reviews})</span></span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {ev.friends} friends</span>
          <span className="inline-flex items-center gap-1"><Ticket className="h-3.5 w-3.5" /> {ev.ticketsLeft} left</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link prefetch href={`/tickets/${ev.id}`} className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95">
            Get Tickets
          </Link>
          <button onClick={onQuick} className="rounded-lg px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50">Quick view</button>
          <button onClick={onFollow} className={`rounded-lg px-3 py-1.5 text-xs ring-1 ${followed ? 'ring-zinc-900 bg-zinc-900 text-white' : 'ring-zinc-200 hover:bg-zinc-50'}`}>
            {followed ? 'Following' : `Follow ${ev.promoter}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white">
      <div className="h-40 w-full bg-zinc-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-zinc-200 rounded" />
        <div className="h-3 w-1/2 bg-zinc-200 rounded" />
        <div className="h-8 w-24 bg-zinc-200 rounded" />
      </div>
    </div>
  );
}

function FiltersDrawer({ state, onClose, onClear, onApply }) {
  const { q, setQ, area, setArea, minPrice, setMinPrice, maxPrice, setMaxPrice, tags, setTags, tagOptions } = state;
  const toggleTag = (t) => setTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">Filters</h3>
          <button aria-label="Close filters" onClick={onClose} className="rounded p-1 hover:bg-zinc-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-4 py-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium text-zinc-700">Search</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg ring-1 ring-zinc-200 px-3 py-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="DJ, venue, vibe" className="w-full bg-transparent outline-none text-sm" />
            </div>
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
              {['any','Westlands','Karen','CBD','Lavington','Industrial'].map((a)=>(
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-zinc-700">Vibe tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tagOptions.map((t)=>(
                <button key={t} onClick={()=>toggleTag(t)} className={`rounded-full px-3 py-1 text-sm ring-1 ${tags.includes(t)? 'ring-zinc-900 bg-zinc-900 text-white':'ring-zinc-200 hover:bg-zinc-50'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Active chips */}
          <div className="pt-1">
            <div className="flex flex-wrap gap-2 text-xs">
              {q && <Chip onClear={()=>setQ('')}>{q}</Chip>}
              {area!=='any' && <Chip onClear={()=>setArea('any')}>{area}</Chip>}
              {tags.map((t)=> <Chip key={t} onClear={()=>setTags(tags.filter(x=>x!==t))}>{t}</Chip>)}
              {(minPrice>0 || maxPrice<3000) && <Chip onClear={()=>{setMinPrice(0);setMaxPrice(3000);}}>KSh {minPrice} – {maxPrice}</Chip>}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 mt-2 flex items-center gap-2 border-t bg-white p-3">
          <button onClick={onClear} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-zinc-200 text-sm">
            <FilterX className="h-4 w-4" /> Clear
          </button>
          <button onClick={onApply} className="ml-auto rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">Apply filters</button>
        </div>
      </div>
    </div>
  );
}

function QuickView({ ev, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="relative h-56">
          <Image src={ev.img} alt={ev.title} fill className="object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-xs ring-1 ring-zinc-200">{ev.area}</span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{ev.title}</h3>
          <p className="text-sm text-zinc-600">{ev.when} • {ev.city}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {ev.rating} <span className="text-zinc-400">({ev.reviews})</span></span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {ev.friends} friends</span>
            <span className="inline-flex items-center gap-1"><Ticket className="h-3.5 w-3.5" /> {ev.ticketsLeft} left</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold">KSh {ev.price.toLocaleString()}</span>
            <div className="flex items-center gap-2">
              <button className="rounded-lg px-3 py-1.5 text-xs ring-1 ring-zinc-200 hover:bg-zinc-50">
                Split pay
              </button>
              <Link href={`/tickets/${ev.id}`} className="rounded-lg bg-zinc-900 px-4 py-2 text-white text-sm">
                Get Tickets
              </Link>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
            <button className="inline-flex items-center gap-1 hover:text-zinc-700"><Flag className="h-3.5 w-3.5" /> Report</button>
            <button className="inline-flex items-center gap-1 hover:text-zinc-700"><Heart className="h-3.5 w-3.5" /> Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupPoll({ onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-24 mx-auto max-w-md rounded-2xl bg-white shadow-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Start a group poll</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-zinc-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-600">Pick a couple of events and share a vote link with friends.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm ring-1 ring-zinc-200">Cancel</button>
          <button className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white">Create poll</button>
        </div>
      </div>
    </div>
  );
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

/* ------------------------------------------------
   SMALL UTILS
------------------------------------------------- */
function fillRate(e) {
  if (!e.capacity) return 0;
  return 1 - Math.max(0, Math.min(1, e.ticketsLeft / e.capacity));
}
