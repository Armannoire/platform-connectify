"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import ProfileForm from "@/components/settings/ProfileForm";
import PasswordForm from "@/components/settings/PasswordForm";
import AvatarUpload from "@/components/settings/AvatarUpload";
import { User, Lock, Camera } from "lucide-react";

const TABS = [
  { id: "profile",  label: "Profile",  icon: User   },
  { id: "password", label: "Password", icon: Lock   },
  { id: "avatar",   label: "Avatar",   icon: Camera },
] as const;

type Tab = typeof TABS[number]["id"];

export default function SettingsPage() {
  const { user, loading, error, updateProfile, updatePassword, updateAvatar } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.04]" />
        ))}
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
        {error || "Failed to load settings"}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "profile" && (
          <ProfileForm
            name={user.name}
            email={user.email}
            onSubmit={updateProfile}
          />
        )}
        {activeTab === "password" && (
          <PasswordForm onSubmit={updatePassword} />
        )}
        {activeTab === "avatar" && (
          <AvatarUpload
            currentAvatar={user.avatar}
            name={user.name}
            onUpload={updateAvatar}
          />
        )}
      </div>
    </>
  );
}