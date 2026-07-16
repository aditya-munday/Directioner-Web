import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { EqualizerBars } from "@/components/animations";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { TextScramble } from "@/components/animations/TextScramble";
import { useServers, useActivityFeed, useAnalytics, useDashboardStats } from "@/lib/db";
import { mockBots, mockActivityFeed } from "@/lib/mockData";
import { Server, Users, MessageSquare, Database, RefreshCw, Zap, Plus, TrendingUp, TrendingDown, ArrowRight, BarChart2, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "@/lib/utils";

const CARD_BG = "#0f0f12";
const BORDER  = "rgba(255,255,255,0.06)";
const YELLOW  = "#FFE500";

const eventDot: Record<string, string> = {
  message_sent:     "#FFE500",
  voice_joined:     "#10b981",
  command_executed: "#0ea5e9",
  setting_changed:  "#f97316",
  memory_saved:     "#a855f7",
  billing:          "#10b981",
  system:           "#6366f1",
  server:           "#0ea5e9",
  alert:            "#f43f5e",
  memory:           "#a855f7",
  user:             "#10b981",
};

const mockFeedNormalized = mockActivityFeed.map((a, i) => ({
  id: String(a.id),
  event_type: a.type,
  created_at: new Date(Date.now() - i * 600000).toISOString(),
  details: a.desc,
  channel: null,
  server_id: null,
  user_id: "mock",
  actor: null,
}));

export default function DashboardIndex() {
  usePageTitle("Overview");
  const { user } = useAuth();
  const { data: servers = [], loading: serversLoading } = useServers(user?.id);
  const { data: analyticsData = [] }  = useAnalytics(user?.id, "7d");
  const { data: activityFeed = [], loading: activityLoading } = useActivityFeed(user?.id, 10);
  const stats = useDashboardStats(user?.id, servers, analyticsData);

  const displayServers = servers.length > 0 ? servers : [];
  const displayActivity = activityFeed.length > 0 ? activityFeed : mockFeedNormalized;

  const statCards = [
    { label: "Total Servers",   value: stats.totalServers,  icon: Server,        color: "#0ea5e9", trend: +12, trendUp: true  },
    { label: "Total Members",   value: stats.totalMembers,  icon: Users,         color: "#a855f7", trend: +8,  trendUp: true  },
    { label: "Messages Today",  value: stats.messagesToday, icon: MessageSquare, color: YELLOW,    trend: -3,  trendUp: false },
    { label: "Memory Nodes",    value: stats.memoryCount,   icon: Database,      color: "#10b981", trend: +21, trendUp: true  },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "rgba(255,255,255,0.25)" }}>
          OVERVIEW — LIVE DASHBOARD
        </div>
        <h1 className="font-display font-bold text-white leading-none mb-3"
          style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em" }}>
          Welcome back, {user?.username ?? "…"}.
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: YELLOW }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: YELLOW }}>
              All Systems Nominal
            </span>
          </div>
          <span className="font-mono text-[10px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.25)" }}>
            <Zap size={9} /> Supabase Realtime
          </span>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/onboarding"
          className="inline-flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wide px-4 py-2.5 transition-all"
          style={{ background: YELLOW, color: "#000" }}>
          <Plus size={13} /> Add Server
        </Link>
        <Link href="/dashboard/analytics"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide px-4 py-2.5 transition-all"
          style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}40`; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
          <BarChart2 size={13} /> View Analytics
        </Link>
        <Link href="/dashboard/billing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide px-4 py-2.5 transition-all"
          style={{ border: `1px solid rgba(16,185,129,0.25)`, color: "#10b981", background: "rgba(16,185,129,0.04)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.04)"; }}>
          <CreditCard size={13} /> Upgrade Plan
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard
              intensity={4}
              glowColor={`${s.color}10`}
              className="h-full"
            >
              <div
                className="rounded-lg p-6 relative overflow-hidden h-full group cursor-pointer"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${s.color}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
              >
                <BorderBeam color={s.color} duration={6} delay={i * 0.8} size={80} />
                <div className="flex items-start justify-between mb-4">
                  <TextScramble
                    text={s.label}
                    className="font-mono text-[10px] uppercase tracking-widest"
                    tag="span"
                    delay={i * 0.12}
                    duration={0.6}
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  />
                  <s.icon size={14} style={{ color: s.color, opacity: 0.5 }} className="group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="font-display font-bold text-white mb-3" style={{ fontSize: 40, lineHeight: 1 }}>
                  {serversLoading
                    ? <RefreshCw size={18} className="animate-spin" style={{ color: "rgba(255,255,255,0.25)" }} />
                    : <CountUpNumber target={s.value} />}
                </div>
                <div className="flex items-center gap-1">
                  {s.trendUp
                    ? <TrendingUp size={11} style={{ color: "#10b981" }} />
                    : <TrendingDown size={11} style={{ color: "#f43f5e" }} />}
                  <span className="font-mono text-[10px]" style={{ color: s.trendUp ? "#10b981" : "#f43f5e" }}>
                    {s.trendUp ? "+" : ""}{s.trend}% vs last week
                  </span>
                </div>
                <div
                  className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: `radial-gradient(circle at bottom right, ${s.color}18, transparent 70%)` }}
                />
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bots grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <h2 className="font-display font-bold text-white uppercase text-base">Your Servers</h2>
            <Link href="/dashboard/bots"
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all"
              style={{ border: `1px solid rgba(255,229,0,0.25)`, color: YELLOW, background: "rgba(255,229,0,0.05)" }}>
              View All <ArrowRight size={10} />
            </Link>
          </div>

          {serversLoading ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2].map(i => (
                <div key={i} className="rounded-lg p-6 h-48 animate-pulse" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <div className="w-10 h-10 rounded mb-4" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="h-3 rounded w-32 mb-2" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="h-2 rounded w-20" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              ))}
            </div>
          ) : displayServers.length === 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {mockBots.map((bot, i) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg p-5 flex flex-col justify-between min-h-[160px] transition-all group"
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 flex items-center justify-center font-display font-bold text-lg shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "#fff" }}>
                        {bot.serverName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-white truncate max-w-[120px]">{bot.serverName}</div>
                        <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {bot.memberCount.toLocaleString()} members
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 font-mono text-[9px] uppercase"
                      style={{
                        border: `1px solid ${bot.status === "online" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                        color: bot.status === "online" ? "#10b981" : "#f43f5e",
                        background: bot.status === "online" ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
                      }}>
                      {bot.status === "online"
                        ? <><EqualizerBars className="w-3 h-3" /><span>Online</span></>
                        : <><div className="w-1.5 h-1.5" style={{ background: "#f43f5e" }} /><span>Offline</span></>}
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5" style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.35)" }}>
                      {bot.channelCount} ch
                    </span>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5" style={{ border: `1px solid rgba(255,229,0,0.25)`, color: YELLOW, background: "rgba(255,229,0,0.05)" }}>
                      /chat
                    </span>
                  </div>
                  <Link href="/dashboard/bots"
                    className="block w-full text-center font-mono text-[10px] uppercase tracking-wide py-2 transition-all"
                    style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                    Manage →
                  </Link>
                </motion.div>
              ))}
              <Link href="/dashboard/onboarding"
                className="rounded-lg p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[160px] transition-all group"
                style={{ border: `1px dashed ${BORDER}`, background: "rgba(255,255,255,0.01)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}30`; (e.currentTarget as HTMLElement).style.background = "rgba(255,229,0,0.02)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.01)"; }}>
                <div className="w-9 h-9 flex items-center justify-center transition-all"
                  style={{ border: `1px solid rgba(255,255,255,0.15)`, color: "rgba(255,255,255,0.3)" }}>
                  <Plus size={16} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Deploy First Bot
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {servers.slice(0, 4).map((bot, i) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg p-5 flex flex-col justify-between min-h-[160px] transition-all group"
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 flex items-center justify-center font-display font-bold text-lg shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "#fff" }}>
                        {bot.server_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-white truncate max-w-[120px]">{bot.server_name}</div>
                        <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {bot.member_count.toLocaleString()} members
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 font-mono text-[9px] uppercase"
                      style={{
                        border: `1px solid ${bot.status === "online" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                        color: bot.status === "online" ? "#10b981" : "#f43f5e",
                        background: bot.status === "online" ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
                      }}>
                      {bot.status === "online"
                        ? <><EqualizerBars className="w-3 h-3" /><span>Online</span></>
                        : <><div className="w-1.5 h-1.5" style={{ background: "#f43f5e" }} /><span>Offline</span></>}
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5" style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.35)" }}>
                      {bot.channel_count} ch
                    </span>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5" style={{ border: `1px solid rgba(255,229,0,0.25)`, color: YELLOW, background: "rgba(255,229,0,0.05)" }}>
                      /{bot.ai_mode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Last active: {formatDistanceToNow(bot.created_at)}
                    </span>
                  </div>
                  <Link href={`/dashboard/bots/${bot.id}`}
                    className="block w-full text-center font-mono text-[10px] uppercase tracking-wide py-2 transition-all"
                    style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                    Manage →
                  </Link>
                </motion.div>
              ))}
              <Link href="/dashboard/onboarding"
                className="rounded-lg p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[160px] transition-all"
                style={{ border: `1px dashed ${BORDER}`, background: "rgba(255,255,255,0.01)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}30`; (e.currentTarget as HTMLElement).style.background = "rgba(255,229,0,0.02)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.01)"; }}>
                <div className="w-9 h-9 flex items-center justify-center transition-all"
                  style={{ border: `1px solid rgba(255,255,255,0.15)`, color: "rgba(255,255,255,0.3)" }}>
                  <Plus size={16} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Deploy New Bot
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <h2 className="font-display font-bold text-white uppercase text-base">Live Activity</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#10b981" }}>Realtime</span>
            </div>
          </div>

          {activityLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
              ))}
            </div>
          ) : (
            <div className="relative ml-2 pl-5 space-y-0"
              style={{ borderLeft: `1px solid rgba(255,255,255,0.06)` }}>
              {displayActivity.slice(0, 10).map((feed: any) => (
                <div key={feed.id} className="relative pb-5 last:pb-0">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: eventDot[feed.event_type ?? feed.type] ?? "rgba(255,255,255,0.3)" }} />
                  <div className="font-mono text-[9px] uppercase tracking-widest mb-0.5"
                    style={{ color: "rgba(255,255,255,0.25)" }}>
                    {feed.created_at ? formatDistanceToNow(feed.created_at) : feed.time ?? "just now"}
                  </div>
                  <div className="font-mono text-xs font-bold text-white capitalize">
                    {(feed.event_type ?? feed.type ?? "event").replace(/_/g, " ")}
                  </div>
                  <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {feed.details ?? feed.desc}
                    {feed.channel && <span className="ml-1" style={{ color: YELLOW }}>{feed.channel}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
