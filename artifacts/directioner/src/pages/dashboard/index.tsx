import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { StaggeredGrid, OscilloscopeWave, EqualizerBars } from "@/components/animations";
import { useServers, useActivityFeed, useAnalytics, useDashboardStats } from "@/lib/db";
import { Server, Users, MessageSquare, Database, RefreshCw, Zap } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "@/lib/utils";

export default function DashboardIndex() {
  usePageTitle("Overview");
  const { user } = useAuth();
  const { data: servers = [], loading: serversLoading } = useServers(user?.id);
  const { data: analyticsData = [] } = useAnalytics(user?.id, '7d');
  const { data: activityFeed = [], loading: activityLoading } = useActivityFeed(user?.id, 10);
  const stats = useDashboardStats(user?.id, servers, analyticsData);

  const statCards = [
    { label: "Total Servers",   value: stats.totalServers,  icon: Server,       suffix: "" },
    { label: "Total Members",   value: stats.totalMembers,  icon: Users,        suffix: "" },
    { label: "Messages Today",  value: stats.messagesToday, icon: MessageSquare, suffix: "" },
    { label: "Memory Nodes",    value: stats.memoryCount,   icon: Database,     suffix: "" },
  ];

  const eventColor: Record<string, string> = {
    message_sent:    "bg-primary",
    voice_joined:    "bg-accent",
    command_executed:"bg-blue-400",
    setting_changed: "bg-orange-400",
    memory_saved:    "bg-purple-400",
    billing:         "bg-accent",
  };

  return (
    <div className="space-y-8">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-display font-bold uppercase mb-2 text-white">
          Welcome back, {user?.username}.
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-primary border border-primary bg-primary/10 inline-block px-3 py-1 uppercase text-xs">
            System Status: All Systems Nominal
          </span>
          <span className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1">
            <Zap size={10} className="text-accent" />
            Live data via Supabase Realtime
          </span>
        </div>
      </header>

      {/* Stats Row */}
      <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-card border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-xs uppercase text-muted-foreground">{s.label}</span>
              <s.icon size={16} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-4xl font-display font-black text-white">
              {serversLoading
                ? <RefreshCw size={20} className="animate-spin text-muted-foreground" />
                : <CountUpNumber target={s.value} />}
            </div>
            <OscilloscopeWave
              className="absolute bottom-0 left-0 right-0 h-8 opacity-[0.03] group-hover:opacity-10 transition-opacity"
              color="hsl(var(--primary))"
              speed={4 + i}
            />
          </div>
        ))}
      </StaggeredGrid>

      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        {/* Bots Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display text-lg font-bold uppercase text-white">Your Bots</h2>
            <Link href="/dashboard/bots" className="font-mono text-xs text-primary hover:underline uppercase border border-primary/30 px-3 py-1 bg-primary/5">
              View All
            </Link>
          </div>

          {serversLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1,2].map(i => (
                <div key={i} className="border border-border bg-card p-6 min-h-[160px] animate-pulse">
                  <div className="w-10 h-10 bg-white/5 mb-4" />
                  <div className="h-3 bg-white/5 w-32 mb-2" />
                  <div className="h-2 bg-white/5 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {servers.slice(0, 4).map(bot => (
                <div key={bot.id} className="border border-border bg-card p-6 hover:border-primary/50 transition-colors flex flex-col justify-between min-h-[160px]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary flex items-center justify-center font-display font-bold text-lg border border-border text-white">
                        {bot.server_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white truncate max-w-[120px]">{bot.server_name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{bot.member_count.toLocaleString()} members</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border border-border px-2 py-1 bg-background">
                      {bot.status === 'online' ? (
                        <>
                          <EqualizerBars className="w-3 h-3" />
                          <span className="font-mono text-[10px] uppercase text-accent">Online</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500" />
                          <span className="font-mono text-[10px] uppercase text-red-500">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mb-4 flex gap-3">
                    <span>{bot.channel_count} channels</span>
                    <span className="text-primary">{bot.ai_mode} mode</span>
                  </div>
                  <Link href={`/dashboard/bots/${bot.id}`} className="block w-full text-center border border-border py-2 font-mono text-xs uppercase text-white hover:bg-white hover:text-black transition-colors">
                    Manage Instance
                  </Link>
                </div>
              ))}
              <Link href="/dashboard/onboarding" className="border border-dashed border-border bg-card/50 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer min-h-[160px] group">
                <div className="w-10 h-10 border border-muted-foreground group-hover:border-primary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors text-xl">+</div>
                <span className="font-mono text-xs uppercase text-muted-foreground group-hover:text-primary transition-colors">Deploy New Bot</span>
              </Link>
            </div>
          )}
        </div>

        {/* Activity Feed — live */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display text-lg font-bold uppercase text-white">Live Activity</h2>
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-accent">
              <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
              Realtime
            </span>
          </div>

          {activityLoading ? (
            <div className="space-y-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : activityFeed.length === 0 ? (
            <div className="font-mono text-xs text-muted-foreground border border-border p-6 text-center">
              // NO ACTIVITY YET — start chatting on Discord
            </div>
          ) : (
            <div className="relative border-l border-border ml-2 pl-6 pt-2 space-y-0">
              {activityFeed.map((feed) => (
                <div key={feed.id} className="relative pb-6 last:pb-0">
                  <div className={`absolute -left-[29px] top-1 w-3 h-3 border-2 border-background ${eventColor[feed.event_type] ?? 'bg-white/40'}`} />
                  <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase">
                    {formatDistanceToNow(feed.created_at)}
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5 capitalize">
                    {feed.event_type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {feed.details}
                    {feed.channel && <span className="text-primary ml-1">{feed.channel}</span>}
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
