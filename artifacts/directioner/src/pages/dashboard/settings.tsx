import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, Copy, RefreshCw, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { TextScramble } from "@/components/animations/TextScramble";

const BORDER = "rgba(255,255,255,0.06)";
const CARD   = "#0f0f12";
const YELLOW = "#FFE500";

const TABS = ["profile", "security", "notifications", "appearance", "api"] as const;
type Tab = typeof TABS[number];

const NOTIF_DEFAULTS = {
  email_alerts:     true,
  usage_warnings:   true,
  billing_receipts: true,
  weekly_report:    false,
  discord_dm:       false,
};

const NOTIF_DESC: Record<string, string> = {
  email_alerts:     "Receive critical system alerts via email",
  usage_warnings:   "Warn when credits drop below 20%",
  billing_receipts: "Email receipt for every charge",
  weekly_report:    "Weekly digest of server activity",
  discord_dm:       "DM you on Discord for urgent alerts",
};

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative shrink-0 transition-colors"
      style={{ width: 44, height: 24, background: on ? YELLOW : "rgba(255,255,255,0.08)", border: `1px solid ${on ? YELLOW : BORDER}` }}>
      <div className="absolute top-1 w-4 h-4 transition-all"
        style={{ left: on ? "calc(100% - 20px)" : 4, background: on ? "#000" : "rgba(255,255,255,0.4)" }} />
    </button>
  );
}

export default function Settings() {
  usePageTitle("Settings");
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [username, setUsername]   = useState(user?.username ?? "");
  const [password, setPassword]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [notifs, setNotifs]       = useState(NOTIF_DEFAULTS);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyCopied,  setApiKeyCopied]  = useState(false);
  const MOCK_API_KEY = `dk_${user?.id?.slice(0, 8) ?? "xxxxxxxx"}xxxxxxxxxxxxxxxxxxx`;

  useEffect(() => { setUsername(user?.username ?? ""); }, [user]);

  const getStrength = (p: string) => {
    let s = 0;
    if (p.length > 7)             s += 25;
    if (/[A-Z]/.test(p))          s += 25;
    if (/[0-9]/.test(p))          s += 25;
    if (/[^A-Za-z0-9]/.test(p))   s += 25;
    return s;
  };
  const strength = getStrength(password);
  const strengthColor = strength < 50 ? "#f43f5e" : strength < 75 ? "#f97316" : "#10b981";
  const strengthLabel = strength < 25 ? "Weak" : strength < 50 ? "Fair" : strength < 75 ? "Good" : "Strong";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile({ username: username.trim() }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch {} finally { setSaving(false); }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPw) return;
    setSaving(true);
    try {
      await supabase.auth.updateUser({ password });
      setPassword(""); setConfirmPw("");
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch {} finally { setSaving(false); }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(MOCK_API_KEY);
    setApiKeyCopied(true); setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const fieldCls = "w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors";
  const fieldStyle = { background: "#070708", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <div className="space-y-8 pb-12">
      <header className="pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "rgba(255,255,255,0.25)" }}>ACCOUNT SETTINGS</div>
        <h1 className="font-display font-bold text-white leading-none"
          style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }}>
          Settings.
        </h1>
        <div className="font-mono text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          ID: {user?.id}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab nav */}
        <div className="w-full lg:w-44 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative shrink-0 text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wide transition-all"
                style={{
                  color: activeTab === tab ? YELLOW : "rgba(255,255,255,0.38)",
                  background: activeTab === tab ? "rgba(255,229,0,0.06)" : "transparent",
                  borderLeft: activeTab === tab ? `2px solid ${YELLOW}` : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* PROFILE */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-5 p-8 rounded-xl"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] pb-3 mb-2"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>
                    Profile Config
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center font-display font-black text-2xl shrink-0"
                      style={{ background: "rgba(255,229,0,0.1)", border: `2px solid rgba(255,229,0,0.25)`, color: YELLOW }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono text-xs text-white">{user?.username}</div>
                      <div className="font-mono text-[9px] uppercase tracking-widest mt-1 px-2 py-0.5 inline-block"
                        style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.2)", color: YELLOW }}>
                        {user?.tier} Plan
                      </div>
                    </div>
                  </div>
                  {[
                    { label: "Username", field: <input value={username} onChange={e => setUsername(e.target.value)} className={fieldCls} style={fieldStyle} onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }} onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }} /> },
                    { label: "Email",    field: <input value={user?.email} readOnly className={fieldCls} style={{ ...fieldStyle, cursor: "not-allowed", color: "rgba(255,255,255,0.35)" }} /> },
                    { label: "Member Since", field: <div className="font-mono text-sm py-3 px-4" style={{ color: "rgba(255,255,255,0.5)" }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</div> },
                  ].map(({ label, field }) => (
                    <div key={label}>
                      <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                        style={{ color: "rgba(255,255,255,0.35)" }}>{label}</label>
                      {field}
                    </div>
                  ))}
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3 transition-all disabled:opacity-50"
                    style={{ background: YELLOW, color: "#000" }}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
                    {saved ? "Saved!" : "Save Changes"}
                  </button>
                </form>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <form onSubmit={handleSavePassword} className="space-y-5 p-8 rounded-xl"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] pb-3 mb-2"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>
                    Security Config
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}>New Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`${fieldCls} pr-12`} style={fieldStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: "rgba(255,255,255,0.35)" }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[25, 50, 75, 100].map(v => (
                            <div key={v} className="flex-1 h-0.5 transition-colors"
                              style={{ background: strength >= v ? strengthColor : "rgba(255,255,255,0.06)" }} />
                          ))}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: strengthColor }}>
                          {strengthLabel}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Confirm Password</label>
                    <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                      className={fieldCls}
                      style={{ ...fieldStyle, borderColor: confirmPw && confirmPw !== password ? "#f43f5e" : "rgba(255,255,255,0.08)" }}
                      onFocus={e => { if (!confirmPw || confirmPw === password) e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = confirmPw && confirmPw !== password ? "#f43f5e" : "rgba(255,255,255,0.08)"; }} />
                    {confirmPw && confirmPw !== password && (
                      <div className="font-mono text-[9px] mt-1" style={{ color: "#f43f5e" }}>Passwords don't match</div>
                    )}
                  </div>
                  <div className="p-5 rounded-lg" style={{ background: "#070708", border: `1px solid ${BORDER}` }}>
                    <div className="font-mono text-[10px] uppercase tracking-widest mb-2"
                      style={{ color: "rgba(255,255,255,0.3)" }}>Two-Factor Authentication</div>
                    <div className="font-mono text-sm text-white mb-3">Not configured</div>
                    <button type="button" className="font-mono text-xs uppercase tracking-wide transition-colors"
                      style={{ color: YELLOW }}>
                      Set up 2FA →
                    </button>
                  </div>
                  <button type="submit" disabled={saving || !password || password !== confirmPw}
                    className="flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3 transition-all disabled:opacity-40"
                    style={{ background: YELLOW, color: "#000" }}>
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    Update Password
                  </button>
                </form>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="p-8 rounded-xl space-y-1"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] pb-3 mb-5"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>
                    Notification Config
                  </div>
                  {Object.entries(notifs).map(([key, val]) => (
                    <div key={key}
                      className="flex items-center justify-between py-4"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <div>
                        <div className="font-mono text-sm text-white capitalize mb-0.5">
                          {key.replace(/_/g, " ")}
                        </div>
                        <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {NOTIF_DESC[key]}
                        </div>
                      </div>
                      <Toggle on={val} onChange={() => setNotifs(p => ({ ...p, [key]: !val }))} />
                    </div>
                  ))}
                  <div className="pt-4">
                    <button className="font-mono font-bold text-sm uppercase tracking-wide px-7 py-3 transition-all"
                      style={{ background: YELLOW, color: "#000" }}>
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* APPEARANCE */}
              {activeTab === "appearance" && (
                <div className="p-8 rounded-xl space-y-6"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] pb-3"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>
                    Appearance Config
                  </div>
                  {[
                    { label: "Theme",       options: ["Dark (required)", "Dark High Contrast"], current: 0 },
                    { label: "UI Density",  options: ["Comfortable", "Compact", "Cozy"],        current: 0 },
                    { label: "Date Format", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], current: 2 },
                    { label: "Timezone",    options: ["UTC", "UTC-5 (EST)", "UTC+1 (CET)", "UTC+5:30 (IST)"], current: 0 },
                  ].map(s => (
                    <div key={s.label}>
                      <label className="font-mono text-[10px] uppercase tracking-widest block mb-3"
                        style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</label>
                      <div className="flex flex-wrap gap-2">
                        {s.options.map((o, i) => (
                          <button key={o}
                            className="px-4 py-2 font-mono text-xs transition-all"
                            style={i === s.current
                              ? { background: YELLOW, color: "#000", fontWeight: "bold" }
                              : { border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
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
                <div className="p-8 rounded-xl space-y-6"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] pb-3"
                    style={{ color: YELLOW, borderBottom: `1px solid ${BORDER}` }}>
                    API Access
                  </div>
                  {user?.tier !== "max" ? (
                    <div className="py-12 text-center rounded-lg"
                      style={{ border: `1px dashed ${BORDER}` }}>
                      <div className="font-mono text-xs uppercase mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
                        API access requires Max tier
                      </div>
                      <a href="/dashboard/billing"
                        className="inline-block font-mono font-bold text-sm uppercase tracking-wide px-6 py-3"
                        style={{ background: YELLOW, color: "#000" }}>
                        Upgrade to Max
                      </a>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                          style={{ color: "rgba(255,255,255,0.35)" }}>API Key</label>
                        <div className="flex gap-2">
                          <div className="flex-1 px-4 py-3 font-mono text-xs overflow-hidden"
                            style={{ background: "#070708", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                            {apiKeyVisible ? MOCK_API_KEY : "•".repeat(40)}
                          </div>
                          <button onClick={() => setApiKeyVisible(!apiKeyVisible)}
                            className="px-3 transition-colors"
                            style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
                            {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button onClick={copyApiKey}
                            className="px-3 transition-colors"
                            style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = YELLOW; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
                            {apiKeyCopied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 font-mono text-xs uppercase px-5 py-2 transition-all"
                        style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
                        <RefreshCw size={12} /> Regenerate Key
                      </button>
                    </>
                  )}
                  <div className="p-5 rounded-lg" style={{ background: "#070708", border: `1px solid ${BORDER}` }}>
                    <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: YELLOW }}>Quick Start</div>
                    <pre className="font-mono text-[10px] leading-relaxed overflow-x-auto"
                      style={{ color: "rgba(255,255,255,0.45)" }}>{`curl https://api.directioner.bot/v1/chat \\
  -H "Authorization: Bearer dk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"server_id":"...", "message":"Hello!"}'`}</pre>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
