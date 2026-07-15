import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { PageHero, DrawLine, Reveal } from "@/components/ui/motion-primitives";

const commands = {
  "VOICE": [
    { cmd: "/join",    desc: "Join your current voice channel",    syntax: "/join [channel]"   },
    { cmd: "/leave",   desc: "Leave the voice channel",            syntax: "/leave"             },
    { cmd: "/move",    desc: "Move to different voice channel",    syntax: "/move [channel]"   },
    { cmd: "/listen",  desc: "Start listening mode only",          syntax: "/listen"            },
    { cmd: "/mute",    desc: "Mute bot microphone",                syntax: "/mute"              },
    { cmd: "/unmute",  desc: "Unmute bot microphone",              syntax: "/unmute"            },
    { cmd: "/stop",    desc: "Stop voice activity",                syntax: "/stop"              },
    { cmd: "/volume",  desc: "Set bot output volume",              syntax: "/volume [0-200]"   },
  ],
  "AI BEHAVIOR": [
    { cmd: "/chatmode",    desc: "Switch bot persona",             syntax: "/chatmode [chat|tutor|coder|chaos|creative|debate]" },
    { cmd: "/interrupt",   desc: "Allow interrupting bot",         syntax: "/interrupt [on|off]" },
    { cmd: "/autoreply",   desc: "Toggle automatic reply",         syntax: "/autoreply [on|off]" },
    { cmd: "/personality", desc: "Set custom instructions",        syntax: "/personality [preset|custom]" },
    { cmd: "/language",    desc: "Set response language",          syntax: "/language [code]"  },
  ],
  "MEMORY": [
    { cmd: "/remember",     desc: "Force save a fact",             syntax: "/remember [text]"  },
    { cmd: "/forget",       desc: "Delete a specific memory",      syntax: "/forget [id]"      },
    { cmd: "/memory",       desc: "View or manage memories",       syntax: "/memory [list|clear]" },
    { cmd: "/clearcontext", desc: "Wipe conversation history",     syntax: "/clearcontext"     },
  ],
  "WHISPER": [
    { cmd: "/whisper", desc: "Enable ephemeral responses",         syntax: "/whisper [on|off]" },
    { cmd: "/dm",      desc: "Send long responses via DM",         syntax: "/dm [on|off]"      },
  ],
  "SERVER SETUP": [
    { cmd: "/setup",        desc: "Run setup wizard",              syntax: "/setup"            },
    { cmd: "/configure",    desc: "Configure a setting",           syntax: "/configure [setting] [value]" },
    { cmd: "/permissions",  desc: "Check bot permissions",         syntax: "/permissions"      },
    { cmd: "/channels",     desc: "Manage active channels",        syntax: "/channels"         },
    { cmd: "/voicechannel", desc: "Set default voice channel",     syntax: "/voicechannel [channel]" },
  ],
  "ADMIN": [
    { cmd: "/enable",  desc: "Enable a feature",                   syntax: "/enable [feature]" },
    { cmd: "/disable", desc: "Disable a feature",                  syntax: "/disable [feature]" },
    { cmd: "/reset",   desc: "Reset settings to default",          syntax: "/reset [scope]"    },
    { cmd: "/status",  desc: "Show bot status",                    syntax: "/status"           },
    { cmd: "/stats",   desc: "View usage statistics",              syntax: "/stats"            },
    { cmd: "/logs",    desc: "View recent activity logs",          syntax: "/logs [count]"     },
  ],
  "MODELS": [
    { cmd: "/voice",           desc: "Select TTS voice model",     syntax: "/voice [model]"    },
    { cmd: "/model",           desc: "Select AI language model",   syntax: "/model [gpt-4o|mini|turbo]" },
    { cmd: "/temperature",     desc: "Adjust response creativity", syntax: "/temperature [0.0-2.0]" },
    { cmd: "/response-length", desc: "Set response length",        syntax: "/response-length [short|medium|long]" },
  ],
  "UTILITIES": [
    { cmd: "/ping",         desc: "Check bot latency",             syntax: "/ping"             },
    { cmd: "/help",         desc: "Get help on a command",         syntax: "/help [command]"   },
    { cmd: "/about",        desc: "Show bot information",          syntax: "/about"            },
    { cmd: "/invite",       desc: "Get bot invite link",           syntax: "/invite"           },
    { cmd: "/support",      desc: "Get support info",              syntax: "/support"          },
    { cmd: "/feedback",     desc: "Submit feedback",               syntax: "/feedback [text]"  },
    { cmd: "/wakeword",     desc: "Set voice wake word",           syntax: "/wakeword [word]"  },
    { cmd: "/push-to-talk", desc: "Enable PTT mode",               syntax: "/push-to-talk [on|off]" },
    { cmd: "/idleleave",    desc: "Set idle leave timer",          syntax: "/idleleave [minutes]" },
    { cmd: "/autojoin",     desc: "Auto-join voice channels",      syntax: "/autojoin [on|off]" },
  ],
};

type Category = keyof typeof commands;

const CAT_COLORS: Record<string, string> = {
  "VOICE": "#0ea5e9",
  "AI BEHAVIOR": "#FFE500",
  "MEMORY": "#a855f7",
  "WHISPER": "#6366f1",
  "SERVER SETUP": "#10b981",
  "ADMIN": "#f43f5e",
  "MODELS": "#FFE500",
  "UTILITIES": "#64748b",
};

export default function Commands() {
  usePageTitle("Commands");
  const [activeTab, setActiveTab] = useState<Category>("VOICE");
  const [search, setSearch] = useState("");

  const allCommands = (Object.entries(commands) as [Category, typeof commands[Category]][])
    .flatMap(([cat, cmds]) => cmds.map(c => ({ ...c, cat })));

  const isSearching = search.length > 0;
  const searchResults = allCommands.filter(
    c =>
      c.cmd.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const displayCommands = isSearching
    ? searchResults
    : commands[activeTab].map(c => ({ ...c, cat: activeTab }));

  return (
    <div style={{ background: "#070708" }}>
      <PageHero
        eyebrow="Commands — Full reference"
        heading="Command Interface."
        sub="Every slash command, organized by category. Search anything or browse by module."
      />

      {/* Ticker */}
      <div className="overflow-hidden py-3 border-y" style={{ background: "#0a0a0c", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex whitespace-nowrap animate-ticker font-mono text-[10px] uppercase tracking-[0.2em] gap-12"
          style={{ color: "rgba(255,255,255,0.2)" }}>
          {[...Object.keys(commands), ...Object.keys(commands)].map((k, i) => (
            <span key={i}>{k}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-56 shrink-0 space-y-1">
          {/* Search */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={e => { setSearch(e.target.value); }}
              className="w-full pl-9 pr-4 py-2.5 font-mono text-xs text-white focus:outline-none transition-colors"
              style={{
                background: "#0f0f12",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
          </div>

          {!isSearching && (Object.keys(commands) as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs uppercase tracking-wide transition-all"
              style={{
                background: activeTab === cat ? "rgba(255,229,0,0.08)" : "transparent",
                color: activeTab === cat ? "#FFE500" : "rgba(255,255,255,0.35)",
                borderLeft: activeTab === cat ? "2px solid #FFE500" : "2px solid transparent",
              }}
            >
              <span>{cat}</span>
              <span className="text-[9px] opacity-60">{commands[cat].length}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
              {isSearching
                ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${search}"`
                : `${activeTab} — ${commands[activeTab].length} commands`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              {displayCommands.length > 0 ? (
                displayCommands.map((c, i) => (
                  <motion.div
                    key={c.cmd + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg group transition-all"
                    style={{
                      background: "#0f0f12",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={e => {
                      const color = CAT_COLORS[c.cat] ?? "#FFE500";
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}25`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="font-mono text-base font-bold"
                        style={{ color: CAT_COLORS[c.cat] ?? "#FFE500" }}
                      >
                        {c.cmd}
                      </span>
                      {isSearching && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded"
                          style={{ background: `${CAT_COLORS[c.cat] ?? "#FFE500"}15`, color: CAT_COLORS[c.cat] ?? "#FFE500" }}>
                          {c.cat}
                        </span>
                      )}
                      <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{c.desc}</span>
                    </div>
                    <code
                      className="font-mono text-xs px-3 py-1.5 rounded shrink-0"
                      style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.5)" }}
                    >
                      {c.syntax}
                    </code>
                  </motion.div>
                ))
              ) : (
                <div className="p-16 text-center font-mono text-xs"
                  style={{ border: "1px dashed rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }}>
                  No commands match "{search}"
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
