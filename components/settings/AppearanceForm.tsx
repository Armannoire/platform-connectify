"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Check, Monitor, Sun, Moon, Palette } from "lucide-react";

type Theme = "light" | "dark" | "system";

const THEMES: { id: Theme; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "light",  label: "Light",  icon: <Sun size={16} />,     desc: "Clean white interface"   },
  { id: "dark",   label: "Dark",   icon: <Moon size={16} />,    desc: "Easy on the eyes"        },
  { id: "system", label: "System", icon: <Monitor size={16} />, desc: "Follows your OS setting" },
];

const LANGUAGES = [
  { code: "en", label: "English"  },
  { code: "hy", label: "Հայերեն" },
  { code: "ru", label: "Русский"  },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch"  },
];

export default function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted]     = useState(false);
  const [language, setLanguage]   = useState("en");
  const [saved, setSaved]         = useState(false);

  // useTheme works only after mount
  useEffect(() => {
    setMounted(true);
    const lang = localStorage.getItem("language");
    if (lang) setLanguage(lang);
  }, []);

  const handleSave = () => {
    localStorage.setItem("language", language);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">

      {/* Theme */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-5 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950">
            <Palette size={15} className="text-violet-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Theme</h3>
            <p className="text-xs text-gray-400">Choose how Connectify looks for you</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-150 ${
                theme === t.id
                  ? "border-violet-400 bg-violet-50/50 dark:bg-violet-950/50"
                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700"
              }`}
            >
              {/* Preview mockup */}
              <div className={`flex h-14 w-full items-start overflow-hidden rounded-xl border ${
                t.id === "dark"
                  ? "border-gray-700 bg-gray-900"
                  : t.id === "light"
                  ? "border-gray-100 bg-white"
                  : "border-gray-200 bg-gradient-to-br from-white to-gray-100"
              }`}>
                <div className={`h-full w-8 shrink-0 ${t.id === "dark" ? "bg-gray-800" : "bg-gray-100"}`} />
                <div className="flex-1 p-2 space-y-1.5">
                  <div className={`h-1.5 w-3/4 rounded-full ${t.id === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className={`h-1.5 w-1/2 rounded-full ${t.id === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                  <div className={`h-1.5 w-2/3 rounded-full ${t.id === "dark" ? "bg-violet-800" : "bg-violet-100"}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={theme === t.id ? "text-violet-600" : "text-gray-400"}>
                  {t.icon}
                </span>
                <span className={`text-xs font-semibold ${theme === t.id ? "text-violet-700 dark:text-violet-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {t.label}
                </span>
              </div>

              <p className="text-[10px] text-gray-400 text-center">{t.desc}</p>

              {theme === t.id && (
                <div
                  className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-5 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950">
            <span className="text-sm">🌍</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Language</h3>
            <p className="text-xs text-gray-400">Select your preferred display language</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                language === lang.code
                  ? "border-violet-300 bg-violet-50 text-violet-700 font-medium dark:bg-violet-950 dark:border-violet-700 dark:text-violet-400"
                  : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-700"
              }`}
            >
              <span>{lang.label}</span>
              {language === lang.code && <Check size={13} className="text-violet-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-600 ring-1 ring-emerald-100">
            <Check size={13} /> Preferences saved
          </div>
        )}
        <div className="ml-auto">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            <Check size={14} />
            Save Preferences
          </button>
        </div>
      </div>

    </div>
  );
}