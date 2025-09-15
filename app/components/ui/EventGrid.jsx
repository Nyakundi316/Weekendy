import { MapPin } from "lucide-react";
export default function EventGrid({ items, emptyText }) {
if (!items.length) {
return (
<div className="rounded-2xl border border-dashed p-6 text-center text-sm text-gray-600">
{emptyText}
</div>
);
}
return (
<div className="grid gap-4 sm:grid-cols-2">
{items.map((e) => (
<div key={e.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
<img src={e.img} alt={e.title} className="h-40 w-full object-cover" />
<div className="p-4">
<h4 className="line-clamp-1 font-semibold">{e.title}</h4>
<p className="mt-1 text-xs text-gray-600">{e.date}</p>
<p className="mt-1 text-xs text-gray-600 flex items-center gap-1"><MapPin size={14} /> {e.venue}, {e.city}</p>
</div>
<div className="flex items-center justify-between border-t p-3 text-sm">
<button className="rounded-lg bg-black px-3 py-1.5 font-medium text-white hover:bg-gray-800">View</button>
<button className="rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-800 hover:bg-gray-200">Share</button>
</div>
</div>
))}
</div>
);
}