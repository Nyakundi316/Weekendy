import { Calendar, Heart, Settings, Star, Ticket, User } from "lucide-react";
export default function Tabs({ active, onChange }) {
const Tab = ({ id, icon: Icon, label }) => (
<button
onClick={() => onChange(id)}
className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
active === id ? "bg-black text-white shadow" : "bg-white text-gray-700 hover:bg-gray-100"
}`}
>
<Icon size={16} /> {label}
</button>
);
return (
<div className="flex flex-wrap gap-2">
<Tab id="overview" icon={User} label="Overview" />
<Tab id="tickets" icon={Ticket} label="My Tickets" />
<Tab id="saved" icon={Heart} label="Saved" />
<Tab id="reviews" icon={Star} label="Reviews" />
<Tab id="settings" icon={Settings} label="Settings" />
</div>
);
}