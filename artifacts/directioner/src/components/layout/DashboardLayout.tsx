import { Link, useLocation, Redirect } from "wouter";
import { useAuth, type User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bot, BarChart, Settings, CreditCard, LifeBuoy, LogOut, Menu, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@assets/Directioner_1783857395826.png";

const navItems = [
  { path: "/dashboard",            label: "Overview",   icon: LayoutDashboard },
  { path: "/dashboard/bots",       label: "My Bots",    icon: Bot              },
  { path: "/dashboard/analytics",  label: "Analytics",  icon: BarChart         },
  { path: "/dashboard/settings",   label: "Settings",   icon: Settings         },
  { path: "/dashboard/billing",    label: "Billing",    icon: CreditCard       },
  { path: "/dashboard/support",    label: "Support",    icon: LifeBuoy         },
];

const SIDEBAR_BG  = "#0a0a0c";
const BORDER      = "rgba(255,255,255,0.06)";
const ACTIVE_CLR  = "#FFE500";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, session, loading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!session) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#070708" }}>
          <Loader2 className="animate-spin" size={28} style={{ color: ACTIVE_CLR }} />
        </div>
      );
    }
    return <Redirect to="/login" />;
  }

  const displayUser: User = user ?? {
    id: session.user.id,
    username: (session.user.user_metadata?.username as string) || session.user.email?.split("@")[0] || "User",
    full_name: (session.user.user_metadata?.full_name as string) || null,
    avatar_url: (session.user.user_metadata?.avatar_url as string) || null,
    tier: "free",
    credits_used: 0,
    credits_limit: 0,
    created_at: session.user.created_at ?? "",
    updated_at: session.user.created_at ?? "",
    email: session.user.email ?? "",
  };

  const handleLogout = () => { logout(); setLocation("/"); };

  const SidebarContent = () => (
    <div
      className="flex flex-col h-full"
      style={{ background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}` }}
    >
      {/* Logo */}
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <Link
          href="/dashboard"
          className={cn("flex items-center gap-2.5 font-display font-bold tracking-tight text-white uppercase", collapsed && "hidden")}
          style={{ fontSize: 16 }}
        >
          <img src={logoSrc} alt="Directioner" className="w-7 h-7 object-contain" />
          Directioner
        </Link>
        {collapsed && (
          <Link href="/dashboard" className="block w-7 h-7 mx-auto">
            <img src={logoSrc} alt="Directioner" className="w-7 h-7 object-contain" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
        >
          <ChevronRight size={16} className={cn("transition-transform", !collapsed && "rotate-180")} />
        </button>
      </div>

      {/* User */}
      <div
        className={cn("px-4 py-4 flex items-center gap-3", collapsed && "justify-center px-0")}
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div
          className="w-9 h-9 flex items-center justify-center font-mono font-bold text-sm shrink-0"
          style={{ background: "rgba(255,229,0,0.12)", border: "1px solid rgba(255,229,0,0.25)", color: ACTIVE_CLR }}
        >
          {displayUser.username.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-mono text-sm text-white truncate">{displayUser.username}</div>
            <div
              className="font-mono text-[9px] uppercase tracking-widest mt-0.5 px-1.5 py-0.5 inline-block"
              style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.2)", color: ACTIVE_CLR }}
            >
              {displayUser.tier}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {navItems.map(item => {
          const isActive = location === item.path || (item.path !== "/dashboard" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)} className="relative block">
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors cursor-pointer",
                  collapsed && "justify-center px-0"
                )}
                style={{
                  color: isActive ? ACTIVE_CLR : "rgba(255,255,255,0.38)",
                  background: isActive ? "rgba(255,229,0,0.06)" : "transparent",
                }}
                whileHover={{ color: isActive ? ACTIVE_CLR : "#fff", background: isActive ? "rgba(255,229,0,0.06)" : "rgba(255,255,255,0.04)" } as any}
              >
                <item.icon size={15} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: ACTIVE_CLR }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1" style={{ borderTop: `1px solid ${BORDER}` }}>
        {!collapsed && displayUser.tier !== "max" && (
          <Link
            href="/dashboard/billing"
            className="block w-full text-center font-mono font-bold text-xs uppercase tracking-wide py-2.5 mb-2 transition-all"
            style={{ background: ACTIVE_CLR, color: "#000" }}
          >
            Upgrade Plan
          </Link>
        )}
        <button
          onClick={handleLogout}
          className={cn("flex items-center gap-3 w-full px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors", collapsed && "justify-center px-0")}
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f43f5e"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
        >
          <LogOut size={15} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#070708" }}>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:block fixed top-0 left-0 bottom-0 z-30"
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 400, damping: 38 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-60 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main
        className="flex-1 flex flex-col min-w-0 md:transition-[margin] md:duration-300"
        style={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 768 ? (collapsed ? 72 : 240) : 0 }}
      >
        {/* Mobile header */}
        <header
          className="md:hidden h-14 flex items-center justify-between px-4 shrink-0 sticky top-0 z-20"
          style={{ background: SIDEBAR_BG, borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center gap-2 font-display font-bold text-white uppercase text-sm">
            <img src={logoSrc} alt="Directioner" className="w-6 h-6 object-contain" />
            Directioner
          </div>
          <button onClick={() => setMobileOpen(true)} style={{ color: "rgba(255,255,255,0.5)" }}>
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-5 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
