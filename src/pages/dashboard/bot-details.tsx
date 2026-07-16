import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { useServers, useMemoryNodes, useActivityFeed, addMemoryNode, deleteMemoryNode, updateServer } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { ChevronRight, Settings, Hash, Mic, Brain, Lock, FileText, ShieldAlert, Database, Save, Trash2, Power, RefreshCw, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { formatDistanceToNow } from "@/lib/utils";

const BORDER = "rgba(255,255,255,0.06)";
const CARD   = "#0f0f12";
const YELLOW = "#FFE500";

const TABS = [
  { id: "overview",    label: "Overview",     icon: Settings    },
  { id: "channels",    label: "Channels",     icon: Hash        },
  { id: "voice",       label: "Voice",        icon: Mic         },
  { id: "ai",          label: "AI Settings",  icon: Brain       },
  { id: "memory",      label: "Memory",       icon: Database    },
  { id: "logs",        label: "Activity",     icon: FileText    },
  { id: "privacy",     label: "Privacy",      icon: Lock        },
  { id: "permissions", label: "Permissions",  icon: ShieldAlert },
] as const;
type TabId = typeof TABS[number]["id"];

const AI_MODES = ["chat", "tutor", "coder", "chaos", "creative", "debate"];
const ALL_CHANNELS = ["#general", "#bot-commands", "#help", "#coding", "#voice-text", "#off-topic", "#announcements", "#study"];
const DEFAULT_CHANNELS = new Set(["#general", "#bot-commands", "#help", "#coding"]);
const DEFAULT_VOICE = { "Auto-join on member activity": true, "Auto-leave when channel empty": true, "Wake word detection": false, "Push-to-talk mode": false };
const DEFAULT_PRIVACY = { "Ephemeral responses (Whisper mode)": false, "DM long responses": false, "Log all interactions": true, "Share anonymized analytics": true };

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative shrink-0 transition-colors ml-4"
      style={{ width: 44, height: 24, background: on ? YELLOW : "rgba(255,255,255,0.08)", border: `1px solid ${on ? YELLOW : BORDER}` }}>
      <div className="absolute top-1 w-4 h-4 transition-all"
        style={{ left: on ? "calc(100% - 20px)" : 4, background: on ? "#000" : "rgba(255,255,255,0.4)" }} />
    </button>
  );
}

const fieldStyle = { background: "#070708", border: "1px solid rgba(255,255,255,0.08)" };

export default function BotDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: servers = [], loading: serversLoading, refetch } = useServers(user?.id);
  const bot = servers.find(s => s.id === id) ?? servers[0];

  usePageTitle(`${bot?.server_name ?? "Bot"} Settings`);
  const [activeTab, setActiveTab]             = useState<TabId>("overview");
  const [saving, setSaving]                   = useState(false);
  const [newMemory, setNewMemory]             = useState("");
  const [addingMem, setAddingMem]             = useState(false);
  const [actionFeedback, setActionFeedback]   = useState<string | null>(null);
  const [enabledChannels, setEnabledChannels] = useState<Set<string>>(DEFAULT_CHANNELS);
  const [voiceSettings, setVoiceSettings]     = useState<Record<string, boolean>>(DEFAULT_VOICE);
  const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>(DEFAULT_PRIVACY);

  const triggerAction = (label: string) => { setActionFeedback(label); setTimeout(() => setActionFeedback(null), 2000); };
  const toggleChannel = (ch: string) => {
    setEnabledChannels(prev => { const n = new Set(prev); n.has(ch) ? n.delete(ch) : n.add(ch); return n; });
  };

  const { data: memories = [], loading: memLoading, refetch: refetchMem } = useMemoryNodes(user?.id, bot?.id);
  const { data: activityFeed = [], loading: actLoading } = useActivityFeed(user?.id, 20);
  const botActivity = activityFeed.filter(a => !bot || a.server_id === bot.id);

  const handleToggle = async () => {
    if (!bot) return; setSaving(true);
    await updateServer(bot.id, user?.id ?? '', { status: bot.status === "online" ? "offline" : "online" });
    await refetch(); setSaving(false);
  };

  const handleModeChange = async (mode: string) => {
    if (!bot) return;
    await updateServer(bot.id, user?.id ?? '', { ai_mode: mode }); await refetch();
  };

  const handleAddMemory = async () => {
    if (!newMemory.trim() || !user || !bot) return;
    setAddingMem(true);
    await addMemoryNode(user.id, bot.id, newMemory.trim());
    setNewMemory(""); await refetchMem(); setAddingMem(false);
  };

  const handleDeleteMemory = async (memId: string) => {
    if (!user || !bot) return;
    await deleteMemoryNode(memId, user?.id ?? '');
    await refetchMem();
  };

  if (serversLoading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw size={22} className="animate-spin" style={{ color: "rgba(255,255,255,0.25)" }} />
    </div>
  );

  if (!bot) return (
    <div className="text-center pt-24 font-mono text-xs uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
      // Bot not found
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase"
        style={{ color: "rgba(255,255,255,0.3)" }}>
        <Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/bots" className="transition-colors hover:text-white">Bots</Link>
        <ChevronRight size={12} />
        <span className="text-white">{bot.server_name}</span>
      </div>

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6"
        style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <h1 className="font-display font-bold text-white leading-none mb-3"
            style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.03em" }}>
            {bot.server_name}
          </h1>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase flex-wrap">
            <span style={{ color: YELLOW }}>ID: {bot.id.slice(0, 8)}…</span>
            <span className="px-2 py-0.5" style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
              {bot.tier} Plan
            </span>
            <span className="px-2 py-0.5" style={{ border: `1px solid rgba(255,229,0,0.3)`, background: "rgba(255,229,0,0.06)", color: YELLOW }}>
              /{bot.ai_mode}
            </span>
          </div>
        </div>
        <button
          onClick={handleToggle} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase font-bold transition-all"
          style={bot.status === "online"
            ? { border: "1px solid rgba(16,185,129,0.4)", color: "#10b981", background: "rgba(16,185,129,0.06)" }
            : { border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Power size={14} />}
          {bot.status === "online" ? "Online" : "Offline"}
        </button>
      </header>

      {/* Stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Members",        value: bot.member_count,   color: "#0ea5e9" },
          { label: "Channels",       value: bot.channel_count,  color: "#a855f7" },
          { label: "Memory Nodes",   value: memories.length,    color: YELLOW    },
          { label: "Activity Events", value: botActivity.length, color: "#10b981" },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-lg"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
            <div className="font-display font-bold text-white" style={{ fontSize: 32, lineHeight: 1, color: s.color }}>
              <CountUpNumber target={s.value} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-0 overflow-x-auto" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-3 font-mono text-[10px] uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 -mb-px"
              style={{
                borderColor: activeTab === tab.id ? YELLOW : "transparent",
                color: activeTab === tab.id ? YELLOW : "rgba(255,255,255,0.38)",
              }}>
              <tab.icon size={11} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pt-8">

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-6 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-4 pb-3"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>Server Info</div>
                  {[
                    { k: "Server Name", v: bot.server_name },
                    { k: "Discord ID",  v: bot.discord_server_id },
                    { k: "Status",      v: bot.status },
                    { k: "AI Mode",     v: `/${bot.ai_mode}` },
                    { k: "Plan",        v: bot.tier },
                    { k: "Added",       v: new Date(bot.created_at).toLocaleDateString() },
                  ].map(r => (
                    <div key={r.k} className="flex justify-between font-mono text-xs py-3"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{r.k}</span>
                      <span className="text-white">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-4 pb-3"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>Quick Actions</div>
                  {actionFeedback && (
                    <div className="p-3 mb-4 font-mono text-[10px] uppercase rounded"
                      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                      // {actionFeedback} — executed
                    </div>
                  )}
                  {[
                    { label: "Restart Bot Instance",  desc: "Restart the Discord connection" },
                    { label: "Clear Context Memory",   desc: "Wipe active conversation cache" },
                    { label: "Export Bot Data",        desc: "Download all memory and logs" },
                    { label: "Run Diagnostics",        desc: "Test connection and response time" },
                  ].map(a => (
                    <button key={a.label} onClick={() => triggerAction(a.label)}
                      className="w-full text-left p-4 rounded-lg mb-2 transition-all group"
                      style={{ border: `1px solid ${BORDER}`, background: "transparent" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${YELLOW}30`; (e.currentTarget as HTMLElement).style.background = "rgba(255,229,0,0.03)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <div className="font-mono text-xs font-bold uppercase text-white mb-0.5">{a.label}</div>
                      <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{a.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI SETTINGS */}
            {activeTab === "ai" && (
              <div className="p-8 rounded-xl space-y-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="font-mono text-[10px] uppercase tracking-widest pb-3"
                  style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>AI Configuration</div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest block mb-3"
                    style={{ color: "rgba(255,255,255,0.35)" }}>Active Mode</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AI_MODES.map(mode => (
                      <button key={mode} onClick={() => handleModeChange(mode)}
                        className="px-4 py-3 font-mono text-xs uppercase text-left transition-all"
                        style={bot.ai_mode === mode
                          ? { background: "rgba(255,229,0,0.1)", border: `1px solid rgba(255,229,0,0.4)`, color: YELLOW, fontWeight: "bold" }
                          : { border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                        /{mode}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { label: "Response Length",           options: ["Short", "Medium", "Long"], current: 1 },
                  { label: "Context Window",             options: ["4k", "8k", "16k", "32k"], current: 2 },
                ].map(s => (
                  <div key={s.label}>
                    <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</label>
                    <div className="flex gap-2">
                      {s.options.map((o, i) => (
                        <button key={o}
                          className="px-4 py-2 font-mono text-xs transition-all"
                          style={i === s.current
                            ? { background: YELLOW, color: "#000", fontWeight: "bold" }
                            : { border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                    style={{ color: "rgba(255,255,255,0.35)" }}>Temperature (Creativity)</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="0" max="200" defaultValue="70" className="flex-1"
                      style={{ accentColor: YELLOW }} />
                    <span className="font-mono text-xs w-8" style={{ color: YELLOW }}>0.7</span>
                  </div>
                </div>
              </div>
            )}

            {/* MEMORY */}
            {activeTab === "memory" && (
              <div className="space-y-5">
                <div className="flex gap-2">
                  <input value={newMemory} onChange={e => setNewMemory(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddMemory()}
                    placeholder="Add a memory node… (e.g. User @Admin prefers formal tone)"
                    className="flex-1 px-4 py-3 font-mono text-xs text-white focus:outline-none transition-colors"
                    style={fieldStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }} />
                  <button onClick={handleAddMemory} disabled={addingMem || !newMemory.trim()}
                    className="px-6 font-mono font-bold text-xs uppercase flex items-center gap-2 disabled:opacity-50"
                    style={{ background: YELLOW, color: "#000" }}>
                    {addingMem ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />} Add
                  </button>
                </div>
                {memLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw size={20} className="animate-spin" style={{ color: "rgba(255,255,255,0.25)" }} />
                  </div>
                ) : memories.length === 0 ? (
                  <div className="py-14 text-center font-mono text-xs rounded-lg"
                    style={{ border: `1px dashed ${BORDER}`, color: "rgba(255,255,255,0.2)" }}>
                    // No memory nodes yet — add your first one above
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                    <table className="w-full text-left font-mono text-xs">
                      <thead style={{ background: "#070708", borderBottom: `1px solid ${BORDER}` }}>
                        <tr>
                          {["Content", "Scope", "Created", ""].map(h => (
                            <th key={h} className="p-4 font-normal uppercase tracking-widest"
                              style={{ color: "rgba(255,255,255,0.25)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {memories.map((m, i) => (
                          <tr key={m.id} className="transition-colors"
                            style={{ borderTop: `1px solid rgba(255,255,255,0.04)`, background: i % 2 === 0 ? CARD : "transparent" }}>
                            <td className="p-4 text-white max-w-xs truncate">{m.content}</td>
                            <td className="p-4">
                              <span className="font-mono text-[9px] uppercase px-2 py-0.5"
                                style={{
                                  border: `1px solid ${m.scope === "global" ? `rgba(255,229,0,0.3)` : m.scope === "user" ? "rgba(16,185,129,0.3)" : BORDER}`,
                                  color: m.scope === "global" ? YELLOW : m.scope === "user" ? "#10b981" : "rgba(255,255,255,0.35)",
                                }}>
                                {m.scope}
                              </span>
                            </td>
                            <td className="p-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                              {formatDistanceToNow(m.created_at)}
                            </td>
                            <td className="p-4">
                              <button onClick={() => handleDeleteMemory(m.id)} className="transition-colors"
                                style={{ color: "rgba(255,255,255,0.3)" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f43f5e"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* LOGS */}
            {activeTab === "logs" && (
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between p-4 pb-3"
                  style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: YELLOW }}>
                    Recent Activity — {bot.server_name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
                    <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#10b981" }}>Live</span>
                  </div>
                </div>
                <table className="w-full text-left font-mono text-xs">
                  <thead style={{ background: "#070708", borderBottom: `1px solid ${BORDER}` }}>
                    <tr>
                      {["Time", "Event", "Channel", "Actor", "Details"].map(h => (
                        <th key={h} className="p-4 font-normal uppercase tracking-widest"
                          style={{ color: "rgba(255,255,255,0.25)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {actLoading ? (
                      <tr><td colSpan={5} className="p-10 text-center">
                        <RefreshCw size={16} className="animate-spin mx-auto" style={{ color: "rgba(255,255,255,0.25)" }} />
                      </td></tr>
                    ) : botActivity.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center font-mono text-xs"
                        style={{ color: "rgba(255,255,255,0.2)" }}>// No activity yet</td></tr>
                    ) : botActivity.map((ev, i) => (
                      <tr key={ev.id} style={{ borderTop: `1px solid rgba(255,255,255,0.04)`, background: i % 2 === 0 ? CARD : "transparent" }}>
                        <td className="p-4 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.35)" }}>{formatDistanceToNow(ev.created_at)}</td>
                        <td className="p-4 capitalize" style={{ color: YELLOW }}>{ev.event_type.replace(/_/g, " ")}</td>
                        <td className="p-4" style={{ color: "#10b981" }}>{ev.channel ?? "—"}</td>
                        <td className="p-4 text-white">{ev.actor ?? "—"}</td>
                        <td className="p-4 max-w-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{ev.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CHANNELS */}
            {activeTab === "channels" && (
              <div className="space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Select channels where the bot is allowed to respond.
                </p>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                  {ALL_CHANNELS.map((ch, i) => {
                    const on = enabledChannels.has(ch);
                    return (
                      <div key={ch}
                        className="flex items-center justify-between p-4 transition-colors"
                        style={{ background: on ? "rgba(255,229,0,0.03)" : i % 2 === 0 ? CARD : "transparent", borderBottom: i < ALL_CHANNELS.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                        <span className="font-mono text-sm" style={{ color: on ? "#fff" : "rgba(255,255,255,0.5)" }}>{ch}</span>
                        <button onClick={() => toggleChannel(ch)} className="relative shrink-0 transition-colors"
                          style={{ width: 44, height: 24, background: on ? YELLOW : "rgba(255,255,255,0.08)", border: `1px solid ${on ? YELLOW : BORDER}` }}>
                          <div className="absolute top-1 w-4 h-4 transition-all"
                            style={{ left: on ? "calc(100% - 20px)" : 4, background: on ? "#000" : "rgba(255,255,255,0.4)" }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VOICE */}
            {activeTab === "voice" && (
              <div className="p-8 rounded-xl space-y-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="font-mono text-[10px] uppercase tracking-widest pb-3"
                  style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>Voice Configuration</div>
                {[
                  { label: "Auto-join on member activity",   type: "toggle" },
                  { label: "Auto-leave when channel empty",  type: "toggle" },
                  { label: "Wake word detection",            type: "toggle" },
                  { label: "Push-to-talk mode",              type: "toggle" },
                  { label: "Voice volume",                   type: "range"  },
                  { label: "Idle leave delay (minutes)",     type: "number" },
                ].map(s => {
                  const on = voiceSettings[s.label] ?? false;
                  return (
                    <div key={s.label} className="flex items-center justify-between py-4"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <label className="font-mono text-sm text-white">{s.label}</label>
                      {s.type === "toggle" && <Toggle on={on} onChange={() => setVoiceSettings(p => ({ ...p, [s.label]: !on }))} />}
                      {s.type === "range" && <input type="range" min="0" max="200" defaultValue="100" className="w-28" style={{ accentColor: YELLOW }} />}
                      {s.type === "number" && (
                        <input type="number" defaultValue={5}
                          className="w-16 px-3 py-1.5 font-mono text-xs text-center focus:outline-none"
                          style={{ background: "#070708", border: `1px solid ${BORDER}`, color: "#fff" }} />
                      )}
                    </div>
                  );
                })}
                <button className="flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-6 py-3 mt-2"
                  style={{ background: YELLOW, color: "#000" }}>
                  <Save size={13} /> Save Voice Settings
                </button>
              </div>
            )}

            {/* PRIVACY */}
            {activeTab === "privacy" && (
              <div className="p-8 rounded-xl space-y-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="font-mono text-[10px] uppercase tracking-widest pb-3"
                  style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>Privacy & Data</div>
                {[
                  { label: "Ephemeral responses (Whisper mode)", desc: "Only the requester sees bot replies" },
                  { label: "DM long responses",                   desc: "Send lengthy replies via Direct Message" },
                  { label: "Log all interactions",                desc: "Store full message history for this server" },
                  { label: "Share anonymized analytics",          desc: "Help improve Directioner (no PII)" },
                ].map(s => {
                  const on = privacySettings[s.label] ?? false;
                  return (
                    <div key={s.label} className="flex items-start justify-between py-4"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <div>
                        <div className="font-mono text-sm text-white mb-0.5">{s.label}</div>
                        <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
                      </div>
                      <Toggle on={on} onChange={() => setPrivacySettings(p => ({ ...p, [s.label]: !on }))} />
                    </div>
                  );
                })}
                <div className="p-5 rounded-lg mt-4" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.25)" }}>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "#f43f5e" }}>Danger Zone</div>
                  <button className="font-mono text-xs uppercase tracking-wide px-5 py-2.5 transition-all"
                    style={{ border: "1px solid rgba(244,63,94,0.5)", color: "#f43f5e" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    Delete All Server Data
                  </button>
                </div>
              </div>
            )}

            {/* PERMISSIONS */}
            {activeTab === "permissions" && (
              <div className="p-8 rounded-xl space-y-2" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="font-mono text-[10px] uppercase tracking-widest pb-3 mb-3"
                  style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>Permission Checklist</div>
                {[
                  { label: "Send Messages",       desc: "Reply in text channels",               granted: true,  required: true  },
                  { label: "Read Message History", desc: "Access context from prior messages",   granted: true,  required: true  },
                  { label: "Connect (Voice)",      desc: "Join voice channels",                  granted: true,  required: false },
                  { label: "Speak (Voice)",        desc: "Send audio in voice channels",         granted: true,  required: false },
                  { label: "Embed Links",          desc: "Send rich embeds and cards",           granted: true,  required: false },
                  { label: "Manage Messages",      desc: "Delete messages when moderation on",   granted: false, required: false },
                  { label: "Kick Members",         desc: "Required for moderation features",     granted: false, required: false },
                  { label: "Administrator",        desc: "Full server access (not recommended)", granted: false, required: false },
                ].map(p => (
                  <div key={p.label} className="flex items-start justify-between py-3.5"
                    style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <div>
                      <div className="font-mono text-sm text-white">{p.label}</div>
                      <div className="font-mono text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{p.desc}</div>
                      {p.required && <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#f43f5e" }}>Required</span>}
                    </div>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 ml-4 shrink-0"
                      style={p.granted
                        ? { border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.08)", color: "#10b981" }
                        : { border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.3)" }}>
                      {p.granted ? "Granted" : "Missing"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
