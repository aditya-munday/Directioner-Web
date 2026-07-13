import { usePageTitle } from "@/hooks/use-page-title";
import { useState } from "react";
import { MessageSquare, Mail, Github, Twitter, Loader2 } from "lucide-react";

export default function Contact() {
  usePageTitle("Contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase mb-4">Transmission.</h1>
        <p className="font-mono text-muted-foreground uppercase text-sm">Establish a direct link to the developers.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        {/* Left Col: Channels */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-mono text-sm font-bold uppercase text-primary mb-6 border-b border-border pb-2">Channels</h2>
          
          <a href="#" className="flex items-center gap-4 p-4 border border-border bg-card hover:border-primary transition-colors group">
            <MessageSquare className="text-muted-foreground group-hover:text-primary transition-colors" />
            <div>
              <div className="font-bold uppercase">Discord Server</div>
              <div className="font-mono text-xs text-muted-foreground">Fastest response</div>
            </div>
          </a>
          
          <a href="#" className="flex items-center gap-4 p-4 border border-border bg-card hover:border-primary transition-colors group">
            <Mail className="text-muted-foreground group-hover:text-primary transition-colors" />
            <div>
              <div className="font-bold uppercase">Email Support</div>
              <div className="font-mono text-xs text-muted-foreground">hello@directioner.bot</div>
            </div>
          </a>
          
          <a href="#" className="flex items-center gap-4 p-4 border border-border bg-card hover:border-primary transition-colors group">
            <Github className="text-muted-foreground group-hover:text-primary transition-colors" />
            <div>
              <div className="font-bold uppercase">GitHub Issues</div>
              <div className="font-mono text-xs text-muted-foreground">Bug reports only</div>
            </div>
          </a>
          
          <a href="#" className="flex items-center gap-4 p-4 border border-border bg-card hover:border-primary transition-colors group">
            <Twitter className="text-muted-foreground group-hover:text-primary transition-colors" />
            <div>
              <div className="font-bold uppercase">Twitter / X</div>
              <div className="font-mono text-xs text-muted-foreground">@directionerbot</div>
            </div>
          </a>
        </div>

        {/* Right Col: Form */}
        <div className="md:col-span-3 border border-border bg-card p-8">
          <h2 className="font-mono text-sm font-bold uppercase text-primary mb-6">Direct Message</h2>
          
          {submitted ? (
            <div className="h-64 flex flex-col items-center justify-center border border-accent bg-accent/10 text-accent font-mono text-sm uppercase text-center p-6">
              <div className="text-4xl mb-4">✓</div>
              // TRANSMISSION RECEIVED ———————————<br/>
              AWAITING RESPONSE.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase text-muted-foreground">Name</label>
                  <input required className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase text-muted-foreground">Email</label>
                  <input type="email" required className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-muted-foreground">Subject</label>
                <select className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors text-white appearance-none">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Issue</option>
                  <option>Partnership</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-muted-foreground">Message</label>
                <textarea required rows={5} className="w-full bg-background border border-border p-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-mono font-bold px-6 py-4 uppercase text-sm corner-brackets hover:bg-white transition-colors flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
