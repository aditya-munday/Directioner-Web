import { useState } from "react";
import { Link, useLocation } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { DrawOnPath } from "@/components/animations";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  usePageTitle("Setup Wizard");
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => {
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 2000);
    } else {
      setStep(s => s + 1);
    }
  };

  const complete = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto pt-12">
      {/* Progress */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={cn("h-1 flex-1 transition-colors", i <= step ? "bg-primary" : "bg-border")} />
        ))}
      </div>

      <div className="bg-card border border-border p-8 md:p-12 min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center text-center space-y-6">
            <h1 className="text-4xl font-display font-black uppercase text-white">Welcome, Creator.</h1>
            <p className="font-mono text-muted-foreground text-sm uppercase">Let's initialize your first deployment.</p>
            <div className="pt-8">
              <button onClick={nextStep} className="bg-primary text-black font-mono font-bold px-8 py-4 uppercase text-sm corner-brackets hover:bg-white transition-colors">
                Begin Setup
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center text-center space-y-8">
            <h2 className="text-2xl font-display font-bold uppercase text-white">Connect Discord</h2>
            <p className="font-mono text-muted-foreground text-sm max-w-md mx-auto">Click below to authorize Directioner on your target server. A pop-up will appear.</p>
            <div>
              <button onClick={nextStep} disabled={loading} className="border border-border text-white font-mono font-bold px-8 py-4 uppercase text-sm hover:border-primary transition-colors flex justify-center items-center gap-2 mx-auto w-64 h-14">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Bot ↗"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6">Channel Config</h2>
            <div className="space-y-4 flex-1">
              {['#general', '#voice', '#bot-commands'].map((c, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-border bg-background">
                  <span className="font-mono text-sm">{c}</span>
                  <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                </div>
              ))}
            </div>
            <div className="pt-8 flex justify-end">
              <button onClick={nextStep} className="bg-primary text-black font-mono font-bold px-8 py-3 uppercase text-sm corner-brackets hover:bg-white transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6">AI Parameters</h2>
            <div className="space-y-6 flex-1">
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">Primary Model</label>
                <select className="w-full bg-background border border-border p-3 font-mono text-sm text-white outline-none">
                  <option>GPT-4o (Recommended)</option>
                  <option>GPT-4o Mini</option>
                  <option>GPT-4 Turbo</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">Base Personality</label>
                <select className="w-full bg-background border border-border p-3 font-mono text-sm text-white outline-none">
                  <option>Default (Helpful & Concise)</option>
                  <option>Casual (Friendly & Emojis)</option>
                  <option>Professional (Strict & Formal)</option>
                  <option>Chaos (Unpredictable)</option>
                </select>
              </div>
            </div>
            <div className="pt-8 flex justify-end">
              <button onClick={nextStep} className="bg-primary text-black font-mono font-bold px-8 py-3 uppercase text-sm corner-brackets hover:bg-white transition-colors">
                Finalize
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <DrawOnPath>
                <svg className="w-12 h-12 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </DrawOnPath>
            </div>
            
            <h2 className="text-3xl font-display font-black uppercase text-accent mb-2">System Online</h2>
            <p className="font-mono text-muted-foreground text-sm uppercase mb-12">// DEPLOYMENT SUCCESSFUL</p>
            
            <button onClick={complete} className="bg-white text-black font-mono font-bold px-8 py-4 uppercase text-sm corner-brackets hover:bg-gray-200 transition-colors">
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
