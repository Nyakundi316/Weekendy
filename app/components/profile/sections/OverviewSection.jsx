import { motion } from "framer-motion";
import Card from "../../../components/ui/Card";
import EventGrid from "../../../components/ui/EventGrid";
import QuickActions from "../../../components/profile/QuickActions";
import { Calendar, ShieldCheck } from "lucide-react";
export default function OverviewSection({ events }) {
const upcoming = events.filter((e) => e.status === "upcoming");
const past = events.filter((e) => e.status === "past");
return (
<div className="grid gap-6 lg:grid-cols-3">
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="lg:col-span-2">
<Card title="Upcoming events" icon={<Calendar size={18} />}>
<EventGrid items={upcoming} emptyText="No upcoming events yet." />
</Card>
<Card className="mt-6" title="Past events" icon={<Calendar size={18} />}>
<EventGrid items={past} emptyText="No past events." />
</Card>
</motion.div>
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="lg:col-span-1">
<QuickActions />
<Card className="mt-6" title="Verification" icon={<ShieldCheck size={18} />}>
<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Your email is verified. Phone verification coming soon.</div>
</Card>
</motion.div>
</div>
);
}