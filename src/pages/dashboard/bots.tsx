import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { useServers, deleteServer } from "@/lib/db";
import { Link } from "wouter";
import { EqualizerBars } from "@/components/animations";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { Plus, RefreshCw, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARD_BG = "#0f0f12";
const BORDER  = "rgba(255,255,255,0.06)";
const YELLOW  = "#FFE500";

export default function Bots() {
  usePageTitle("My Bots");
  const { user } = useAuth();
  const { data: servers = [], loading, refetch } = useServers(user?.id);
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const tierLimits: Record<string, number> = { free: 1, basic: 3, pro: 10, max: Infinity };
  const limit = tierLimits[user?.tier ?? "free"];

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) { setConfirmDelete(id); return; }
    setDeleting(id);
    setConfirmDelete(null);
    try { await deleteServer(id, user?.id ?? ''); await refetch(); }
    catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6"
        style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            MY BOTS — DEPLOYMENTS
          </div>
          <h1 className="font-display font-bold text-white leading-none"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
            {loading ? "Loading…" : `${servers.length} / ${limit === Infinity ? "∞" : limit} deployed`}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="p-3 transition-all"
            style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
          >
            <RefreshCw size={15} />
          </button>
          <Link href="/dashboard/onboarding"
            className="inline-flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wide px-5 py-3"
            style={{ background: YELLOW, color: "#000" }}>
            <Plus size={14} /> Deploy New
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg p-6 h-64 animate-pulse"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="w-11 h-11 rounded mb-5" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-4 rounded w-36 mb-2" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-3 rounded w-24" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>
      ) : servers.length === 0 ? (
        <div className="py-24 text-center rounded-lg" style={{ border: `1px dashed ${BORDER}` }}>
          <div className="font-mono text-xs uppercase mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>
            // NO BOTS DEPLOYED
          </div>
          <Link href="/dashboard/onboarding"
            className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-8 py-4"
            style={{ background: YELLOW, color: "#000" }}>
            Deploy Your First Bot
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {servers.map((bot, i) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg p-5 flex flex-col h-full transition-all"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${confirmDelete === bot.id ? "rgba(244,63,94,0.4)" : BORDER}`,
                }}
                onMouseEnter={e => {
                  if (confirmDelete !== bot.id) (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}25`;
                }}
                onMouseLeave={e => {
                  if (confirmDelete !== bot.id) (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 flex items-center justify-center font-display font-bold text-xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "#fff" }}>
                    {bot.server_name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 font-mono text-[9px] uppercase"
                    style={{
                      border: `1px solid ${bot.status === "online" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                      color:  bot.status === "online" ? "#10b981" : "#f43f5e",
                      background: bot.status === "online" ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
                    }}>
                    {bot.status === "online"
                      ? <><EqualizerBars className="w-3.5 h-3" /><span>Online</span></>
                      : <><div className="w-1.5 h-1.5" style={{ background: "#f43f5e" }} /><span>Offline</span></>}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex-1 mb-5">
                  <h3 className="font-display font-bold text-white text-xl uppercase mb-1 truncate">{bot.server_name}</h3>
                  <div className="font-mono text-[10px] uppercase mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {bot.member_count.toLocaleString()} members · {bot.channel_count} channels
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5"
                      style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.35)" }}>
                      {bot.tier}
                    </span>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5"
                      style={{ border: `1px solid rgba(255,229,0,0.25)`, color: YELLOW, background: "rgba(255,229,0,0.05)" }}>
                      /{bot.ai_mode}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-auto">
                  <Link href={`/dashboard/bots/${bot.id}`}
                    className="flex items-center justify-center gap-2 w-full font-mono font-bold text-xs uppercase tracking-wide py-2.5 transition-all"
                    style={{ background: "#fff", color: "#000" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = YELLOW; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                    <Settings size={13} /> Configure
                  </Link>
                  <button
                    onClick={() => handleDelete(bot.id)}
                    disabled={deleting === bot.id}
                    className="w-full flex items-center justify-center gap-2 font-mono text-[10px] uppercase py-2 transition-all"
                    style={{
                      border: `1px solid ${confirmDelete === bot.id ? "rgba(244,63,94,0.6)" : "rgba(244,63,94,0.2)"}`,
                      color: "#f43f5e",
                      background: confirmDelete === bot.id ? "rgba(244,63,94,0.1)" : "transparent",
                    }}
                  >
                    {deleting === bot.id
                      ? <RefreshCw size={12} className="animate-spin" />
                      : <><Trash2 size={12} /> {confirmDelete === bot.id ? "Confirm Remove" : "Remove"}</>}
                  </button>
                  {confirmDelete === bot.id && (
                    <button onClick={() => setConfirmDelete(null)}
                      className="w-full font-mono text-[9px] uppercase py-1 transition-colors"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}>
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
