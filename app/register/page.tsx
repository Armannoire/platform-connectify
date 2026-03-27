"use client";

import SignUpForm from "@/components/auth/RegisterForm";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    try {
      const name              = String(formData.get("name") || "").trim();
      const email             = String(formData.get("email") || "").trim();
      const password          = String(formData.get("password") || "");
      const confirmedPassword = String(formData.get("confirmedPassword") || "");
      await axios.post("/api/auth/register", { name, email, password, confirmedPassword });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed");
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
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-35 blur-3xl" style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/3 h-[350px] w-[350px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #c4b5fd, transparent 70%)" }} />
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
              Get started in minutes
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
              Set up your free workspace and start collaborating with your team today —{" "}
              <span className="font-semibold text-violet-600">no credit card required</span>.
            </p>

            <div className="mt-8 space-y-5">
              {[
                { n: "01", title: "Create your account", desc: "Sign up with your email in seconds"  },
                { n: "02", title: "Set up your workspace", desc: "Customize and invite your team"    },
                { n: "03", title: "Start collaborating",  desc: "Post updates, manage files and more" },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm shadow-violet-400/30"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                  >
                    {s.n}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{s.desc}</p>
                  </div>
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
                <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                <p className="mt-1.5 text-sm text-gray-500">Join thousands of teams on Connectify</p>
              </div>

              <SignUpForm
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                onClearError={() => setError("")}
              />

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-violet-600 transition-colors hover:text-violet-700">
                  Sign in
                </Link>
              </p>

              <p className="mt-3 text-center text-xs text-gray-400">
                By signing up, you agree to our{" "}
                <span className="cursor-pointer text-gray-500 hover:underline">Terms</span>
                {" & "}
                <span className="cursor-pointer text-gray-500 hover:underline">Privacy Policy</span>
              </p>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}