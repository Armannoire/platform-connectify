"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({ children, workspaceId }: { children: ReactNode; workspaceId: string }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get("/api/user/profile");
      } catch {
        router.replace("/login");
      }
    };

    checkSession();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) checkSession();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkSession();
    };

    const handleFocus = () => checkSession();

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar workspaceId={workspaceId} />
      <div className="flex-1">
        <Navbar workspaceId={workspaceId} />
        <div className="p-8">{children}</div>
      </div>
    </main>
  );
}