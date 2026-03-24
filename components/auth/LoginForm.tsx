"use client"

import { FormProps } from "@/types/login";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/8";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500";

export default function LoginForm({ onSubmit, loading, error, onClearError }: FormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="min-h-[44px]">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 backdrop-blur-sm"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
              <AlertCircle size={11} className="text-white" strokeWidth={2.5} />
            </span>
            <p className="text-sm leading-snug text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          name="email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={onClearError}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={onClearError}
          className={inputClass}
        />
      </div>

      <div>
        <span className="cursor-pointer text-xs text-gray-400 transition-colors duration-150 hover:text-gray-900">
          Forgot password?
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-gray-900 py-3 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-black hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        disabled={loading}
        className="w-full rounded-full border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Log in with Google
      </button>

    </form>
  );
}