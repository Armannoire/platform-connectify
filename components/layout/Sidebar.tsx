// components/layout/Sidebar.tsx
"use client";

import { LayoutDashboard, Users, Bell, Settings, Archive, MessageCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

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

  const isActive = (path: string) =>
    pathname.startsWith(path) && (path !== `/workspace/${workspaceId}` || pathname === `/workspace/${workspaceId}`);

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 py-8 px-4">

      {/* Logo */}
      <div
        onClick={() => router.push(`/workspace/${workspaceId}`)}
        className="mb-10 flex items-center gap-3 px-3 cursor-pointer"
      >
        <div className="h-10 w-10 shrink-0 flex items-center justify-center">
          <Image
            src="/ICON.svg"
            alt="Connectify"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">Connectify</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6">
        {sections.map(({ title, items }) => (
          <div key={title}>
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-gray-400">
              {title}
            </p>
            <div className="space-y-0.5">
              {items.map(({ label, icon: Icon, path }) => {
                const fullPath = path(workspaceId);
                const active = isActive(fullPath);
                return (
                  <div
                    key={fullPath}
                    onClick={() => router.push(fullPath)}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all text-sm ${
                      active
                        ? "text-violet-700 font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {active && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-[0.08]"
                        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                      />
                    )}
                    {active && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                        style={{ background: "linear-gradient(180deg, #667eea, #764ba2)" }}
                      />
                    )}
                    <Icon
                      size={17}
                      strokeWidth={active ? 2 : 1.75}
                      className={active ? "text-violet-500" : "text-gray-400"}
                    />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}