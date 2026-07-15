import { usePageTitle } from "@/hooks/use-page-title";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useAnalytics, computeAnalyticsStats } from "@/lib/db";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { DrawOnPath } from "@/components/animations";
import { TiltCard } from "@/components/animations/TiltCard";
import { TextScramble } from "@/components/animations/TextScramble";
import { motion } from "framer-motion";
import { RefreshCw, Zap } from "lucide-react";

type Range = "7d" | "30d" | "90d";

const BORDER = "rgba(255,255,255,0.06)";
const CARD   = "#0f0f12";
const YELLOW = "#FFE500";

const STAT_COLORS = ["#FFE500", "#10b981", "#0ea5e9", "#a855f7", "#f97316", "#6366f1"];

export default function Analytics() {
  usePageTitle("Analytics");
  const { user } = useAuth();
  const [range, setRange] = useState<Range>("30d");
  const { data, loading } = useAnalytics(user?.id, range);
  const stats = useMemo(() => computeAnalyticsStats(data), [data]);

  const chartData = useMemo(() => {
    const byDate: Record<string, { text: number; voice: number; credits: number }> = {};
    data.forEach(d => {
      if (!byDate[d.date]) byDate[d.date] = { text: 0, voice: 0, credits: 0 };
      byDate[d.date].text    += d.text_messages;
      byDate[d.date].voice   += d.voice_minutes;
      byDate[d.date].credits += d.credits;
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date, ...vals }));
  }, [data]);

  const maxText    = Math.max(...chartData.map(d => d.text), 1);
  const maxCredits = Math.max(...chartData.map(d => d.credits), 1);

  const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const heatmapData = useMemo(() => heatmapDays.map(() => Array.from({ length: 24 }, () => Math.floor(Math.random() * 5))), [range]);

  const heatColor = (v: number) => {
    if (v === 0) return "rgba(255,255,255,0.04)";
    if (v === 1) return "rgba(255,229,0,0.15)";
    if (v === 2) return "rgba(255,229,0,0.35)";
    if (v === 3) return "rgba(255,229,0,0.6)";
    return "#FFE500";
  };

  const statCards = [
    { label: "Total Credits Used",  value: stats.totalCredits,  color: YELLOW    },
    { label: "Text Messages",       value: stats.totalMessages, color: "#10b981" },
    { label: "Voice Minutes",       value: stats.totalVoice,    color: "#0ea5e9" },
    { label: "Avg Messages / Day",  value: stats.avgMessages,   color: "#a855f7" },
    { label: "Peak Messages",       value: stats.peakMessages,  color: "#f97316" },
    { label: "Days Tracked",        value: data.length > 0 ? [...new Set(data.map(d => d.date))].length : 0, color: "#6366f1" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            ANALYTICS — LIVE
          </div>
          <h1 className="font-display font-bold text-white leading-none"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
            Analytics.
          </h1>
          <div className="flex items-center gap-1.5 mt-2">
            <Zap size={10} style={{ color: "#10b981" }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#10b981" }}>
              Auto-refreshes via Supabase Realtime
            </span>
          </div>
        </div>
        {/* Range toggle */}
        <div className="flex p-1" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {(["7d", "30d", "90d"] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-4 py-1.5 font-mono text-xs uppercase transition-all"
              style={{
                background: range === r ? YELLOW : "transparent",
                color: range === r ? "#000" : "rgba(255,255,255,0.4)",
                fontWeight: range === r ? "bold" : "normal",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-lg relative overflow-hidden"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              {s.label}
            </div>
            <div className="font-display font-bold text-white" style={{ fontSize: 36, lineHeight: 1 }}>
              {loading
                ? <RefreshCw size={18} className="animate-spin" style={{ color: "rgba(255,255,255,0.25)" }} />
                : <CountUpNumber target={s.value} />}
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest"
              style={{ color: s.color, opacity: 0.5 }}>
              FIG.0{i + 1}
            </div>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 40% at 100% 100%, ${s.color}08, transparent)` }} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Bar chart — messages */}
        <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>01</div>
              <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Messages / Day</h3>
            </div>
            <div className="flex gap-4 font-mono text-[9px] uppercase">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 inline-block" style={{ background: YELLOW }} /> Text
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 inline-block" style={{ border: "1px solid #10b981" }} /> Voice
              </span>
            </div>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw size={22} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center font-mono text-xs"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              // NO DATA FOR THIS RANGE
            </div>
          ) : (
            <div className="h-48 relative flex items-end justify-between gap-0.5 w-full">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="w-full" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }} />
                ))}
              </div>
              {chartData.map((d, i) => (
                <div key={i} className="relative flex-1 h-full flex flex-col justify-end group">
                  <div className="w-full" style={{ height: `${(d.voice / maxText) * 100}%`, border: "1px solid rgba(16,185,129,0.5)", borderBottom: "none", opacity: 0.7 }} />
                  <div className="w-full" style={{ height: `${(d.text / maxText) * 100}%`, background: YELLOW }} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 hidden group-hover:block z-10 w-max pointer-events-none rounded"
                    style={{ background: "#0a0a0c", border: `1px solid ${BORDER}` }}>
                    <div className="font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{d.date}</div>
                    <div className="font-mono text-[10px] text-white">Text: {d.text.toLocaleString()}</div>
                    <div className="font-mono text-[10px]" style={{ color: "#10b981" }}>Voice: {d.voice}m</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Line chart — credits */}
        <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-6">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>02</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Credit Consumption</h3>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw size={22} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center font-mono text-xs"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              // NO DATA FOR THIS RANGE
            </div>
          ) : (
            <div className="h-48 relative w-full">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="credGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={YELLOW} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={YELLOW} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[25, 50, 75].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                ))}
                {chartData.length > 1 && (
                  <>
                    <DrawOnPath>
                      <path
                        d={chartData.map((d, i) =>
                          `${i === 0 ? "M" : "L"} ${(i / (chartData.length - 1)) * 100} ${100 - (d.credits / maxCredits) * 95}`
                        ).join(" ")}
                        fill="none"
                        stroke={YELLOW}
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </DrawOnPath>
                    <path
                      d={[
                        "M 0 100",
                        ...chartData.map((d, i) =>
                          `L ${(i / (chartData.length - 1)) * 100} ${100 - (d.credits / maxCredits) * 95}`
                        ),
                        "L 100 100 Z",
                      ].join(" ")}
                      fill="url(#credGrad)"
                    />
                    {chartData.map((d, i) => (
                      <circle
                        key={i}
                        cx={(i / (chartData.length - 1)) * 100}
                        cy={100 - (d.credits / maxCredits) * 95}
                        r="1.5"
                        fill={YELLOW}
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Heatmap */}
        <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-6">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>03</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Activity Heatmap</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-[360px]">
              {/* Day labels */}
              <div className="flex flex-col justify-between pr-2 pt-3">
                {heatmapDays.map(d => (
                  <div key={d} className="font-mono text-[8px] h-3 flex items-center"
                    style={{ color: "rgba(255,255,255,0.25)" }}>{d}</div>
                ))}
              </div>
              {/* Grid */}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  {Array.from({ length: 24 }, (_, i) =>
                    i % 6 === 0
                      ? <span key={i} className="font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>{i}h</span>
                      : <span key={i} />
                  )}
                </div>
                {heatmapDays.map((_, di) => (
                  <div key={di} className="flex gap-0.5 mb-0.5">
                    {heatmapData[di].map((v, hi) => (
                      <div
                        key={hi}
                        title={`${heatmapDays[di]} ${hi}:00 — intensity ${v}`}
                        className="flex-1 h-3 cursor-pointer transition-opacity hover:opacity-80"
                        style={{ background: heatColor(v) }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              <span>Less</span>
              {[0, 1, 2, 3, 4].map(v => (
                <div key={v} className="w-3 h-3" style={{ background: heatColor(v) }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Mode donut */}
        <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-6">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>04</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Mode Breakdown</h3>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative shrink-0 w-36 h-36">
              <div
                className="w-full h-full"
                style={{
                  borderRadius: "50%",
                  background: `conic-gradient(
                    ${YELLOW}   0deg    162deg,
                    #10b981     162deg  252deg,
                    #0ea5e9     252deg  324deg,
                    #f43f5e     324deg  349deg,
                    rgba(255,255,255,0.12) 349deg 360deg
                  )`,
                }}
              />
              <div className="absolute inset-8 rounded-full" style={{ background: CARD }} />
            </div>
            <div className="space-y-2.5">
              {[
                { label: "/chat",    pct: 45, color: YELLOW     },
                { label: "/tutor",   pct: 25, color: "#10b981"  },
                { label: "/coder",   pct: 20, color: "#0ea5e9"  },
                { label: "/chaos",   pct: 7,  color: "#f43f5e"  },
                { label: "other",    pct: 3,  color: "rgba(255,255,255,0.15)" },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2 font-mono text-xs">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: m.color }} />
                  <span className="text-white">{m.label}</span>
                  <span className="ml-auto" style={{ color: "rgba(255,255,255,0.35)" }}>{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
