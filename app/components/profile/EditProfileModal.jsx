"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input, Textarea } from "../ui/Form";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit profile</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">Cancel</button>
          <button onClick={() => onSave(form)} className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save</button>
        </div>
      </div>
    </div>
  );
}
