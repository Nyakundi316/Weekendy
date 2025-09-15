export default function Card({ title, icon, children, className = "" }) {
return (
<div className={`rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/5 ${className}`}>
<div className="mb-4 flex items-center gap-2">
{icon}
<h3 className="text-lg font-semibold">{title}</h3>
</div>
{children}
</div>
);
}