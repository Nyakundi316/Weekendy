import { Bell, CreditCard, Heart, LogOut, Ticket, User } from "lucide-react";
import Card from "../../components/ui/Card";
export default function QuickActions() {
return (
<Card title="Quick actions" icon={<User size={18} />}>
<div className="grid gap-3">
<ActionButton icon={<Ticket size={16} />} label="View my tickets" />
<ActionButton icon={<Heart size={16} />} label="Saved events" />
<ActionButton icon={<Bell size={16} />} label="Notifications" />
<ActionButton icon={<CreditCard size={16} />} label="Wallet & Payments" />
<ActionButton icon={<LogOut size={16} />} label="Log out (UI only)" tone="danger" />
</div>
</Card>
);
}
function ActionButton({ icon, label, tone = "default" }) {
return (
<button
className={`inline-flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
tone === "danger" ? "border-red-200 bg-red-50 text-red-800 hover:bg-red-100" : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
}`}
>
<span className="inline-flex items-center gap-2">{icon} {label}</span>
<span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-700">→</span>
</button>
);
}