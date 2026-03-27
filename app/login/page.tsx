"use client";

import LoginForm from "@/components/auth/LoginForm";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    try {
      const email    = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const res      = await axios.post("/api/auth/login", { email, password });
      const workspaceId = res.data?.workspaceId;
      if (!workspaceId) throw new Error("Workspace not found");
      router.push(`/workspace/${workspaceId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="light relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg, #ede9fe 0%, #f5f3ff 35%, #faf5ff 65%, #f0f9ff 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #c4b5fd, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#7c3aed_1px,transparent_0)] [background-size:24px_24px]" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center">

        {/* Left — branding */}
        <div className="hidden w-full pl-16 pr-8 lg:block xl:pl-28">
          <div className="max-w-md">

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-violet-600 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure internal collaboration
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-violet-500/25"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 1-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-3xl font-bold tracking-tight text-gray-900">Connectify</span>
            </div>

            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              A workspace platform for{" "}
              <span className="font-semibold text-violet-600">teams</span>,{" "}
              <span className="font-semibold text-violet-600">schools</span>, and{" "}
              <span className="font-semibold text-violet-600">organizations</span>
              {" "}to stay aligned — all in one place.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: "📁", title: "Archive",       desc: "Store & organize files"  },
                { icon: "📢", title: "Announcements", desc: "Post, pin & comment"     },
                { icon: "👥", title: "Groups",        desc: "Team collaboration"      },
                { icon: "⚡", title: "Activity",      desc: "Transparent history"     },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-violet-100/70 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-violet-200 hover:bg-white/70 hover:shadow-md"
                >
                  <span className="text-lg">{f.icon}</span>
                  <p className="mt-2 text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right — form card */}
        <div className="flex w-full justify-center px-6 lg:justify-end lg:pr-16 xl:pr-28">
          <div className="w-full max-w-md">
            <div className="rounded-3xl bg-white/80 px-10 py-11 shadow-[0_24px_80px_rgba(109,40,217,0.13)] ring-1 ring-violet-100/80 backdrop-blur-2xl">

              <div className="mb-7">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-1.5 text-sm text-gray-500">Sign in to continue to your workspace</p>
              </div>

              <LoginForm
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                onClearError={() => setError("")}
              />

              <p className="mt-7 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-violet-600 transition-colors hover:text-violet-700">
                  Sign up for free
                </Link>
              </p>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}