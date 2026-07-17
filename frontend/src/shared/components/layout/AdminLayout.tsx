import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LogOut,
  School,
  ShieldCheck,
  Tag,
  Users,
  Menu,
  Bell,
  Search,
  X,
  FileText,
  Sparkles,
  Layers,
  ClipboardList,
  Headphones,
  NotebookPen,
  CalendarCheck,
  Send,
  ClipboardCheck,
  CheckCheck,
  Clapperboard,
  Images,
  UsersRound,
  Bus,
  Bot,
  Mic,
  Lightbulb,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore.ts";
import { authApi } from "../../../features/auth/services/index.ts";
import { notificationsApi } from "../../../features/notifications/services/index.ts";
import { canAccess, roleProfiles } from "../../auth/roles.ts";

import FloatingBotWidget from "../FloatingBotWidget.tsx";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import clsx from "clsx";

// ── Navigation groups ────────────────────────────────────────────
const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/today", icon: CalendarCheck, label: "Today" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/schools", icon: School, label: "Schools" },
      { to: "/approvals", icon: ClipboardCheck, label: "Approvals" },
      { to: "/users", icon: Users, label: "Users" },
      { to: "/roles", icon: ShieldCheck, label: "Roles" },
      { to: "/enrollments", icon: Link2, label: "Enrollments" },
      { to: "/academics", icon: GraduationCap, label: "Academics" },
      { to: "/students", icon: UsersRound, label: "Students" },
      { to: "/transport", icon: Bus, label: "Transport" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/articles", icon: BookOpen, label: "Study Feed" },
      { to: "/categories", icon: Tag, label: "Categories" },
    ],
  },
  {
    label: "AI Learning",
    items: [
      { to: "/materials", icon: FileText, label: "Materials" },
      { to: "/tutor", icon: Sparkles, label: "Tutor Me" },
      { to: "/simple-bot", icon: Bot, label: "Simple Bot" },
      { to: "/flashcards", icon: Layers, label: "Flashcards" },
      { to: "/quizzes", icon: ClipboardList, label: "Quizzes" },
      { to: "/recite", icon: Headphones, label: "Recitation" },
      { to: "/explain", icon: Lightbulb, label: "AI Explainer" },
      { to: "/audio-recap", icon: Mic, label: "Audio " },
      { to: "/video", icon: Clapperboard, label: "Video" },
      { to: "/scenes", icon: Images, label: "Story Scenes" },
      { to: "/lesson-plans", icon: NotebookPen, label: "Lesson Plans" },
      { to: "/deliveries", icon: Send, label: "Deliveries" },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

// ── Role colour helpers ───────────────────────────────────────────
const roleColor: Record<string, { accent: string; dot: string }> = {
  SuperAdmin: { accent: "from-cyan-400 to-blue-500", dot: "bg-cyan-400" },
  SchoolAdmin: { accent: "from-blue-400 to-indigo-500", dot: "bg-blue-400" },
  Teacher: { accent: "from-emerald-400 to-teal-500", dot: "bg-emerald-400" },
  Student: { accent: "from-amber-400 to-orange-500", dot: "bg-amber-400" },
  Parent: { accent: "from-rose-400 to-pink-500", dot: "bg-rose-400" },
};

// ── Component ────────────────────────────────────────────────────
export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const role = user?.role;
  const profile = role ? roleProfiles[role] : null;
  const colors = role
    ? (roleColor[role] ?? roleColor.SchoolAdmin)
    : roleColor.SchoolAdmin;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Notifications (approvals, etc.) — light polling so the bell stays fresh.
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
    refetchInterval: 30000,
  });
  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;
  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    logout();
    navigate("/login");
    toast.success("Signed out successfully");
  };

  const currentPage = allNavItems.find(
    (item) =>
      location.pathname === item.to ||
      location.pathname.startsWith(`${item.to}/`),
  );

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  // ── Sidebar markup (shared between desktop & mobile) — dark theme ─
  const sidebar = (
    <div
      className="flex h-full flex-col pl-0.5"
      style={{ background: "#0D1425" }}
    >
      {/* ── Brand ──────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-[17px]"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-700/50">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <div className="text-[14.5px] font-bold tracking-tight text-white">
            VidyaAI
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            Learning Platform
          </div>
        </div>
      </div>

      {/* ── Role card ──────────────────────────────────────────── */}
      {profile && (
        <div
          className="mx-3 mt-3 overflow-hidden rounded-xl"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div
            className={clsx("h-[3px] w-full bg-gradient-to-r", colors.accent)}
          />
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={clsx("mt-0.5 h-1.5 w-1.5 rounded-full", colors.dot)}
              />
              <span className="text-[12.5px] font-bold text-white">
                {profile.label}
              </span>
            </div>
            <div className="mt-0.5 text-[11px] leading-4 text-slate-500">
              {profile.scope}
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const visible = group.items.filter((item) =>
            canAccess(role, item.to),
          );
          if (!visible.length) return null;
          return (
            <div key={group.label} className="mb-5">
              <div className="mb-1.5 px-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: "rgba(100,116,139,0.75)" }}
                >
                  {group.label}
                </span>
              </div>
              <div className="space-y-0.5">
                {visible.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-700/40"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
                      )
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{label}</span>
                    {to === "/approvals" && unread > 0 && (
                      <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User footer ────────────────────────────────────────── */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className={clsx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-bold text-white",
              colors.accent,
            )}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="truncate text-[11px] text-slate-500">
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-500 transition-all hover:bg-white/[0.06] hover:text-slate-300"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );

  // ── Shell ──────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block"
        style={{ boxShadow: "4px 0 32px rgba(0,0,0,0.4)" }}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-60 shadow-2xl animate-fade-in">
            {sidebar}
          </aside>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-xl border border-white/20 bg-white/10 p-2 text-white backdrop-blur"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        {/* ── Top header ───────────────────────────────────────── */}
        <header
          className="sticky top-0 z-20 flex h-[60px] items-center gap-3 bg-white/90 px-4 backdrop-blur-xl lg:px-6"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 font-bold text-slate-900 lg:hidden">
            <GraduationCap size={20} className="text-blue-600" />
            VidyaAI
          </div>

          <div className="hidden flex-1 items-baseline gap-3 lg:flex">
            <h1 className="text-[15px] font-bold text-slate-900">
              {currentPage?.label ?? "Dashboard"}
            </h1>
            {profile && (
              <span className="hidden text-[12px] text-slate-400 xl:block">
                {profile.description.length > 68
                  ? profile.description.slice(0, 68) + "…"
                  : profile.description}
              </span>
            )}
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-2.5 text-[12px] font-medium text-slate-500 transition hover:bg-white hover:shadow-sm sm:flex">
              <Search size={13} />
              <span>Search</span>
              <kbd className="ml-1.5 rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                ⌘K
              </kbd>
            </button>

            {/* Notification bell + dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                      <span className="text-[13px] font-bold text-slate-900">
                        Notifications
                      </span>
                      {unread > 0 && (
                        <button
                          onClick={() => markAllRead.mutate()}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                        >
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {!notifications?.length ? (
                        <div className="px-4 py-8 text-center text-[13px] text-slate-400">
                          You're all caught up.
                        </div>
                      ) : (
                        notifications.slice(0, 20).map((n) => (
                          <div
                            key={n.id}
                            className={clsx(
                              "border-b border-slate-50 px-4 py-2.5 last:border-0",
                              !n.isRead && "bg-blue-50/50",
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && (
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              )}
                              <div
                                className={clsx(
                                  "min-w-0",
                                  n.isRead && "pl-3.5",
                                )}
                              >
                                <div className="text-[12.5px] font-semibold text-slate-900">
                                  {n.title}
                                </div>
                                <div className="text-[11.5px] leading-4 text-slate-500">
                                  {n.message}
                                </div>
                                <div className="mt-0.5 text-[10.5px] text-slate-400">
                                  {formatDistanceToNow(new Date(n.createdAt), {
                                    addSuffix: true,
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {profile && (
              <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-[11.5px] font-semibold text-slate-600 sm:inline-flex">
                {profile.scope}
              </span>
            )}

            <div
              className={clsx(
                "flex h-9 w-9 shrink-0 cursor-default items-center justify-center rounded-xl bg-gradient-to-br text-[11px] font-bold text-white shadow-sm",
                colors.accent,
              )}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────── */}
        <main className="flex-1 animate-fade-in bg-white">
          <Outlet />
        </main>
      </div>

      {location.pathname !== "/simple-bot" && <FloatingBotWidget />}
    </div>
  );
}
