"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import ProfileForm from "@/components/settings/ProfileForm";
import PasswordForm from "@/components/settings/PasswordForm";
import { User, Lock } from "lucide-react";

const TABS = [
  { id: "profile",  label: "Profile",  icon: User },
  { id: "password", label: "Security", icon: Lock },
] as const;

type Tab = typeof TABS[number]["id"];

export default function SettingsPage() {
  const { user, loading, error, updateProfile, updatePassword, updateAvatar } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.04]" />
        ))}
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
        {error || "Failed to load settings"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your personal information and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl bg-gray-100 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={14} className={activeTab === id ? "text-violet-500" : "text-gray-400"} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <ProfileForm
          name={user.name}
          email={user.email}
          currentAvatar={user.avatar}
          onSubmit={updateProfile}
          onUpload={updateAvatar}
        />
      )}
      {activeTab === "password" && (
        <PasswordForm onSubmit={updatePassword} />
      )}

    </div>
  );
}