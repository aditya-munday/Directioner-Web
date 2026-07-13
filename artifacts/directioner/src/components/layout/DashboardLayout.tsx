import { Link, useLocation, Redirect } from "wouter";
import { useAuth, type User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bot, BarChart, Settings, CreditCard, LifeBuoy, LogOut, Menu, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@assets/Directioner_1783857395826.png";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/dashboard/bots", label: "My Bots", icon: Bot },
  { path: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
  { path: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { path: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, session, loading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect to login only when there is no active auth session.
  // The `user` profile is hydrated asynchronously and must NOT be the
  // trigger for this redirect (it can briefly be null even when signed in).
  if (!session) {
    // While the initial session is still being resolved, don't bounce the
    // user to /login (avoids a redirect flicker / pin-pong right after login).
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="animate-spin text-primary mx-auto" size={32} />
        </div>
      );
    }
    return <Redirect to="/login" />;
  }

  // Guarantee a non-null user for rendering. Prefer the fully hydrated
  // profile, but fall back to the session's metadata so the UI never gets
  // stuck waiting on an (async) profile fetch.
  const displayUser: User = user ?? {
    id: session.user.id,
    username: (session.user.user_metadata?.username as string) || session.user.email?.split('@')[0] || 'User',
    full_name: (session.user.user_metadata?.full_name as string) || null,
    avatar_url: (session.user.user_metadata?.avatar_url as string) || null,
    tier: 'free',
    credits_used: 0,
    credits_limit: 0,
    created_at: session.user.created_at ?? '',
    updated_at: session.user.created_at ?? '',
    email: session.user.email ?? '',
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 flex items-center justify-between">
        <Link href="/dashboard" className={cn("flex items-center gap-3 font-display font-bold tracking-tighter", collapsed ? "hidden" : "text-xl")}>
          <img src={logoSrc} alt="Directioner" className="w-8 h-8 object-contain" />
          <span>DIRECTIONER</span>
        </Link>
        {collapsed && (
          <Link href="/dashboard" className="block w-8 h-8 ml-2">
            <img src={logoSrc} alt="Directioner" className="w-8 h-8 object-contain" />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block text-muted-foreground hover:text-foreground">
          <ChevronRight size={18} className={cn("transition-transform", !collapsed && "rotate-180")} />
        </button>
      </div>

      <div className={cn("px-6 pb-6 border-b border-border mb-6 flex items-center gap-3", collapsed && "justify-center px-0")}>
        <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center font-display font-bold text-lg rounded-none shrink-0 border border-primary/30">
          {displayUser.username.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-mono text-sm truncate">{displayUser.username}</div>
            <div className="font-mono text-xs text-primary uppercase mt-1 px-1 bg-primary/10 inline-block border border-primary/20">{displayUser.tier} Plan</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== '/dashboard' && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)} className="relative block">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-mono text-sm transition-colors cursor-pointer",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                collapsed && "justify-center px-0"
              )}>
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {!collapsed && displayUser.tier !== 'max' && (
          <Link href="/dashboard/billing" className="block w-full py-2 mb-4 bg-primary text-black font-mono text-xs uppercase text-center corner-brackets hover:bg-primary/90 transition-colors">
            Upgrade Plan
          </Link>
        )}
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 text-muted-foreground hover:text-destructive font-mono text-sm transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside 
        className="hidden md:block fixed top-0 left-0 bottom-0 z-30"
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[260px] z-50 bg-card"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className="flex-1 flex flex-col min-w-0 md:transition-[margin] md:duration-300"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (collapsed ? 80 : 260) : 0 }}
      >
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 font-display font-bold text-lg">
            <img src={logoSrc} alt="Directioner" className="w-6 h-6 object-contain" />
            <span>DIRECTIONER</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-2">
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
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
