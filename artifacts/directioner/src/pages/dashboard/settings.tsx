import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff, Copy, RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const TABS = ["profile", "security", "notifications", "appearance", "api"] as const;
type Tab = typeof TABS[number];

const NOTIF_DEFAULTS = {
  email_alerts: true,
  usage_warnings: true,
  billing_receipts: true,
  weekly_report: false,
  discord_dm: false,
};

export default function Settings() {
  usePageTitle("Settings");
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState(user?.username ?? '');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [notifs, setNotifs] = useState(NOTIF_DEFAULTS);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const MOCK_API_KEY = `dk_${user?.id?.slice(0,8) ?? 'xxxxxxxx'}xxxxxxxxxxxxxxxxxxx`;

  useEffect(() => { setUsername(user?.username ?? ''); }, [user]);

  const getStrength = (p: string) => {
    let s = 0;
    if (p.length > 7) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  };
  const strength = getStrength(password);
  const strengthColor = strength < 50 ? 'bg-red-500' : strength < 75 ? 'bg-orange-400' : 'bg-accent';
  const strengthLabel = strength < 25 ? 'Weak' : strength < 50 ? 'Fair' : strength < 75 ? 'Good' : 'Strong';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ username: username.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPw) return;
    setSaving(true);
    try {
      await supabase.auth.updateUser({ password });
      setPassword(''); setConfirmPw('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(MOCK_API_KEY);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="border-b border-border pb-6">
        <h1 className="text-3xl font-display font-bold uppercase mb-2 text-white">Account Settings.</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase">User ID: {user?.id}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 pt-2">
        {/* Tab nav */}
        <div className="w-full lg:w-48 shrink-0 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible hide-scrollbar">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn("shrink-0 text-left px-4 py-3 font-mono text-xs uppercase transition-colors",
                  activeTab === tab ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-white"
                )}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-2xl">
          {/* Profile */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 border border-border bg-card p-8">
              <h2 className="font-mono text-primary font-bold uppercase text-xs pb-2 border-b border-border">// Profile Config</h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-secondary flex items-center justify-center font-display font-black text-3xl border border-border text-white shrink-0">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-xs text-muted-foreground mb-1 uppercase">Display Initials</div>
                  <div className="font-mono text-sm text-primary">{user?.tier.toUpperCase()} Plan</div>
                </div>
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-background border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">Email</label>
                <input value={user?.email} readOnly className="w-full bg-background border border-border px-4 py-3 font-mono text-sm text-muted-foreground cursor-not-allowed" />
                <div className="font-mono text-[10px] text-muted-foreground mt-1">Email cannot be changed directly. Contact support.</div>
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">Member Since</label>
                <div className="font-mono text-sm text-muted-foreground">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
              </div>
              <button type="submit" disabled={saving} className="bg-primary text-black font-mono font-bold px-8 py-3 uppercase text-xs corner-brackets hover:bg-white transition-colors flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <form onSubmit={handleSavePassword} className="space-y-6 border border-border bg-card p-8">
              <h2 className="font-mono text-primary font-bold uppercase text-xs pb-2 border-b border-border">// Security Config</h2>
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">New Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-background border border-border px-4 py-3 pr-12 font-mono text-sm focus:outline-none focus:border-primary" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[25,50,75,100].map(v => (
                        <div key={v} className={cn("flex-1 h-1 transition-colors", strength >= v ? strengthColor : "bg-border")} />
                      ))}
                    </div>
                    <div className={cn("font-mono text-[10px] uppercase", strengthColor.replace('bg-','text-'))}>{strengthLabel}</div>
                  </div>
                )}
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">Confirm Password</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={cn("w-full bg-background border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary", confirmPw && confirmPw !== password ? "border-red-500" : "border-border")} />
                {confirmPw && confirmPw !== password && <div className="font-mono text-[10px] text-red-500 mt-1">Passwords don't match</div>}
              </div>
              <div className="border border-border bg-background p-4">
                <div className="font-mono text-xs text-muted-foreground uppercase mb-2">Two-Factor Authentication</div>
                <div className="font-mono text-sm text-white mb-3">Not configured</div>
                <button type="button" className="font-mono text-xs text-primary hover:underline uppercase">Set up 2FA →</button>
              </div>
              <button type="submit" disabled={saving || !password || password !== confirmPw} className="bg-primary text-black font-mono font-bold px-8 py-3 uppercase text-xs corner-brackets hover:bg-white transition-colors disabled:opacity-40 flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Update Password
              </button>
            </form>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="border border-border bg-card p-8 space-y-6">
              <h2 className="font-mono text-primary font-bold uppercase text-xs pb-2 border-b border-border">// Notification Config</h2>
              {Object.entries(notifs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <div className="font-mono text-sm text-white capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="font-mono text-[10px] text-muted-foreground uppercase mt-0.5">
                      {key === 'email_alerts' ? 'Receive critical system alerts via email' :
                       key === 'usage_warnings' ? 'Warn when credits drop below 20%' :
                       key === 'billing_receipts' ? 'Email receipt for every charge' :
                       key === 'weekly_report' ? 'Weekly digest of server activity' :
                       'DM you on Discord for urgent alerts'}
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifs(p => ({ ...p, [key]: !val }))}
                    className={cn("relative w-12 h-6 border transition-colors shrink-0", val ? "bg-primary border-primary" : "bg-background border-border")}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 bg-black transition-all", val ? "left-7" : "left-1")} />
                  </button>
                </div>
              ))}
              <button className="bg-primary text-black font-mono font-bold px-8 py-3 uppercase text-xs corner-brackets hover:bg-white transition-colors">
                Save Preferences
              </button>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="border border-border bg-card p-8 space-y-6">
              <h2 className="font-mono text-primary font-bold uppercase text-xs pb-2 border-b border-border">// Appearance Config</h2>
              {[
                { label: "Theme", options: ["Dark (required)", "Dark High Contrast"], current: 0 },
                { label: "UI Density", options: ["Comfortable", "Compact", "Cozy"], current: 0 },
                { label: "Date Format", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], current: 2 },
                { label: "Timezone", options: ["UTC", "UTC-5 (EST)", "UTC+1 (CET)", "UTC+5:30 (IST)"], current: 0 },
              ].map(s => (
                <div key={s.label}>
                  <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">{s.label}</label>
                  <div className="flex flex-wrap gap-2">
                    {s.options.map((o, i) => (
                      <button key={o} className={cn("px-4 py-2 font-mono text-xs border transition-colors", i === s.current ? "bg-primary text-black border-primary" : "border-border text-muted-foreground hover:text-white hover:border-white/20")}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API */}
          {activeTab === "api" && (
            <div className="border border-border bg-card p-8 space-y-6">
              <h2 className="font-mono text-primary font-bold uppercase text-xs pb-2 border-b border-border">// API Access</h2>
              {user?.tier !== 'max' ? (
                <div className="border border-border bg-background p-8 text-center">
                  <div className="font-mono text-xs text-muted-foreground uppercase mb-4">API Access requires Max tier</div>
                  <a href="/dashboard/billing" className="bg-primary text-black font-mono text-xs font-bold uppercase px-6 py-3 corner-brackets hover:bg-white transition-colors inline-block">
                    Upgrade to Max
                  </a>
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-mono text-xs uppercase text-muted-foreground block mb-2">API Key</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-background border border-border px-4 py-3 font-mono text-xs text-muted-foreground overflow-hidden">
                        {apiKeyVisible ? MOCK_API_KEY : '•'.repeat(40)}
                      </div>
                      <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="border border-border px-3 text-muted-foreground hover:text-white transition-colors">
                        {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={copyApiKey} className="border border-border px-3 text-muted-foreground hover:text-primary transition-colors">
                        {apiKeyCopied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                  <button className="border border-border text-muted-foreground hover:text-white px-6 py-2 font-mono text-xs uppercase transition-colors flex items-center gap-2">
                    <RefreshCw size={12} /> Regenerate Key
                  </button>
                </>
              )}
              <div className="border border-border bg-blueprint/40 p-4">
                <div className="font-mono text-xs text-primary uppercase mb-2">// Quick Start</div>
                <pre className="font-mono text-[10px] text-muted-foreground overflow-x-auto">{`curl https://api.directioner.bot/v1/chat \\
  -H "Authorization: Bearer dk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"server_id":"...", "message":"Hello!"}'`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
