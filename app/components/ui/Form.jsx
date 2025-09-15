export function Input({ label, ...props }) {
return (
<label className="block text-sm">
<span className="mb-1 inline-block font-medium">{label}</span>
<input className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-black/10 focus:ring-4" {...props} />
</label>
);
}
export function Textarea({ label, ...props }) {
return (
<label className="block text-sm">
<span className="mb-1 inline-block font-medium">{label}</span>
<textarea className="min-h-[90px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-black/10 focus:ring-4" {...props} />
</label>
);
}