import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Support() {
  usePageTitle("Support");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-3xl font-display font-bold uppercase mb-2">Support Center.</h1>
        <p className="font-mono text-sm text-muted-foreground uppercase">Report issues or request assistance.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border">
        {/* Left Col */}
        <div className="space-y-8">
          <div className="bg-primary/10 border border-primary p-6">
            <h3 className="font-mono font-bold uppercase text-primary mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary animate-pulse" /> System Status
            </h3>
            <p className="font-mono text-sm text-white">All systems operational.</p>
            <div className="mt-4 text-[10px] text-muted-foreground font-mono">Last checked: Just now</div>
          </div>

          <div className="space-y-4">
            <h3 className="font-mono font-bold uppercase text-sm border-b border-border pb-2">Quick Links</h3>
            <a href="/faq" className="block text-muted-foreground hover:text-primary transition-colors font-mono text-sm underline decoration-border underline-offset-4">Read the FAQ</a>
            <a href="/commands" className="block text-muted-foreground hover:text-primary transition-colors font-mono text-sm underline decoration-border underline-offset-4">Command Reference</a>
            <a href="https://discord.com" className="block text-muted-foreground hover:text-primary transition-colors font-mono text-sm underline decoration-border underline-offset-4">Join Community Discord</a>
          </div>
        </div>

        {/* Right Col */}
        <div className="bg-card border border-border p-6 md:p-8">
          <h2 className="font-mono font-bold uppercase text-sm mb-6 text-primary">// OPEN TICKET</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <div className="font-mono text-accent text-sm mb-4">✓ TICKET SUBMITTED</div>
              <div className="font-mono text-xs text-muted-foreground">ID: #TK-0042<br/>Check your email for updates.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-muted-foreground">Category</label>
                <select className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary text-white appearance-none">
                  <option>Bug Report</option>
                  <option>Billing Issue</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-muted-foreground">Server ID (Optional)</label>
                <input className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-muted-foreground">Description</label>
                <textarea required rows={5} className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              
              <button disabled={loading} className="w-full bg-primary text-black font-mono font-bold px-6 py-4 uppercase text-sm corner-brackets hover:bg-white transition-colors flex justify-center items-center mt-4">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Ticket"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
