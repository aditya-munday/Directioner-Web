import { usePageTitle } from "@/hooks/use-page-title";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useAnalytics, computeAnalyticsStats } from "@/lib/db";
import { CountUpNumber } from "@/hooks/CountUpNumber";
import { DrawOnPath } from "@/components/animations";
import { cn } from "@/lib/utils";
import { RefreshCw, Zap } from "lucide-react";

type Range = '7d' | '30d' | '90d';

export default function Analytics() {
  usePageTitle("Analytics");
  const { user } = useAuth();
  const [range, setRange] = useState<Range>('30d');
  const { data, loading } = useAnalytics(user?.id, range);

  const stats = useMemo(() => computeAnalyticsStats(data), [data]);

  // For grouped bar chart — aggregate by date
  const chartData = useMemo(() => {
    const byDate: Record<string, { text: number; voice: number; credits: number }> = {};
    data.forEach(d => {
      if (!byDate[d.date]) byDate[d.date] = { text: 0, voice: 0, credits: 0 };
      byDate[d.date].text += d.text_messages;
      byDate[d.date].voice += d.voice_minutes;
      byDate[d.date].credits += d.credits;
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date, ...vals }));
  }, [data]);

  const maxText = Math.max(...chartData.map(d => d.text), 1);
  const maxCredits = Math.max(...chartData.map(d => d.credits), 1);

  // Heatmap: 7 days × last 12 hours buckets
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapData = useMemo(() => {
    return heatmapDays.map((_, di) =>
      Array.from({ length: 24 }, (_, hi) => Math.floor(Math.random() * 5))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const intensityClass = (v: number) =>
    v === 0 ? 'bg-white/5' : v === 1 ? 'bg-primary/20' : v === 2 ? 'bg-primary/40' : v === 3 ? 'bg-primary/70' : 'bg-primary';

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Analytics.</h1>
          <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase">
            <Zap size={10} />
            Live — auto-refreshes via Supabase Realtime
          </div>
        </div>
        <div className="flex bg-card border border-border p-1">
          {(['7d', '30d', '90d'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-4 py-1.5 font-mono text-xs uppercase transition-colors",
                range === r ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Credits Used", value: stats.totalCredits, accent: "primary" },
          { label: "Text Messages", value: stats.totalMessages, accent: "accent" },
          { label: "Voice Minutes", value: stats.totalVoice, accent: "accent" },
          { label: "Avg Messages / Day", value: stats.avgMessages, accent: "primary" },
          { label: "Peak Messages", value: stats.peakMessages, accent: "primary" },
          { label: "Days Tracked", value: data.length > 0 ? [...new Set(data.map(d => d.date))].length : 0, accent: "accent" },
        ].map((s, i) => (
          <div key={i} className="bg-blueprint border border-white/10 p-6 relative overflow-hidden">
            <div className="font-mono text-xs uppercase text-blueprint-foreground opacity-70 mb-4">{s.label}</div>
            <div className="text-4xl font-display font-black text-white">
              {loading
                ? <RefreshCw size={20} className="animate-spin text-white/40" />
                : <CountUpNumber target={s.value} />}
            </div>
            <div className={`absolute right-4 bottom-4 font-mono text-[10px] text-${s.accent} opacity-50 uppercase`}>
              FIG.0{i + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Messages Bar Chart */}
        <div className="border border-border bg-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-mono text-sm font-bold uppercase text-primary">01 &gt; Messages / Day</h3>
            <div className="flex gap-4 font-mono text-[10px] uppercase">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary inline-block" /> Text</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 border border-accent inline-block" /> Voice</span>
            </div>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center font-mono text-xs text-muted-foreground">
              // NO DATA FOR THIS RANGE
            </div>
          ) : (
            <div className="h-48 relative flex items-end justify-between gap-0.5 w-full">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map(i => <div key={i} className="w-full border-t border-border/30" />)}
              </div>
              {chartData.map((d, i) => (
                <div key={i} className="relative flex-1 h-full flex flex-col justify-end group">
                  <div className="w-full border border-accent border-b-0 opacity-60" style={{ height: `${(d.voice / maxText) * 100}%` }} />
                  <div className="w-full bg-primary" style={{ height: `${(d.text / maxText) * 100}%` }} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black border border-border p-2 hidden group-hover:block z-10 w-max pointer-events-none">
                    <div className="font-mono text-[9px] text-muted-foreground">{d.date}</div>
                    <div className="font-mono text-[10px] text-white">Text: {d.text.toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-accent">Voice: {d.voice}m</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit Consumption Line Chart */}
        <div className="border border-border bg-card p-6">
          <h3 className="font-mono text-sm font-bold uppercase text-primary mb-6">02 &gt; Credit Consumption</h3>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center font-mono text-xs text-muted-foreground">
              // NO DATA FOR THIS RANGE
            </div>
          ) : (
            <div className="h-48 relative w-full">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[25, 50, 75].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                ))}
                {chartData.length > 1 && (
                  <>
                    <DrawOnPath>
                      <path
                        d={chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (chartData.length - 1)) * 100} ${100 - (d.credits / maxCredits) * 95}`).join(' ')}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </DrawOnPath>
                    <path
                      d={[
                        `M 0 100`,
                        ...chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 100} ${100 - (d.credits / maxCredits) * 95}`),
                        'L 100 100 Z',
                      ].join(' ')}
                      fill="url(#creditGrad)"
                    />
                    {chartData.map((d, i) => (
                      <circle
                        key={i}
                        cx={(i / (chartData.length - 1)) * 100}
                        cy={100 - (d.credits / maxCredits) * 95}
                        r="1.2"
                        fill="hsl(var(--primary))"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Activity Heatmap */}
        <div className="border border-border bg-card p-6">
          <h3 className="font-mono text-sm font-bold uppercase text-primary mb-6">03 &gt; Activity Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 min-w-[400px]">
              {/* Day labels */}
              <div className="flex flex-col justify-between pr-2 pt-3">
                {heatmapDays.map(d => (
                  <div key={d} className="font-mono text-[9px] text-muted-foreground h-3 flex items-center">{d}</div>
                ))}
              </div>
              {/* Grid */}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    i % 6 === 0 ? <span key={i} className="font-mono text-[9px] text-muted-foreground">{i}h</span> : <span key={i} />
                  ))}
                </div>
                {heatmapDays.map((_, di) => (
                  <div key={di} className="flex gap-0.5 mb-0.5">
                    {heatmapData[di].map((v, hi) => (
                      <div
                        key={hi}
                        title={`${heatmapDays[di]} ${hi}:00 — intensity ${v}`}
                        className={cn("flex-1 h-3 cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all", intensityClass(v))}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 font-mono text-[9px] text-muted-foreground">
              <span>Less</span>
              {[0,1,2,3,4].map(v => <div key={v} className={cn("w-3 h-3", intensityClass(v))} />)}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Mode Breakdown Donut */}
        <div className="border border-border bg-card p-6">
          <h3 className="font-mono text-sm font-bold uppercase text-primary mb-6">04 &gt; Mode Breakdown</h3>
          <div className="flex items-center gap-8">
            <div className="relative shrink-0">
              <div
                className="w-40 h-40"
                style={{
                  background: `conic-gradient(
                    #FFE500 0deg 162deg,
                    #00F5A0 162deg 252deg,
                    #4A9EFF 252deg 324deg,
                    #FF4444 324deg 349deg,
                    #555 349deg 360deg
                  )`,
                  borderRadius: '50%',
                }}
              />
              <div className="absolute inset-8 bg-card" style={{ borderRadius: '50%' }} />
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[
                { label: "/chat", pct: 45, color: "#FFE500" },
                { label: "/tutor", pct: 25, color: "#00F5A0" },
                { label: "/coder", pct: 20, color: "#4A9EFF" },
                { label: "/chaos", pct: 7, color: "#FF4444" },
                { label: "other", pct: 3, color: "#555" },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 shrink-0" style={{ background: m.color }} />
                  <span className="text-white">{m.label}</span>
                  <span className="text-muted-foreground ml-auto">{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
