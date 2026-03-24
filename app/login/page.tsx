"use client"

import LoginForm from "@/components/auth/LoginForm";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (formData: FormData) => {
  setError("");
  setLoading(true);

  try {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const res = await axios.post("/api/auth/login", { email, password });

    console.log(res.data)

    const workspaceId = res.data?.workspaceId;

    if (!workspaceId) {
      throw new Error("Workspace not found");
    }

    router.push(`/workspace/${workspaceId}`);

  } catch (err: any) {
    setError(
      err.response?.data?.error ||
      err.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-gray-900/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-[520px] w-[520px] rounded-full bg-gray-900/5 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[520px] w-[520px] rounded-full bg-white/70 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] [background-size:22px_22px]" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        {/* Left */}
        <div className="w-full pl-8 pr-8 md:pl-16 lg:pl-24">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-3 py-1 text-xs text-gray-700 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Secure internal collaboration
            </div>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-gray-900">
              Connectify
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
              A workspace platform for{" "}
              <span className="font-medium text-gray-900">teams</span>,{" "}
              <span className="font-medium text-gray-900">schools</span>, and{" "}
              <span className="font-medium text-gray-900">organizations</span>{" "}
              to manage documents, announcements, and access — all in one place.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
              {[
                { title: "Archive", desc: "Store & organize files" },
                { title: "Announcements", desc: "Post, pin & comment" },
                { title: "Roles", desc: "Admin / Member access" },
                { title: "Activity", desc: "Transparent history log" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-black/10 bg-white/55 p-4 shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="mb-3 h-10 w-10 rounded-xl border border-black/10 bg-white/70" />
                  <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-1 text-xs text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative z-10 flex w-full justify-end pr-8 md:pr-16 lg:pr-24">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/60 to-white blur-xl" />
            <div className="rounded-[28px] bg-white px-10 py-12 shadow-[0_30px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.04]">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-gray-900" />
                <h2 className="text-2xl font-semibold text-gray-900">Welcome back!</h2>
                <p className="mt-1 text-sm text-gray-500">Please enter your details</p>
              </div>

              <LoginForm onSubmit={handleSubmit} loading={loading} error={error} onClearError={() => setError('')}/>

              <p className="mt-6 text-center text-xs text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-gray-900 transition-colors hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}