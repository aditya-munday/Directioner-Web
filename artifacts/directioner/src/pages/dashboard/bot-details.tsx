import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { useServers, useMemoryNodes, useActivityFeed, addMemoryNode, deleteMemoryNode, updateServer } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { ChevronRight, Settings, Hash, Mic, Brain, Lock, FileText, ShieldAlert, Database, Save, Trash2, Power, RefreshCw, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "@/lib/utils";

const TABS = [
  { id: "overview",     label: "Overview",     icon: Settings },
  { id: "channels",     label: "Channels",     icon: Hash },
  { id: "voice",        label: "Voice",        icon: Mic },
  { id: "ai",           label: "AI Settings",  icon: Brain },
  { id: "memory",       label: "Memory",       icon: Database },
  { id: "logs",         label: "Activity",     icon: FileText },
  { id: "privacy",      label: "Privacy",      icon: Lock },
  { id: "permissions",  label: "Permissions",  icon: ShieldAlert },
] as const;

type TabId = typeof TABS[number]['id'];

const AI_MODES = ['chat', 'tutor', 'coder', 'chaos', 'creative', 'debate'];

const ALL_CHANNELS = ['#general', '#bot-commands', '#help', '#coding', '#voice-text', '#off-topic', '#announcements', '#study'];
const DEFAULT_CHANNEL_ENABLED = new Set(['#general', '#bot-commands', '#help', '#coding']);

const DEFAULT_VOICE_SETTINGS = {
  'Auto-join on member activity': true,
  'Auto-leave when channel empty': true,
  'Wake word detection': false,
  'Push-to-talk mode': false,
};

const DEFAULT_PRIVACY_SETTINGS = {
  'Ephemeral responses (Whisper mode)': false,
  'DM long responses': false,
  'Log all interactions': true,
  'Share anonymized analytics': true,
};

export default function BotDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: servers = [], loading: serversLoading, refetch } = useServers(user?.id);
  const bot = servers.find(s => s.id === id) ?? servers[0];

  usePageTitle(`${bot?.server_name ?? 'Bot'} Settings`);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [saving, setSaving] = useState(false);
  const [newMemory, setNewMemory] = useState('');
  const [addingMem, setAddingMem] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [enabledChannels, setEnabledChannels] = useState<Set<string>>(DEFAULT_CHANNEL_ENABLED);
  const [voiceSettings, setVoiceSettings] = useState<Record<string, boolean>>(DEFAULT_VOICE_SETTINGS);
  const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>(DEFAULT_PRIVACY_SETTINGS);

  const triggerAction = (label: string) => {
    setActionFeedback(label);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const toggleChannel = (ch: string) => {
    setEnabledChannels(prev => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch); else next.add(ch);
      return next;
    });
  };

  const { data: memories = [], loading: memLoading, refetch: refetchMem } = useMemoryNodes(user?.id, bot?.id);
  const { data: activityFeed = [], loading: actLoading } = useActivityFeed(user?.id, 20);
  const botActivity = activityFeed.filter(a => !bot || a.server_id === bot.id);

  const handleToggle = async () => {
    if (!bot) return;
    setSaving(true);
    const newStatus = bot.status === 'online' ? 'offline' : 'online';
    await updateServer(bot.id, { status: newStatus });
    await refetch();
    setSaving(false);
  };

  const handleModeChange = async (mode: string) => {
    if (!bot) return;
    await updateServer(bot.id, { ai_mode: mode });
    await refetch();
  };

  const handleAddMemory = async () => {
    if (!newMemory.trim() || !user || !bot) return;
    setAddingMem(true);
    await addMemoryNode(user.id, bot.id, newMemory.trim());
    setNewMemory('');
    await refetchMem();
    setAddingMem(false);
  };

  const handleDeleteMemory = async (nodeId: string) => {
    await deleteMemoryNode(nodeId);
    await refetchMem();
  };

  if (serversLoading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw size={24} className="animate-spin text-muted-foreground" /></div>;
  }

  if (!bot) {
    return <div className="text-center pt-24 font-mono text-muted-foreground uppercase">// Bot not found</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <Link href="/dashboard/bots" className="hover:text-primary transition-colors">Bots</Link>
        <ChevronRight size={14} />
        <span className="text-white">{bot.server_name}</span>
      </div>

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase mb-2 text-white">{bot.server_name}</h1>
          <div className="flex items-center gap-4 font-mono text-xs uppercase flex-wrap">
            <span className="text-primary">ID: {bot.id.slice(0, 8)}…</span>
            <span className="border border-border bg-card px-2 py-0.5">{bot.tier} Plan</span>
            <span className="border border-primary/30 bg-primary/10 text-primary px-2 py-0.5">/{bot.ai_mode}</span>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={saving}
          className={cn("flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase font-bold transition-colors border",
            bot.status === 'online' ? "bg-accent/10 border-accent text-accent" : "bg-card border-border text-muted-foreground hover:bg-white/5"
          )}
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Power size={14} />}
          {bot.status === 'online' ? "Online" : "Offline"}
        </button>
      </header>

      {/* Stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Members", value: bot.member_count },
          { label: "Channels", value: bot.channel_count },
          { label: "Memory Nodes", value: memories.length },
          { label: "Activity Events", value: botActivity.length },
        ].map((s, i) => (
          <div key={i} className="bg-blueprint border border-white/10 p-4">
            <div className="font-mono text-[10px] uppercase text-blueprint-foreground opacity-60 mb-2">{s.label}</div>
            <div className="text-2xl font-display font-black text-white"><CountUpNumber target={s.value} /></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-0 border-b border-border overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase whitespace-nowrap transition-colors border-b-2 -mb-px",
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
              )}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pt-8"
          >
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 border border-border bg-card p-6">
                  <h3 className="font-mono text-xs text-primary font-bold uppercase">Server Info</h3>
                  {[
                    { k: "Server Name", v: bot.server_name },
                    { k: "Discord ID", v: bot.discord_server_id },
                    { k: "Status", v: bot.status },
                    { k: "AI Mode", v: `/${bot.ai_mode}` },
                    { k: "Plan", v: bot.tier },
                    { k: "Added", v: new Date(bot.created_at).toLocaleDateString() },
                  ].map(r => (
                    <div key={r.k} className="flex justify-between font-mono text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">{r.k}</span>
                      <span className="text-white">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 border border-border bg-card p-6">
                  <h3 className="font-mono text-xs text-primary font-bold uppercase">Quick Actions</h3>
                  {actionFeedback && (
                    <div className="p-2 border border-accent/50 bg-accent/10 text-accent font-mono text-[10px] uppercase">
                      // {actionFeedback} — executed
                    </div>
                  )}
                  {[
                    { label: "Restart Bot Instance", desc: "Restart the Discord connection" },
                    { label: "Clear Context Memory", desc: "Wipe active conversation cache" },
                    { label: "Export Bot Data", desc: "Download all memory and logs" },
                    { label: "Run Diagnostics", desc: "Test connection and response time" },
                  ].map(a => (
                    <button key={a.label} onClick={() => triggerAction(a.label)} className="w-full text-left border border-border p-4 hover:border-primary/50 hover:bg-white/5 transition-colors group">
                      <div className="font-mono text-xs font-bold uppercase text-white group-hover:text-primary transition-colors">{a.label}</div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-1">{a.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI SETTINGS */}
            {activeTab === "ai" && (
              <div className="space-y-6 border border-border bg-card p-8">
                <h3 className="font-mono text-xs text-primary font-bold uppercase pb-2 border-b border-border">// AI Configuration</h3>
                <div>
                  <label className="font-mono text-xs uppercase text-muted-foreground block mb-3">Active Mode</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AI_MODES.map(mode => (
                      <button
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        className={cn("border px-4 py-3 font-mono text-xs uppercase transition-colors text-left",
                          bot.ai_mode === mode ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:text-white hover:border-white/20"
                        )}
                      >
                        /{mode}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { label: "Response Length", options: ["Short", "Medium", "Long"], current: 1 },
                  { label: "Temperature (Creativity)", type: "range" },
                  { label: "Context Window", options: ["4k", "8k", "16k", "32k"], current: 2 },
                ].map(s => (
                  <div key={s.label}>
                    <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">{s.label}</label>
                    {s.type === "range" ? (
                      <div className="flex items-center gap-4">
                        <input type="range" min="0" max="200" defaultValue="70" className="flex-1 accent-yellow-400" />
                        <span className="font-mono text-xs text-primary w-8">0.7</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {s.options?.map((o, i) => (
                          <button key={o} className={cn("px-4 py-2 font-mono text-xs border transition-colors",
                            i === s.current ? "bg-primary text-black border-primary" : "border-border text-muted-foreground hover:text-white"
                          )}>{o}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* MEMORY */}
            {activeTab === "memory" && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <input
                    value={newMemory}
                    onChange={e => setNewMemory(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddMemory()}
                    placeholder="Add a memory node… (e.g. User @Admin prefers formal tone)"
                    className="flex-1 bg-background border border-border px-4 py-3 font-mono text-xs focus:outline-none focus:border-primary"
                  />
                  <button onClick={handleAddMemory} disabled={addingMem || !newMemory.trim()} className="bg-primary text-black px-6 py-3 font-mono text-xs font-bold uppercase hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50">
                    {addingMem ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                    Add
                  </button>
                </div>
                {memLoading ? (
                  <div className="flex items-center justify-center h-32"><RefreshCw size={20} className="animate-spin text-muted-foreground" /></div>
                ) : memories.length === 0 ? (
                  <div className="border border-border p-12 text-center font-mono text-xs text-muted-foreground uppercase">
                    // No memory nodes yet — add your first one above
                  </div>
                ) : (
                  <div className="border border-border bg-card overflow-hidden">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="border-b border-border bg-background">
                        <tr>
                          <th className="p-4 font-normal text-muted-foreground uppercase">Content</th>
                          <th className="p-4 font-normal text-muted-foreground uppercase">Scope</th>
                          <th className="p-4 font-normal text-muted-foreground uppercase">Created</th>
                          <th className="p-4" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {memories.map(m => (
                          <tr key={m.id} className="hover:bg-white/5">
                            <td className="p-4 text-white max-w-xs truncate">{m.content}</td>
                            <td className="p-4">
                              <span className={cn("uppercase text-[10px] px-2 py-0.5 border",
                                m.scope === 'global' ? "border-primary/30 text-primary" : m.scope === 'user' ? "border-accent/30 text-accent" : "border-border text-muted-foreground"
                              )}>{m.scope}</span>
                            </td>
                            <td className="p-4 text-muted-foreground">{formatDistanceToNow(m.created_at)}</td>
                            <td className="p-4">
                              <button onClick={() => handleDeleteMemory(m.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
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

            {/* ACTIVITY LOGS */}
            {activeTab === "logs" && (
              <div className="border border-border bg-card overflow-hidden">
                <div className="border-b border-border p-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-primary uppercase font-bold">Recent Activity — {bot.server_name}</span>
                  <span className={cn("font-mono text-[10px] uppercase flex items-center gap-1", actLoading ? "text-muted-foreground" : "text-accent")}>
                    <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                    Live
                  </span>
                </div>
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      <th className="p-4 font-normal text-muted-foreground uppercase">Time</th>
                      <th className="p-4 font-normal text-muted-foreground uppercase">Event</th>
                      <th className="p-4 font-normal text-muted-foreground uppercase">Channel</th>
                      <th className="p-4 font-normal text-muted-foreground uppercase">Actor</th>
                      <th className="p-4 font-normal text-muted-foreground uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {actLoading ? (
                      <tr><td colSpan={5} className="p-8 text-center"><RefreshCw size={16} className="animate-spin text-muted-foreground mx-auto" /></td></tr>
                    ) : botActivity.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">// No activity yet</td></tr>
                    ) : (
                      botActivity.map(ev => (
                        <tr key={ev.id} className="hover:bg-white/5">
                          <td className="p-4 text-muted-foreground whitespace-nowrap">{formatDistanceToNow(ev.created_at)}</td>
                          <td className="p-4 text-primary capitalize">{ev.event_type.replace(/_/g,' ')}</td>
                          <td className="p-4 text-accent">{ev.channel ?? '—'}</td>
                          <td className="p-4 text-white">{ev.actor ?? '—'}</td>
                          <td className="p-4 text-muted-foreground max-w-xs truncate">{ev.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* CHANNELS */}
            {activeTab === "channels" && (
              <div className="space-y-4">
                <p className="font-mono text-xs text-muted-foreground uppercase">Select channels where the bot is allowed to respond.</p>
                <div className="border border-border bg-card">
                  {ALL_CHANNELS.map((ch) => {
                    const on = enabledChannels.has(ch);
                    return (
                      <div key={ch} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-white/5">
                        <span className="font-mono text-sm text-white">{ch}</span>
                        <button onClick={() => toggleChannel(ch)} className={cn("w-12 h-6 border transition-colors relative shrink-0", on ? "bg-primary border-primary" : "bg-background border-border")}>
                          <div className={cn("absolute top-1 w-4 h-4 bg-black transition-all", on ? "left-7" : "left-1")} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PERMISSIONS */}
            {activeTab === "permissions" && (
              <div className="space-y-4 border border-border bg-card p-6">
                <h3 className="font-mono text-xs text-primary font-bold uppercase pb-2 border-b border-border">// Permission Checklist</h3>
                {[
                  { label: "Send Messages", desc: "Reply in text channels", granted: true, required: true },
                  { label: "Read Message History", desc: "Access context from prior messages", granted: true, required: true },
                  { label: "Connect (Voice)", desc: "Join voice channels", granted: true, required: false },
                  { label: "Speak (Voice)", desc: "Send audio in voice channels", granted: true, required: false },
                  { label: "Embed Links", desc: "Send rich embeds and cards", granted: true, required: false },
                  { label: "Manage Messages", desc: "Delete messages when moderation is enabled", granted: false, required: false },
                  { label: "Kick Members", desc: "Required for moderation features", granted: false, required: false },
                  { label: "Administrator", desc: "Full server access (not recommended)", granted: false, required: false },
                ].map(p => (
                  <div key={p.label} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-mono text-sm text-white">{p.label}</div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{p.desc}</div>
                      {p.required && <span className="font-mono text-[9px] text-red-400 uppercase">Required</span>}
                    </div>
                    <span className={cn("font-mono text-[10px] uppercase px-2 py-1 border shrink-0",
                      p.granted ? "border-accent/30 bg-accent/10 text-accent" : "border-border text-muted-foreground"
                    )}>{p.granted ? "Granted" : "Missing"}</span>
                  </div>
                ))}
              </div>
            )}

            {/* VOICE */}
            {activeTab === "voice" && (
              <div className="space-y-6 border border-border bg-card p-8">
                <h3 className="font-mono text-xs text-primary font-bold uppercase pb-2 border-b border-border">// Voice Configuration</h3>
                {[
                  { label: "Auto-join on member activity", type: "toggle" },
                  { label: "Auto-leave when channel empty", type: "toggle" },
                  { label: "Wake word detection", type: "toggle" },
                  { label: "Push-to-talk mode", type: "toggle" },
                  { label: "Voice volume", type: "range" },
                  { label: "Idle leave delay (minutes)", type: "number" },
                ].map(s => {
                  const on = voiceSettings[s.label] ?? false;
                  return (
                    <div key={s.label} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <label className="font-mono text-sm text-white">{s.label}</label>
                      {s.type === 'toggle' && (
                        <button onClick={() => setVoiceSettings(p => ({ ...p, [s.label]: !on }))} className={cn("relative w-12 h-6 border transition-colors shrink-0", on ? "bg-primary border-primary" : "bg-background border-border")}>
                          <div className={cn("absolute top-1 w-4 h-4 bg-black transition-all", on ? "left-7" : "left-1")} />
                        </button>
                      )}
                      {s.type === 'range' && <input type="range" min="0" max="200" defaultValue="100" className="w-32 accent-yellow-400" />}
                      {s.type === 'number' && <input type="number" defaultValue={5} className="w-20 bg-background border border-border px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-primary text-center" />}
                    </div>
                  );
                })}
                <button className="bg-primary text-black font-mono font-bold px-6 py-3 uppercase text-xs corner-brackets hover:bg-white transition-colors flex items-center gap-2">
                  <Save size={12} /> Save Voice Settings
                </button>
              </div>
            )}

            {/* PRIVACY */}
            {activeTab === "privacy" && (
              <div className="space-y-6 border border-border bg-card p-8">
                <h3 className="font-mono text-xs text-primary font-bold uppercase pb-2 border-b border-border">// Privacy & Data</h3>
                {[
                  { label: "Ephemeral responses (Whisper mode)", desc: "Only the requester sees bot replies" },
                  { label: "DM long responses", desc: "Send lengthy replies via Direct Message" },
                  { label: "Log all interactions", desc: "Store full message history for this server" },
                  { label: "Share anonymized analytics", desc: "Help improve Directioner (no PII)" },
                ].map(s => {
                  const on = privacySettings[s.label] ?? false;
                  return (
                    <div key={s.label} className="flex items-start justify-between border-b border-border pb-4 last:border-0">
                      <div>
                        <div className="font-mono text-sm text-white">{s.label}</div>
                        <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.desc}</div>
                      </div>
                      <button onClick={() => setPrivacySettings(p => ({ ...p, [s.label]: !on }))} className={cn("relative w-12 h-6 border transition-colors shrink-0 ml-4", on ? "bg-primary border-primary" : "bg-background border-border")}>
                        <div className={cn("absolute top-1 w-4 h-4 bg-black transition-all", on ? "left-7" : "left-1")} />
                      </button>
                    </div>
                  );
                })}
                <div className="border border-red-500/30 bg-red-500/5 p-4">
                  <div className="font-mono text-xs text-red-400 uppercase mb-2">Danger Zone</div>
                  <button className="border border-red-500 text-red-400 font-mono text-xs uppercase px-4 py-2 hover:bg-red-500/10 transition-colors">
                    Delete All Server Data
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
