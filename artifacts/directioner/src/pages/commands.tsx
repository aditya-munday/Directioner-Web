import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Typewriter } from "@/components/animations";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const commands = {
  "VOICE": [
    { cmd: "/join", desc: "Join your current voice channel", syntax: "/join [channel]" },
    { cmd: "/leave", desc: "Leave the voice channel", syntax: "/leave" },
    { cmd: "/move", desc: "Move to different voice channel", syntax: "/move [channel]" },
    { cmd: "/listen", desc: "Start listening mode only", syntax: "/listen" },
    { cmd: "/mute", desc: "Mute bot microphone", syntax: "/mute" },
    { cmd: "/unmute", desc: "Unmute bot microphone", syntax: "/unmute" },
    { cmd: "/stop", desc: "Stop voice activity", syntax: "/stop" },
    { cmd: "/volume", desc: "Set bot output volume", syntax: "/volume [0-200]" }
  ],
  "AI BEHAVIOR": [
    { cmd: "/chatmode", desc: "Switch bot persona", syntax: "/chatmode [chat|tutor|coder|chaos|creative|debate]" },
    { cmd: "/interrupt", desc: "Allow interrupting bot mid-response", syntax: "/interrupt [on|off]" },
    { cmd: "/autoreply", desc: "Toggle automatic reply in channels", syntax: "/autoreply [on|off]" },
    { cmd: "/personality", desc: "Set custom instructions", syntax: "/personality [preset|custom]" },
    { cmd: "/language", desc: "Set response language", syntax: "/language [code]" }
  ],
  "MEMORY": [
    { cmd: "/remember", desc: "Force bot to save a fact", syntax: "/remember [text]" },
    { cmd: "/forget", desc: "Delete a specific memory", syntax: "/forget [id]" },
    { cmd: "/memory", desc: "View or manage memories", syntax: "/memory [list|clear]" },
    { cmd: "/clearcontext", desc: "Wipe current conversation history", syntax: "/clearcontext" }
  ],
  "WHISPER / PRIVATE": [
    { cmd: "/whisper", desc: "Enable ephemeral responses", syntax: "/whisper [on|off]" },
    { cmd: "/dm", desc: "Send long responses via DM", syntax: "/dm [on|off]" }
  ],
  "SERVER SETUP": [
    { cmd: "/setup", desc: "Run setup wizard", syntax: "/setup" },
    { cmd: "/configure", desc: "Configure a setting", syntax: "/configure [setting] [value]" },
    { cmd: "/permissions", desc: "Check bot permissions", syntax: "/permissions" },
    { cmd: "/channels", desc: "Manage active channels", syntax: "/channels" },
    { cmd: "/voicechannel", desc: "Set default voice channel", syntax: "/voicechannel [channel]" }
  ],
  "ADMIN": [
    { cmd: "/enable", desc: "Enable a feature", syntax: "/enable [feature]" },
    { cmd: "/disable", desc: "Disable a feature", syntax: "/disable [feature]" },
    { cmd: "/reset", desc: "Reset settings to default", syntax: "/reset [scope]" },
    { cmd: "/status", desc: "Show bot status", syntax: "/status" },
    { cmd: "/stats", desc: "View usage statistics", syntax: "/stats" },
    { cmd: "/logs", desc: "View recent activity logs", syntax: "/logs [count]" }
  ],
  "MODELS": [
    { cmd: "/voice", desc: "Select TTS voice model", syntax: "/voice [model]" },
    { cmd: "/model", desc: "Select AI language model", syntax: "/model [gpt-4o|mini|turbo]" },
    { cmd: "/temperature", desc: "Adjust response creativity", syntax: "/temperature [0.0-2.0]" },
    { cmd: "/response-length", desc: "Set response length", syntax: "/response-length [short|medium|long]" }
  ],
  "UTILITIES": [
    { cmd: "/ping", desc: "Check bot latency", syntax: "/ping" },
    { cmd: "/help", desc: "Get help on a command", syntax: "/help [command]" },
    { cmd: "/about", desc: "Show bot information", syntax: "/about" },
    { cmd: "/invite", desc: "Get bot invite link", syntax: "/invite" },
    { cmd: "/support", desc: "Get support info", syntax: "/support" },
    { cmd: "/feedback", desc: "Submit feedback", syntax: "/feedback [text]" },
    { cmd: "/wakeword", desc: "Set voice wake word", syntax: "/wakeword [word]" },
    { cmd: "/push-to-talk", desc: "Enable PTT mode", syntax: "/push-to-talk [on|off]" },
    { cmd: "/idleleave", desc: "Set idle leave timer", syntax: "/idleleave [minutes]" },
    { cmd: "/autojoin", desc: "Auto-join voice channels", syntax: "/autojoin [on|off]" }
  ]
};

type Category = keyof typeof commands;

export default function Commands() {
  usePageTitle("Commands");
  const [activeTab, setActiveTab] = useState<Category>("VOICE");
  const [search, setSearch] = useState("");

  const filteredCommands = commands[activeTab].filter(c => 
    c.cmd.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-16 min-h-screen bg-background flex flex-col">
      {/* Terminal Hero */}
      <section className="bg-card border-b border-border p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint opacity-20" />
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase text-primary mb-4 relative z-10">
          <Typewriter speed={30} prefix="> " text="COMMAND INTERFACE // ONLINE" />
        </h1>
        <p className="font-mono text-sm text-muted-foreground uppercase max-w-xl mx-auto relative z-10">
          Execute operations with precision. All endpoints active.
        </p>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-b border-border bg-black py-3">
        <div className="flex whitespace-nowrap animate-ticker font-mono text-xs text-muted-foreground uppercase font-bold tracking-widest gap-8">
          <span>VOICE · MEMORY · AI BEHAVIOR · WHISPER · SERVER SETUP · ADMIN · MODELS · UTILITIES · </span>
          <span>VOICE · MEMORY · AI BEHAVIOR · WHISPER · SERVER SETUP · ADMIN · MODELS · UTILITIES · </span>
          <span>VOICE · MEMORY · AI BEHAVIOR · WHISPER · SERVER SETUP · ADMIN · MODELS · UTILITIES · </span>
          <span>VOICE · MEMORY · AI BEHAVIOR · WHISPER · SERVER SETUP · ADMIN · MODELS · UTILITIES · </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 md:p-12 gap-12">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH COMMANDS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border py-3 pl-10 pr-4 font-mono text-xs text-white focus:outline-none focus:border-primary uppercase transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {(Object.keys(commands) as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveTab(cat); setSearch(""); }}
                className={`w-full text-left font-mono text-sm font-bold uppercase px-4 py-4 transition-colors border ${
                  activeTab === cat 
                    ? "bg-primary text-black corner-brackets border-transparent" 
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="font-mono text-xs text-primary mb-6 uppercase border-b border-border pb-2">
            // FILTERING: {activeTab} ({filteredCommands.length} RESULTS)
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4"
            >
              {filteredCommands.length > 0 ? (
                filteredCommands.map((c, i) => (
                  <div key={i} className="bg-blueprint border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
                    <div>
                      <div className="font-mono text-lg font-bold text-primary mb-2">{c.cmd}</div>
                      <div className="text-sm text-blueprint-foreground opacity-80">{c.desc}</div>
                    </div>
                    <div className="bg-black/50 border border-white/5 p-3 font-mono text-xs text-white whitespace-nowrap">
                      {c.syntax}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center border border-dashed border-border text-muted-foreground font-mono text-sm uppercase">
                  No commands match "{search}" in {activeTab}.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
