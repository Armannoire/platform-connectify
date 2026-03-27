"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import ProfileForm from "@/components/settings/ProfileForm";
import PasswordForm from "@/components/settings/PasswordForm";
import AppearanceForm from "@/components/settings/AppearanceForm";
import DangerZoneForm from "@/components/settings/DangerZoneForm";
import { User, Lock, Palette, AlertTriangle } from "lucide-react";

const TABS = [
  { id: "profile",    label: "Profile",    icon: User          },
  { id: "security",   label: "Security",   icon: Lock          },
  { id: "appearance", label: "Appearance", icon: Palette       },
  { id: "danger",     label: "Danger Zone",icon: AlertTriangle },
] as const;

type Tab = typeof TABS[number]["id"];

export default function SettingsPage() {
  const {
    user, loading, error,
    updateProfile, updatePassword, updateAvatar,
    deleteAccount, leaveWorkspace,
  } = useSettings();

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
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your personal information and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl bg-gray-100/80 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all ${
              activeTab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            } ${id === "danger" && activeTab === id ? "text-red-600" : ""}`}
          >
            <Icon
              size={13}
              className={
                activeTab === id
                  ? id === "danger" ? "text-red-500" : "text-violet-500"
                  : "text-gray-400"
              }
            />
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

      {activeTab === "security" && (
        <PasswordForm onSubmit={updatePassword} />
      )}

      {activeTab === "appearance" && (
        <AppearanceForm />
      )}

      {activeTab === "danger" && (
        <DangerZoneForm
          onDeleteAccount={deleteAccount}
          onLeaveWorkspace={leaveWorkspace}
        />
      )}

    </div>
  );
}