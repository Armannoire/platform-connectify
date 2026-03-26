import { getSessionUserId } from "@/lib/auth/session";
import { userRepository } from "@/server/repositories/user.repository";
import { getStats } from "@/server/repositories/workspace.repo";
import { Users, Bell, MessageCircle, Archive, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default async function WorkspacePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;

  const userId = await getSessionUserId();
  const user   = await userRepository.findById(userId!);
  const stats  = await getStats(Number(workspaceId));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{greeting} 👋</p>
          <h1 className="mt-0.5 text-2xl font-semibold text-gray-900">{user?.name}</h1>
        </div>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-3 gap-4">

        {/* Hero Card */}
        <div className="col-span-2 relative overflow-hidden rounded-2xl p-7"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-8 right-20 h-36 w-36 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3">
            <div className="absolute right-8 top-8 h-20 w-20 rounded-full border border-white/10" />
            <div className="absolute right-4 top-16 h-32 w-32 rounded-full border border-white/[0.07]" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Workspace active
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white leading-tight">
              Your workspace <br />
              <span className="text-white/60">at a glance.</span>
            </h2>
            <p className="mt-2 text-xs text-white/50 max-w-xs">
              Stay updated with everything happening in your team today.
            </p>

            <div className="mt-6 flex items-center gap-6 border-t border-white/10 pt-5">
              {[
                { label: "Announcements", value: stats.announcements, href: `/workspace/${workspaceId}/announcement` },
                { label: "Groups",        value: stats.groups,        href: `/workspace/${workspaceId}/groups`       },
                { label: "Files",         value: stats.files,         href: `/workspace/${workspaceId}/archive`      },
                { label: "Members",       value: stats.members,       href: `/workspace/${workspaceId}/groups`       },
              ].map(({ label, value, href }) => (
                <Link key={label} href={href} className="group text-center">
                  <p className="text-2xl font-bold text-white group-hover:text-white/80 transition-colors">{value}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">{label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent</h2>
            <Link href={`/workspace/${workspaceId}/announcement`} className="text-[10px] text-gray-400 hover:text-gray-700 transition-colors">
              See all →
            </Link>
          </div>

          <div className="flex-1 space-y-2">
            {stats.recentAnnouncements.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <Bell size={16} className="mb-2 text-gray-200" />
                <p className="text-xs text-gray-400">No activity yet</p>
              </div>
            ) : stats.recentAnnouncements.map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl p-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  {a.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-800">{a.title}</p>
                  <p className="text-[10px] text-gray-400">
                    {a.authorName} · {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/workspace/${workspaceId}/announcement`}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            New announcement <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Quick Access Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label:     "Announcements",
            value:     stats.announcements,
            icon:      Bell,
            href:      `/workspace/${workspaceId}/announcement`,
            desc:      "Post & view updates",
            gradient:  "from-amber-400 to-orange-400",
            light:     "bg-amber-50 text-amber-500",
          },
          {
            label:     "Groups",
            value:     stats.groups,
            icon:      Users,
            href:      `/workspace/${workspaceId}/groups`,
            desc:      "Team collaboration",
            gradient:  "from-violet-500 to-purple-500",
            light:     "bg-violet-50 text-violet-500",
          },
          {
            label:     "Chat",
            value:     null,
            icon:      MessageCircle,
            href:      `/workspace/${workspaceId}/chat`,
            desc:      "Real-time messaging",
            gradient:  "from-blue-400 to-cyan-400",
            light:     "bg-blue-50 text-blue-500",
          },
          {
            label:     "Archive",
            value:     stats.files,
            icon:      Archive,
            href:      `/workspace/${workspaceId}/archive`,
            desc:      "Files & documents",
            gradient:  "from-emerald-400 to-teal-400",
            light:     "bg-emerald-50 text-emerald-500",
          },
        ].map(({ label, value, icon: Icon, href, desc, gradient, light }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]`} />
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${light}`}>
              <Icon size={16} />
            </div>
            <div className="mt-3">
              {value !== null && (
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              )}
              <p className={`font-semibold text-gray-900 ${value !== null ? "text-sm" : "text-base mt-1"}`}>{label}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{desc}</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-300 group-hover:text-gray-600 transition-colors">
              Open <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-4">

        {/* Announcements Table */}
        <div className="col-span-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Latest Announcements</h2>
            <Link href={`/workspace/${workspaceId}/announcement`} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
              View all <ArrowRight size={10} />
            </Link>
          </div>

          {stats.recentAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50">
                <Bell size={18} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">No announcements yet</p>
              <Link href={`/workspace/${workspaceId}/announcement`} className="mt-3 rounded-xl px-4 py-2 text-xs font-medium text-white hover:opacity-90" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                Create first
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentAnnouncements.map((a: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                  >
                    {a.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.authorName}</p>
                  </div>
                  <p className="shrink-0 text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-4">

          {/* Members */}
          <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                <Users size={15} className="text-white" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold">{stats.members}</p>
            <p className="text-xs text-white/60">Team Members</p>
          </div>

          {/* Storage */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-700">Storage</p>
              </div>
              <span className="text-xs text-gray-400">{stats.files} files</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Documents", color: "bg-violet-400", pct: 75 },
                { label: "Images",    color: "bg-blue-400",   pct: 45 },
                { label: "Videos",    color: "bg-rose-400",   pct: 25 },
                { label: "Other",     color: "bg-gray-200",   pct: 15 },
              ].map(({ label, color, pct }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-gray-400">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}