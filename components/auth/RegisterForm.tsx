"use client";

import { FormProps } from "@/types/login";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignUpForm({ onSubmit, loading, error, onClearError }: FormProps) {
  const [name, setName]                           = useState("");
  const [email, setEmail]                         = useState("");
  const [password, setPassword]                   = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showPass, setShowPass]                   = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  };

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#111827",
    borderColor: "#e5e7eb",
  };

  const inputClass = "w-full rounded-xl border px-4 py-3 text-sm placeholder-gray-400 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Full name</label>
        <input
          name="name"
          type="text"
          placeholder="James Brown"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={onClearError}
          style={inputStyle}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Email address</label>
        <input
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={onClearError}
          style={inputStyle}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={onClearError}
            style={inputStyle}
            className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600" tabIndex={-1}>
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Confirm */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Confirm password</label>
        <div className="relative">
          <input
            name="confirmedPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            onFocus={onClearError}
            style={inputStyle}
            className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600" tabIndex={-1}>
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Creating account...
          </span>
        ) : "Create account"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: "#f3f4f6" }} />
        <span className="text-xs text-gray-400">or continue with</span>
        <div className="h-px flex-1" style={{ backgroundColor: "#f3f4f6" }} />
      </div>

      {/* Google */}
      <button
        type="button"
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-medium transition-all active:scale-[0.99] disabled:opacity-50"
        style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "#e5e7eb", color: "#374151" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
      </button>

    </form>
  );
}