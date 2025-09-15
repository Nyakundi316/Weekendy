import Card from "../../../components/ui/Card";
import { Camera, Settings } from "lucide-react";
export default function SettingsSection({ user, setUser, onCoverChange }) {
return (
<Card title="Settings" icon={<Settings size={18} />}>
<div className="grid gap-6 lg:grid-cols-2">
<div className="rounded-2xl border p-4">
<h4 className="font-semibold">Notifications</h4>
<div className="mt-3 space-y-3 text-sm">
<label className="flex items-center gap-2">
<input type="checkbox" checked={user.notifyEmail} onChange={(e) => setUser({ ...user, notifyEmail: e.target.checked })} />
Email updates (tickets, reminders)
</label>
<label className="flex items-center gap-2">
<input type="checkbox" checked={user.notifyPush} onChange={(e) => setUser({ ...user, notifyPush: e.target.checked })} />
Push notifications
</label>
</div>
</div>
<div className="rounded-2xl border p-4">
<h4 className="font-semibold">Customize Cover</h4>
<p className="mt-1 text-sm text-gray-600">Change your banner image.</p>
<label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">
<Camera size={16} /> Upload cover
<input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
</label>
</div>
</div>
</Card>
);
}