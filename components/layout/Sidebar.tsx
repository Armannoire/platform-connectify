// components/layout/Sidebar.tsx
"use client";

import { LayoutDashboard, Users, Bell, Settings, Archive, LogOut, MessageCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const sections = [
  {
    title: "MAIN",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: (id: string) => `/workspace/${id}`        },
      { label: "Groups",   icon: Users,            path: (id: string) => `/workspace/${id}/groups` },
      { label: "Chat",     icon: MessageCircle,    path: (id: string) => `/workspace/${id}/chat`   },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      { label: "Announcements", icon: Bell,    path: (id: string) => `/workspace/${id}/announcement` },
      { label: "Archive",       icon: Archive, path: (id: string) => `/workspace/${id}/archive`      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Settings", icon: Settings, path: (id: string) => `/workspace/${id}/settings` },
    ],
  },
];

export default function Sidebar({ workspaceId }: { workspaceId: string }) {
  const router   = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path) && (path !== `/workspace/${workspaceId}` || pathname === `/workspace/${workspaceId}`);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white p-6">

      {/* Logo */}
      <div
        onClick={() => router.push(`/workspace/${workspaceId}`)}
        className="mb-10 flex items-center gap-3 cursor-pointer"
      >
        <div className="h-9 w-9 rounded-xl bg-gray-900" />
        <span className="text-lg font-semibold">Connectify</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6">
        {sections.map(({ title, items }) => (
          <div key={title}>
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-widest text-gray-400">
              {title}
            </p>
            <div className="space-y-1">
              {items.map(({ label, icon: Icon, path }) => {
                const fullPath = path(workspaceId);
                return (
                  <div
                    key={fullPath}
                    onClick={() => router.push(fullPath)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer transition-colors ${
                      isActive(fullPath)
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
      >
        <LogOut size={18} />
        Sign Out
      </button>

    </aside>
  );
}