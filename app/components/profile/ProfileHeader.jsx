import { Camera, MapPin, ShieldCheck, Share2, Copy, Link as LinkIcon, Edit } from "lucide-react";
import Card from "../ui/Card"; // <-- adjust if your path differs

export default function ProfileHeader({ user, avatarPreview, onAvatarChange, fileRef }) {
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  // Fake profile completeness (frontend only)
  const completeness = 82; // change as you like

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://dundaing.app/u/${user.username.replace("@", "")}`);
      // optionally show a toast in your app
    } catch {}
  };

  return (
    <Card title="" icon={null}>
      {/* Put avatar on the RIGHT on larger screens */}
      <div className="flex flex-col items-center gap-6 sm:flex-row-reverse sm:items-end">
        
        {/* Avatar (bigger & on the right) */}
        <div className="relative -mt-10 h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 shrink-0 rounded-3xl border-4 border-white bg-gray-200 shadow-xl overflow-hidden">
          {avatarPreview || user.avatarUrl ? (
            <img
              src={avatarPreview || user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-6xl font-bold text-gray-500">
              {initials}
            </div>
          )}

          <label className="absolute bottom-2 right-2 inline-flex cursor-pointer items-center gap-1 rounded-full bg-black/90 px-2 py-1 text-[11px] font-medium text-white hover:bg-black">
            <Camera size={12} />
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} ref={fileRef} />
            Change
          </label>
        </div>

        {/* Left column: name/bio/stats + extra content */}
        <div className="flex-1 w-full">
          {/* Top row: name + location + verified */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{user.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} /> {user.location}
            </div>
          </div>

          {/* Bio */}
          <p className="mt-3 max-w-2xl text-sm text-gray-700">{user.bio}</p>

          {/* Quick actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
              <Edit size={14} /> Edit Profile
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200">
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              <Copy size={14} /> Copy Link
            </button>
            <a
              href={`https://dundaing.app/u/${user.username.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              <LinkIcon size={14} /> View Public
            </a>
          </div>

          {/* Profile completeness */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Profile completeness</span>
              <span>{completeness}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-black transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          {/* Interests / tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Afrobeats", "House", "Techno", "Brunch", "Nightlife"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Tickets" value={user.stats.tickets} />
            <Stat label="Following" value={user.stats.following} />
            <Stat label="Followers" value={user.stats.followers} />
            <Stat label="Wallet (KES)" value={user.stats.walletKES} />
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>Member since: 2024</span>
            <span>•</span>
            <span>Last active: today</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
