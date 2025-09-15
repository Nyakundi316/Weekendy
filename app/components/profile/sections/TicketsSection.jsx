import Card from "../../../components/ui/Card";
import { MapPin, Ticket } from "lucide-react";
export default function TicketsSection({ tickets }) {
return (
<Card title="My Tickets" icon={<Ticket size={18} />}>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{tickets.map((t) => (
<div key={t.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
<img src={t.img} alt={t.title} className="h-36 w-full object-cover" />
<div className="flex items-start justify-between p-4">
<div>
<h4 className="line-clamp-1 font-semibold">{t.title}</h4>
<p className="mt-1 text-xs text-gray-600">{t.date}</p>
<p className="mt-1 text-xs text-gray-600 flex items-center gap-1"><MapPin size={14} /> {t.venue}, {t.city}</p>
<p className="mt-2 text-sm font-medium">KES {t.priceKES.toLocaleString()}</p>
</div>
<div className="rounded-xl bg-gray-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-gray-700">{t.ticketRef}</div>
</div>
<div className="flex items-center justify-between border-t p-3 text-sm">
<button className="rounded-lg bg-black px-3 py-1.5 font-medium text-white hover:bg-gray-800">View QR</button>
<button className="rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-800 hover:bg-gray-200">Download</button>
</div>
</div>
))}
</div>
</Card>
);
}