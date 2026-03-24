// components/layout/Navbar.tsx
"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  name: string;
  avatar: string | null;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get("/api/user/profile")
      .then((res) => setUser(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">

      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          placeholder="Search documents, team members..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-black/[0.06]"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? ""}
          </div>
        )}
      </div>

    </header>
  );
}