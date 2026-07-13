import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { useServers, deleteServer } from "@/lib/db";
import { Link } from "wouter";
import { EqualizerBars } from "@/components/animations";
import { Plus, RefreshCw, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Bots() {
  usePageTitle("My Bots");
  const { user } = useAuth();
  const { data: servers = [], loading, refetch } = useServers(user?.id);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const tierLimits: Record<string, number> = { free: 1, basic: 3, pro: 10, max: Infinity };
  const limit = tierLimits[user?.tier ?? 'free'];

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) { setConfirmDelete(id); return; }
    setDeleting(id);
    setConfirmDelete(null);
    try {
      await deleteServer(id);
      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">My Bots.</h1>
          <p className="font-mono text-sm text-muted-foreground uppercase">
            {loading ? 'Loading...' : `Deployments (${servers.length}/${limit === Infinity ? '∞' : limit})`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="border border-border text-muted-foreground hover:text-white px-4 py-3 transition-colors">
            <RefreshCw size={16} />
          </button>
          <Link
            href="/dashboard/onboarding"
            className="bg-primary text-black font-mono font-bold px-6 py-3 uppercase text-xs corner-brackets hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Deploy New
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-border bg-card p-6 h-64 animate-pulse">
              <div className="w-12 h-12 bg-white/5 mb-6" />
              <div className="h-4 bg-white/5 w-36 mb-2" />
              <div className="h-3 bg-white/5 w-24" />
            </div>
          ))}
        </div>
      ) : servers.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-6 uppercase">// NO BOTS DEPLOYED</div>
          <Link href="/dashboard/onboarding" className="bg-primary text-black font-mono font-bold px-8 py-4 uppercase text-sm corner-brackets hover:bg-white transition-colors inline-block">
            Deploy Your First Bot
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map(bot => (
            <div key={bot.id} className={cn("border bg-card p-6 flex flex-col h-full transition-colors group", confirmDelete === bot.id ? "border-red-500/50" : "border-border hover:border-primary/50")}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center font-display font-bold text-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                  {bot.server_name.charAt(0)}
                </div>
                <div className={cn("flex items-center gap-2 border px-2 py-1 text-[10px] font-mono uppercase",
                  bot.status === 'online' ? "border-accent/30 bg-accent/5 text-accent" : "border-red-500/30 bg-red-500/5 text-red-400"
                )}>
                  {bot.status === 'online' ? (
                    <><EqualizerBars className="w-4 h-3" /><span>Online</span></>
                  ) : (
                    <><div className="w-1.5 h-1.5 bg-red-500" /><span>Offline</span></>
                  )}
                </div>
              </div>

              <div className="mb-6 flex-1">
                <h3 className="font-bold text-xl mb-1 truncate">{bot.server_name}</h3>
                <div className="flex flex-wrap gap-3 font-mono text-xs text-muted-foreground uppercase mb-2">
                  <span>{bot.member_count.toLocaleString()} members</span>
                  <span>{bot.channel_count} channels</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="font-mono text-[10px] border border-border px-2 py-0.5 text-muted-foreground uppercase">{bot.tier} plan</span>
                  <span className="font-mono text-[10px] border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary uppercase">/{bot.ai_mode}</span>
                </div>
              </div>

              <div className="space-y-2 mt-auto">
                <Link
                  href={`/dashboard/bots/${bot.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-foreground text-background font-mono text-xs font-bold uppercase py-3 hover:bg-primary transition-colors"
                >
                  <Settings size={14} /> Configure
                </Link>
                <button
                  onClick={() => handleDelete(bot.id)}
                  disabled={deleting === bot.id}
                  className={cn(
                    "w-full border py-2 font-mono text-[10px] uppercase transition-colors flex items-center justify-center gap-2",
                    confirmDelete === bot.id
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-border text-red-500 hover:bg-red-500/10",
                  )}
                >
                  {deleting === bot.id
                    ? <RefreshCw size={12} className="animate-spin" />
                    : <><Trash2 size={12} /> {confirmDelete === bot.id ? 'Confirm Remove' : 'Remove Instance'}</>}
                </button>
                {confirmDelete === bot.id && (
                  <button onClick={() => setConfirmDelete(null)} className="w-full font-mono text-[10px] uppercase text-muted-foreground hover:text-white transition-colors py-1">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
