// components/layout/Navbar.tsx
"use client";

import { Settings, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import GlobalSearch from "@/components/search/GlobalSearch";

export default function Navbar({ workspaceId }: { workspaceId: string }) {
  const { user, setUser } = useUserStore();
  const [open, setOpen]   = useState(false);
  const router            = useRouter();
  const ref               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      axios.get("/api/user/profile")
        .then((res) => setUser(res.data.data))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  };

  const menuItems = [
    { label: "Profile",  icon: User,     onClick: () => { router.push(`/workspace/${workspaceId}/settings`); setOpen(false); } },
    { label: "Settings", icon: Settings, onClick: () => { router.push(`/workspace/${workspaceId}/settings`); setOpen(false); } },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">

      {/* Search */}
      <GlobalSearch workspaceId={Number(workspaceId)} />

      {/* Avatar + Dropdown */}
      <div className="relative" ref={ref}>

        {/* Avatar button */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="cursor-pointer flex items-center rounded-full transition-opacity hover:opacity-90"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-100"
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? ""}
            </div>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]">

            {/* User info */}
            <div className="flex items-center gap-3 border-b border-gray-50 px-4 py-3.5">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-100" />
              ) : (
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  {user?.name?.charAt(0).toUpperCase() ?? ""}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="truncate text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              {menuItems.map(({ label, icon: Icon, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Icon size={15} className="text-gray-400" />
                  {label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-50 p-1.5">
              <button
                onClick={handleLogout}
                className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>

          </div>
        )}
      </div>

    </header>
  );
}