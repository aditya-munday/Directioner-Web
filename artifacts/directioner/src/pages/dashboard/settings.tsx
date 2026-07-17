import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, Copy, RefreshCw, Check, Trash2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { deleteAllMemoryNodes } from "@/lib/db";

const BORDER = "rgba(255,255,255,0.06)";
const CARD   = "#0f0f12";
const YELLOW = "#FFE500";

const TABS = ["profile", "notifications", "security", "danger"] as const;
type Tab = typeof TABS[number];

const NOTIF_ITEMS = [
  { key: "email_alerts",     label: "Email Notifications",  desc: "Receive critical system alerts via email" },
  { key: "discord_dm",       label: "Discord DMs",          desc: "DM you on Discord for urgent alerts" },
  { key: "billing_receipts", label: "Billing Alerts",       desc: "Email receipt for every charge and billing event" },
  { key: "weekly_report",    label: "Weekly Digest",        desc: "Weekly summary of server activity sent every Monday" },
  { key: "usage_warnings",   label: "Usage Warnings",       desc: "Warn when credits drop below 20% of your limit" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative shrink-0 transition-all"
      style={{
        width: 44, height: 24,
        background: on ? YELLOW : "rgba(255,255,255,0.08)",
        border: `1px solid ${on ? YELLOW : BORDER}`,
      }}
    >
      <div className="absolute top-1 w-4 h-4 transition-all"
        style={{ left: on ? "calc(100% - 20px)" : 4, background: on ? "#000" : "rgba(255,255,255,0.4)" }} />
    </button>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 pb-4 mb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: YELLOW }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: BORDER }} />
    </div>
  );
}

export default function Settings() {
  usePageTitle("Settings");
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile
  const [username, setUsername]   = useState(user?.username ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedProfile, setSavedProfile]   = useState(false);
  const [profileError, setProfileError]   = useState("");

  // Notifications (UI only — no backend yet)
  const [notifs, setNotifs] = useState({
    email_alerts: true, discord_dm: false, billing_receipts: true, weekly_report: false, usage_warnings: true,
  });
  const [savingNotifs, setSavingNotifs]   = useState(false);
  const [savedNotifs, setSavedNotifs]     = useState(false);

  // Security
  const [password, setPassword]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [savingPw, setSavingPw]   = useState(false);
  const [savedPw, setSavedPw]     = useState(false);
  const [pwError, setPwError]     = useState("");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyCopied, setApiKeyCopied]   = useState(false);
  const MOCK_API_KEY = `dk_${user?.id?.slice(0, 8) ?? "xxxxxxxx"}xxxxxxxxxxxxxxxxxxx`;

  // Danger zone
  const [deleteMemInput, setDeleteMemInput] = useState("");
  const [deleteAccInput, setDeleteAccInput] = useState("");
  const [deletingMem, setDeletingMem]       = useState(false);
  const [deletingAcc, setDeletingAcc]       = useState(false);
  const [memDeleted, setMemDeleted]         = useState(false);
  const [dangerError, setDangerError]       = useState("");

  useEffect(() => { setUsername(user?.username ?? ""); }, [user]);

  const pwStrength = (() => {
    let s = 0;
    if (password.length >= 8)            s += 25;
    if (/[A-Z]/.test(password))          s += 25;
    if (/[0-9]/.test(password))          s += 25;
    if (/[^A-Za-z0-9]/.test(password))   s += 25;
    return s;
  })();
  const strengthColor = pwStrength < 50 ? "#f43f5e" : pwStrength < 75 ? "#f97316" : "#10b981";
  const strengthLabel = pwStrength < 25 ? "Weak" : pwStrength < 50 ? "Fair" : pwStrength < 75 ? "Good" : "Strong";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) { setProfileError("Username cannot be empty."); return; }
    if (trimmed.length > 64) { setProfileError("Username too long (max 64 characters)."); return; }
    setProfileError("");
    setSavingProfile(true);
    try {
      await updateProfile({ username: trimmed });
      setSavedProfile(true); setTimeout(() => setSavedProfile(false), 2500);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally { setSavingProfile(false); }
  };

  const handleSaveNotifs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifs(true);
    // Notification preferences stored locally for now (no backend endpoint yet)
    await new Promise(r => setTimeout(r, 400));
    setSavingNotifs(false); setSavedNotifs(true);
    setTimeout(() => setSavedNotifs(false), 2500);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (password.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (password !== confirmPw) { setPwError("Passwords do not match."); return; }
    if (!supabase) { setPwError("Supabase not configured."); return; }
    setSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword(""); setConfirmPw("");
      setSavedPw(true); setTimeout(() => setSavedPw(false), 2500);
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed to update password.");
    } finally { setSavingPw(false); }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(MOCK_API_KEY);
    setApiKeyCopied(true); setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleDeleteMemory = async () => {
    if (deleteMemInput !== "DELETE") return;
    if (!user?.id) return;
    setDangerError("");
    setDeletingMem(true);
    try {
      await deleteAllMemoryNodes(user.id);
      setMemDeleted(true); setDeleteMemInput("");
      setTimeout(() => setMemDeleted(false), 3000);
    } catch (err: unknown) {
      setDangerError(err instanceof Error ? err.message : "Failed to delete memory nodes.");
    } finally { setDeletingMem(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccInput !== "DELETE") return;
    if (!user?.id || !supabase) return;
    setDangerError("");
    setDeletingAcc(true);
    try {
      // Delete all user data, then sign out (Supabase cascade deletes handle DB rows)
      await deleteAllMemoryNodes(user.id);
      // Sign out first so the session is invalidated
      await logout();
      // Note: full account deletion requires a Supabase admin API call from the server
      // For now we sign the user out and redirect — server-side deletion can be a follow-up
    } catch (err: unknown) {
      setDangerError(err instanceof Error ? err.message : "Failed to delete account.");
      setDeletingAcc(false);
    }
  };

  const fieldCls = "w-full px-4 py-3 font-mono text-sm text-white focus:outline-none transition-colors";
  const fieldStyle = { background: "#070708", border: "1px solid rgba(255,255,255,0.08)" };

  const SaveBtn = ({ saving, saved, disabled }: { saving: boolean; saved: boolean; disabled?: boolean }) => (
    <button type="submit" disabled={saving || disabled}
      className="flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-7 py-3 transition-all disabled:opacity-50"
      style={{ background: saved ? "#10b981" : YELLOW, color: "#000" }}>
      {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
      {saved ? "Saved ✓" : "Save Changes"}
    </button>
  );

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
          ID: {user?.id ?? "—"}
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
                }}>
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
                  <SectionTitle title="Profile" />
                  {/* Avatar row */}
                  <div className="flex items-center gap-4 pb-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <div className="w-16 h-16 flex items-center justify-center font-display font-black text-2xl shrink-0 rounded-full"
                      style={{ background: "rgba(255,229,0,0.1)", border: `2px solid rgba(255,229,0,0.25)`, color: YELLOW }}>
                      {(user?.username ?? "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono text-sm text-white font-bold">{user?.username}</div>
                      <div className="font-mono text-[9px] uppercase tracking-widest mt-1.5 px-2 py-0.5 inline-block"
                        style={{ background: "rgba(255,229,0,0.1)", border: "1px solid rgba(255,229,0,0.2)", color: YELLOW }}>
                        {user?.tier ?? "free"} Plan
                      </div>
                    </div>
                  </div>
                  {/* Fields */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Display Name / Username</label>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      maxLength={64}
                      className={fieldCls} style={fieldStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,229,0,0.4)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    />
                    {profileError && (
                      <p className="font-mono text-[10px] mt-1" style={{ color: "#f43f5e" }}>{profileError}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Email (read-only)</label>
                    <input value={user?.email ?? ""} readOnly className={fieldCls}
                      style={{ ...fieldStyle, cursor: "not-allowed", color: "rgba(255,255,255,0.35)" }} />
                    <div className="font-mono text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                      Email cannot be changed here — contact support if needed.
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Member Since</label>
                    <div className="font-mono text-sm py-3 px-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </div>
                  </div>
                  <SaveBtn saving={savingProfile} saved={savedProfile} />
                </form>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <form onSubmit={handleSaveNotifs} className="p-8 rounded-xl space-y-1"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <SectionTitle title="Notifications" />
                  {NOTIF_ITEMS.map(item => (
                    <div key={item.key}
                      className="flex items-center justify-between py-4"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <div>
                        <div className="font-mono text-sm text-white mb-0.5">{item.label}</div>
                        <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                      </div>
                      <Toggle
                        on={notifs[item.key as keyof typeof notifs]}
                        onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifs] }))}
                      />
                    </div>
                  ))}
                  <div className="pt-5">
                    <SaveBtn saving={savingNotifs} saved={savedNotifs} />
                  </div>
                </form>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <div className="space-y-5">
                  <form onSubmit={handleSavePassword} className="space-y-5 p-8 rounded-xl"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <SectionTitle title="Change Password" />
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                        style={{ color: "rgba(255,255,255,0.35)" }}>New Password</label>
                      <div className="relative">
                        <input type={showPw ? "text" : "password"} value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Min. 8 characters"
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
                                style={{ background: pwStrength >= v ? strengthColor : "rgba(255,255,255,0.06)" }} />
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
                    {pwError && (
                      <div className="font-mono text-xs px-4 py-3"
                        style={{ background: "rgba(244,63,94,0.07)", border: "1px solid rgba(244,63,94,0.25)", color: "#f43f5e" }}>
                        {pwError}
                      </div>
                    )}
                    <SaveBtn saving={savingPw} saved={savedPw} disabled={!password || password !== confirmPw || password.length < 8} />
                  </form>
                  {/* API Key */}
                  <div className="space-y-5 p-8 rounded-xl"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <SectionTitle title="API Access" />
                    {user?.tier !== "max" ? (
                      <div className="py-10 text-center rounded-lg" style={{ border: `1px dashed ${BORDER}` }}>
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
                            <button type="button" onClick={() => setApiKeyVisible(!apiKeyVisible)}
                              className="px-3 transition-colors"
                              style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                              {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button type="button" onClick={copyApiKey}
                              className="px-3 transition-colors"
                              style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                              {apiKeyCopied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                        <button type="button" className="flex items-center gap-2 font-mono text-xs uppercase px-5 py-2 transition-all"
                          style={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                          <RefreshCw size={12} /> Regenerate Key
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* DANGER ZONE */}
              {activeTab === "danger" && (
                <div className="space-y-5">
                  <div className="p-8 rounded-xl" style={{ background: CARD, border: `1px solid rgba(244,63,94,0.2)` }}>
                    <SectionTitle title="Danger Zone" />

                    {dangerError && (
                      <div className="mb-4 p-3 font-mono text-xs rounded"
                        style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "#f43f5e" }}>
                        {dangerError}
                      </div>
                    )}

                    {/* Delete memory nodes */}
                    <div className="mb-8">
                      <div className="flex items-start gap-3 mb-4">
                        <Trash2 size={16} style={{ color: "#f43f5e" }} className="shrink-0 mt-0.5" />
                        <div>
                          <div className="font-mono text-sm text-white font-bold mb-1">Delete All Memory Nodes</div>
                          <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Permanently deletes all memory nodes across all servers. This cannot be undone.
                          </div>
                        </div>
                      </div>
                      {memDeleted ? (
                        <div className="p-3 font-mono text-xs rounded"
                          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                          ✓ All memory nodes deleted successfully.
                        </div>
                      ) : (
                        <>
                          <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}>Type DELETE to confirm</label>
                          <div className="flex gap-2">
                            <input
                              value={deleteMemInput}
                              onChange={e => setDeleteMemInput(e.target.value)}
                              placeholder="DELETE"
                              className="flex-1 px-4 py-2.5 font-mono text-sm text-white focus:outline-none"
                              style={{ background: "#070708", border: "1px solid rgba(244,63,94,0.25)" }}
                            />
                            <button
                              onClick={handleDeleteMemory}
                              disabled={deleteMemInput !== "DELETE" || deletingMem}
                              className="px-5 font-mono text-xs uppercase font-bold transition-all disabled:opacity-40 flex items-center gap-2"
                              style={{ border: "1px solid rgba(244,63,94,0.5)", color: "#f43f5e", background: deleteMemInput === "DELETE" ? "rgba(244,63,94,0.1)" : "transparent" }}>
                              {deletingMem ? <RefreshCw size={12} className="animate-spin" /> : <Trash2 size={12} />}
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Delete account */}
                    <div className="pt-6" style={{ borderTop: `1px solid rgba(244,63,94,0.15)` }}>
                      <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle size={16} style={{ color: "#f43f5e" }} className="shrink-0 mt-0.5" />
                        <div>
                          <div className="font-mono text-sm text-white font-bold mb-1">Delete Account</div>
                          <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Signs you out and clears your local data. Full account deletion requires contacting support.
                          </div>
                        </div>
                      </div>
                      <label className="font-mono text-[10px] uppercase tracking-widest block mb-2"
                        style={{ color: "rgba(255,255,255,0.35)" }}>Type DELETE to confirm</label>
                      <div className="flex gap-2">
                        <input
                          value={deleteAccInput}
                          onChange={e => setDeleteAccInput(e.target.value)}
                          placeholder="DELETE"
                          className="flex-1 px-4 py-2.5 font-mono text-sm text-white focus:outline-none"
                          style={{ background: "#070708", border: "1px solid rgba(244,63,94,0.25)" }}
                        />
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteAccInput !== "DELETE" || deletingAcc}
                          className="px-5 font-mono text-xs uppercase font-bold transition-all disabled:opacity-40 flex items-center gap-2"
                          style={{ background: deleteAccInput === "DELETE" ? "#f43f5e" : "transparent", border: "1px solid rgba(244,63,94,0.5)", color: deleteAccInput === "DELETE" ? "#fff" : "#f43f5e" }}>
                          {deletingAcc ? <RefreshCw size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
                          Delete Account
                        </button>
                      </div>
                    </div>
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
