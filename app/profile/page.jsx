"use client";

import { useMemo, useRef, useState } from "react";
import { Edit } from "lucide-react";

// app/profile/page.jsx
import ProfileHeader from "../components/profile/ProfileHeader";
import Tabs from "../components/profile/Tabs";
import OverviewSection from "../components/profile/sections/OverviewSection";
import TicketsSection from "../components/profile/sections/TicketsSection";
import SavedSection from "../components/profile/sections/SavedSection";
import ReviewsSection from "../components/profile/sections/ReviewsSection";
import SettingsSection from "../components/profile/sections/SettingsSection";
import EditProfileModal from "../components/profile/EditProfileModal";

// If mockEvents is under app/lib/mockEvents.js
import { MOCK_EVENTS } from "../lib/mockEvents";


export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Brian Nyakundi",
    username: "@nyakundi316",
    bio: "Loves good music, better vibes, and unforgettable nights.",
    location: "Nairobi, Kenya",
    avatarUrl: "",
    coverUrl: "",
    stats: { tickets: 12, following: 48, followers: 122, walletKES: 2650 },
    notifyEmail: true,
    notifyPush: true,
  });

  const [active, setActive] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);

  const events = useMemo(() => MOCK_EVENTS, []);
  const saved = useMemo(() => events.filter((e) => e.status === "upcoming"), [events]);
  const tickets = events;

  const fileRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleFile = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (type === "avatar") setAvatarPreview(reader.result);
        else setCoverPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-black ">
      {/* Cover */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            coverPreview ||
            user.coverUrl ||
            "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2000&auto=format&fit=crop"
          }
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <button
          onClick={() => setShowEdit(true)}
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black"
        >
          <Edit size={14} /> Edit profile
        </button>
      </div>

      {/* Header + Tabs */}
      <div className="mx-auto -mt-12 max-w-6xl px-4 pb-10">
        <ProfileHeader
          user={user}
          avatarPreview={avatarPreview}
          onAvatarChange={(e) => handleFile(e, "avatar")}
          fileRef={fileRef}
        />

        <div className="mt-6">
          <Tabs active={active} onChange={setActive} />
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {active === "overview" && <OverviewSection events={events} user={user} />}
          {active === "tickets" && <TicketsSection tickets={tickets} />}
          {active === "saved" && <SavedSection saved={saved} />}
          {active === "reviews" && <ReviewsSection />}
          {active === "settings" && (
            <SettingsSection
              user={user}
              setUser={setUser}
              onCoverChange={(e) => handleFile(e, "cover")}
            />
          )}
        </div>
      </div>

      {/* Edit modal (UI only) */}
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={(u) => {
            setUser(u);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}
