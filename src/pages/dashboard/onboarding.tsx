import { useState } from "react";
import { useLocation } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";

const CARD_BG = "#0f0f12";
const BORDER  = "rgba(255,255,255,0.06)";
const YELLOW  = "#FFE500";

const STEPS = ["Welcome", "Connect", "Channels", "AI Config", "Launch"];

export default function Onboarding() {
  usePageTitle("Setup Wizard");
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState(new Set(["#general", "#bot-commands"]));
  const [aiMode, setAiMode] = useState("Default (Helpful & Concise)");
  const [model, setModel] = useState("GPT-4o (Recommended)");

  const nextStep = () => {
    if (step === 2) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(3); }, 2000);
    } else {
      setStep(s => Math.min(s + 1, 5));
    }
  };

  const toggleChannel = (ch: string) => {
    setChannels(prev => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch); else next.add(ch);
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-12">
      {/* Step labels */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done   = n < step;
          const active = n === step;
          return (
            <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-all"
                style={{
                  background: done ? YELLOW : active ? YELLOW : "rgba(255,255,255,0.06)",
                  color: done || active ? "#000" : "rgba(255,255,255,0.3)",
                }}
              >
                {done ? <Check size={10} /> : n}
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px flex-1 transition-colors"
                  style={{ background: n < step ? YELLOW : BORDER }} />
              )}
            </div>
          );
        })}
      </div>

      <div
        className="rounded-xl overflow-hidden flex flex-col min-h-[440px]"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col p-10"
          >
            {/* STEP 1 — Welcome */}
            {step === 1 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  STEP 01 — INITIALIZE
                </div>
                <h1 className="font-display font-bold text-white leading-none"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.04em" }}>
                  Welcome, Creator.
                </h1>
                <p className="font-mono text-xs max-w-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Let's initialize your first Directioner deployment. This wizard takes about 2 minutes.
                </p>
                <button onClick={nextStep}
                  className="mt-6 font-mono font-bold text-sm uppercase tracking-wide px-10 py-4"
                  style={{ background: YELLOW, color: "#000" }}>
                  Begin Setup
                </button>
              </div>
            )}

            {/* STEP 2 — Connect Discord */}
            {step === 2 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  STEP 02 — CONNECT
                </div>
                <h2 className="font-display font-bold text-white text-3xl uppercase">Connect Discord</h2>
                <p className="font-mono text-xs max-w-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Click below to authorize Directioner on your target server. A Discord OAuth popup will appear.
                </p>
                <button onClick={nextStep} disabled={loading}
                  className="flex items-center justify-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-10 py-4 w-64 transition-all"
                  style={{ border: `1px solid ${loading ? "rgba(255,229,0,0.4)" : BORDER}`, color: loading ? YELLOW : "#fff" }}>
                  {loading
                    ? <><Loader2 className="animate-spin" size={16} /> Authorizing…</>
                    : "Authorize Bot ↗"}
                </button>
              </div>
            )}

            {/* STEP 3 — Channel config */}
            {step === 3 && (
              <div className="flex-1 flex flex-col">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  STEP 03 — CHANNELS
                </div>
                <h2 className="font-display font-bold text-white text-2xl uppercase mb-6">Channel Config</h2>
                <div className="space-y-2 flex-1">
                  {["#general", "#voice", "#bot-commands", "#help", "#coding"].map(ch => {
                    const on = channels.has(ch);
                    return (
                      <div key={ch}
                        className="flex items-center justify-between p-4 rounded-lg transition-all"
                        style={{ background: "#070708", border: `1px solid ${on ? "rgba(255,229,0,0.2)" : BORDER}` }}>
                        <span className="font-mono text-sm" style={{ color: on ? "#fff" : "rgba(255,255,255,0.4)" }}>{ch}</span>
                        <button
                          onClick={() => toggleChannel(ch)}
                          className="relative w-11 h-6 transition-colors"
                          style={{ background: on ? YELLOW : "rgba(255,255,255,0.08)" }}
                        >
                          <div className="absolute top-1 w-4 h-4 transition-all"
                            style={{ left: on ? "calc(100% - 20px)" : 4, background: on ? "#000" : "rgba(255,255,255,0.4)" }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-6 flex justify-end">
                  <button onClick={nextStep}
                    className="font-mono font-bold text-sm uppercase tracking-wide px-8 py-3"
                    style={{ background: YELLOW, color: "#000" }}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — AI Config */}
            {step === 4 && (
              <div className="flex-1 flex flex-col">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  STEP 04 — AI PARAMETERS
                </div>
                <h2 className="font-display font-bold text-white text-2xl uppercase mb-6">AI Configuration</h2>
                <div className="space-y-5 flex-1">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest block"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Primary Model</label>
                    <select
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none appearance-none"
                      style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      {["GPT-4o (Recommended)", "GPT-4o Mini", "GPT-4 Turbo"].map(m => (
                        <option key={m} style={{ background: "#0f0f12" }}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest block"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Base Personality</label>
                    <select
                      value={aiMode}
                      onChange={e => setAiMode(e.target.value)}
                      className="w-full px-4 py-3 font-mono text-sm text-white focus:outline-none appearance-none"
                      style={{ background: "#070708", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      {["Default (Helpful & Concise)", "Casual (Friendly & Emojis)", "Professional (Strict & Formal)", "Chaos (Unpredictable)"].map(m => (
                        <option key={m} style={{ background: "#0f0f12" }}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-6 flex justify-end">
                  <button onClick={nextStep}
                    className="font-mono font-bold text-sm uppercase tracking-wide px-8 py-3"
                    style={{ background: YELLOW, color: "#000" }}>
                    Finalize →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5 — Launch */}
            {step === 5 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center relative"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
                >
                  <motion.div className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: "rgba(16,185,129,0.2)" }} />
                  <Check size={32} style={{ color: "#10b981" }} />
                </motion.div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
                    style={{ color: "#10b981" }}>
                    DEPLOYMENT SUCCESSFUL
                  </div>
                  <h2 className="font-display font-bold text-white text-3xl uppercase">System Online.</h2>
                </div>
                <button onClick={() => setLocation("/dashboard")}
                  className="font-mono font-bold text-sm uppercase tracking-wide px-10 py-4"
                  style={{ background: "#fff", color: "#000" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = YELLOW; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                  Enter Dashboard →
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
