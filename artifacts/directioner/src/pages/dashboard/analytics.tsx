import { usePageTitle } from "@/hooks/use-page-title";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useAnalytics, computeAnalyticsStats } from "@/lib/db";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { TiltCard } from "@/components/animations/TiltCard";
import { BorderBeam } from "@/components/animations/BorderBeam";
import { motion } from "framer-motion";
import { RefreshCw, Zap, BarChart2 } from "lucide-react";
import { generateAnalyticsData, generateHeatmapData, generateModeBreakdown } from "@/lib/mockData";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

type Range = "7d" | "30d" | "90d";

const BORDER = "rgba(255,255,255,0.06)";
const CARD   = "#0f0f12";
const YELLOW = "#FFE500";

const HEAT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const heatColor = (v: number) => {
  if (v === 0) return "rgba(255,255,255,0.04)";
  if (v < 0.2)  return "rgba(255,229,0,0.12)";
  if (v < 0.4)  return "rgba(255,229,0,0.28)";
  if (v < 0.65) return "rgba(255,229,0,0.52)";
  if (v < 0.85) return "rgba(255,229,0,0.72)";
  return "#FFE500";
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 font-mono text-[10px]"
      style={{ background: "#0a0a0c", border: `1px solid ${BORDER}` }}>
      <div className="mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  usePageTitle("Analytics");
  const { user } = useAuth();
  const [range, setRange] = useState<Range>("30d");
  const { data, loading } = useAnalytics(user?.id, range);
  const stats = useMemo(() => computeAnalyticsStats(data), [data]);

  // Build chart data from real or mock
  const chartData = useMemo(() => {
    if (data.length > 0) {
      const byDate: Record<string, { text: number; voice: number; credits: number }> = {};
      data.forEach(d => {
        if (!byDate[d.date]) byDate[d.date] = { text: 0, voice: 0, credits: 0 };
        byDate[d.date].text    += d.text_messages;
        byDate[d.date].voice   += d.voice_minutes;
        byDate[d.date].credits += d.credits;
      });
      return Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, vals]) => ({
          date: date.slice(5),
          text: vals.text,
          voice: vals.voice,
          credits: vals.credits,
        }));
    }
    // Fall back to mock
    return generateAnalyticsData(range).map(d => ({
      date: d.date.slice(5),
      text: d.textMessages,
      voice: d.voiceMinutes,
      credits: d.credits,
    }));
  }, [data, range]);

  const totalMessages = data.length > 0 ? stats.totalMessages : chartData.reduce((s, d) => s + d.text, 0);
  const totalVoice    = data.length > 0 ? stats.totalVoice    : chartData.reduce((s, d) => s + d.voice, 0);
  const totalCredits  = data.length > 0 ? stats.totalCredits  : chartData.reduce((s, d) => s + d.credits, 0);
  const peakDay       = chartData.length > 0 ? chartData.reduce((a, b) => a.text > b.text ? a : b).date : "—";
  const avgMessages   = chartData.length > 0 ? Math.round(totalMessages / chartData.length) : 0;
  const daysTracked   = chartData.length;

  const heatmapData = useMemo(() => generateHeatmapData(), [range]);
  const modeBreakdown = useMemo(() => generateModeBreakdown(), []);

  const STAT_CFG = [
    { label: "Total Messages",       value: totalMessages, color: YELLOW,    suffix: "" },
    { label: "Voice Minutes",        value: totalVoice,    color: "#10b981", suffix: "m" },
    { label: "Credits Used",         value: totalCredits,  color: "#0ea5e9", suffix: "" },
    { label: "Peak Day",             value: null,          raw: peakDay,     color: "#a855f7", suffix: "" },
    { label: "Avg Messages / Day",   value: avgMessages,   color: "#f97316", suffix: "" },
    { label: "Days Tracked",         value: daysTracked,   color: "#6366f1", suffix: "" },
  ];

  const isEmpty = chartData.length === 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: "rgba(255,255,255,0.25)" }}>ANALYTICS — LIVE</div>
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
              className="px-5 py-2 font-mono text-xs uppercase transition-all"
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
        {STAT_CFG.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard intensity={3} glowColor={`${s.color}10`} className="h-full">
              <div
                className="p-6 rounded-lg relative overflow-hidden h-full"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                <BorderBeam color={s.color} duration={8} delay={i * 0.5} size={60} />
                <div className="font-mono text-[10px] uppercase tracking-widest mb-3"
                  style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                <div className="font-display font-bold text-white" style={{ fontSize: 36, lineHeight: 1 }}>
                  {loading
                    ? <RefreshCw size={18} className="animate-spin" style={{ color: "rgba(255,255,255,0.25)" }} />
                    : s.raw !== undefined
                      ? <span style={{ fontSize: 24 }}>{s.raw}</span>
                      : <><CountUpNumber target={s.value ?? 0} />{s.suffix}</>}
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: s.color, opacity: 0.5 }}>
                  FIG.0{i + 1}
                </div>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 60% 40% at 100% 100%, ${s.color}08, transparent)` }} />
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Main area chart */}
      <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>01</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Messages & Voice Over Time</h3>
          </div>
          <div className="flex gap-5 font-mono text-[9px] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 inline-block rounded-sm" style={{ background: YELLOW }} /> Text
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 inline-block rounded-sm" style={{ background: "#10b981" }} /> Voice
            </span>
          </div>
        </div>
        {loading ? (
          <div className="h-56 flex items-center justify-center">
            <RefreshCw size={22} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
          </div>
        ) : isEmpty ? (
          <div className="h-56 flex flex-col items-center justify-center gap-3">
            <BarChart2 size={32} style={{ color: "rgba(255,255,255,0.12)" }} />
            <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>// NO DATA FOR THIS RANGE</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradText" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={YELLOW} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={YELLOW} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVoice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="text" name="Messages" stroke={YELLOW} strokeWidth={2} fill="url(#gradText)" dot={false} activeDot={{ r: 4, fill: YELLOW }} />
              <Area type="monotone" dataKey="voice" name="Voice (min)" stroke="#10b981" strokeWidth={2} fill="url(#gradVoice)" dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Lower grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Credits area chart */}
        <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-6">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>02</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Credit Consumption</h3>
          </div>
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <RefreshCw size={20} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8, fontFamily: "monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="credits" name="Credits" stroke="#0ea5e9" strokeWidth={2} fill="url(#gradCredits)" dot={false} activeDot={{ r: 3, fill: "#0ea5e9" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Heatmap */}
        <div className="p-6 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-5">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>03</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Activity Heatmap</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-[340px]">
              <div className="flex flex-col justify-between pr-2 pt-4">
                {HEAT_DAYS.map(d => (
                  <div key={d} className="font-mono text-[8px] h-3 flex items-center"
                    style={{ color: "rgba(255,255,255,0.25)" }}>{d}</div>
                ))}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  {Array.from({ length: 24 }, (_, i) =>
                    i % 6 === 0
                      ? <span key={i} className="font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>{i}h</span>
                      : <span key={i} />
                  )}
                </div>
                {HEAT_DAYS.map((_, di) => (
                  <div key={di} className="flex gap-0.5 mb-0.5">
                    {heatmapData[di].map((v, hi) => (
                      <div
                        key={hi}
                        title={`${HEAT_DAYS[di]} ${hi}:00 — intensity ${Math.round(v * 100)}%`}
                        className="flex-1 h-3 cursor-pointer transition-opacity hover:opacity-75"
                        style={{ background: heatColor(v) }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              <span>Less</span>
              {[0, 0.2, 0.5, 0.8, 1].map((v, i) => (
                <div key={i} className="w-3 h-3" style={{ background: heatColor(v) }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Mode breakdown bars */}
        <div className="p-6 rounded-lg lg:col-span-2" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="mb-6">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>04</div>
            <h3 className="font-mono text-sm font-bold uppercase" style={{ color: YELLOW }}>Mode Breakdown</h3>
          </div>
          <div className="space-y-3">
            {modeBreakdown.map((m, i) => {
              const clr = [YELLOW, "#10b981", "#0ea5e9", "#f43f5e", "rgba(255,255,255,0.2)"][i] ?? "rgba(255,255,255,0.2)";
              return (
                <div key={m.name}>
                  <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                    <span className="text-white font-bold uppercase">/{m.name}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{m.count.toLocaleString()} calls</span>
                      <span style={{ color: clr }}>{m.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: clr }}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
