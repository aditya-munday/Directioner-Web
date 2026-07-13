import { usePageTitle } from "@/hooks/use-page-title";
import { useBilling } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Check, Download, CreditCard as CardIcon, RefreshCw, Lock, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, credits: 500, dailyLimit: 50,
    features: ['500 credits/month', '1 Discord server', 'Text only', '50 memory nodes', 'Community support'],
  },
  {
    id: 'basic', name: 'Basic', price: 4.99, credits: 5000, dailyLimit: 300,
    features: ['5,000 credits/month', '3 Discord servers', 'Text + voice (60min/day)', '500 memory nodes', 'Email support'],
  },
  {
    id: 'pro', name: 'Pro', price: 14.99, credits: 25000, dailyLimit: 1500, popular: true,
    features: ['25,000 credits/month', '10 Discord servers', 'Unlimited voice', '5,000 memory nodes', 'Priority support (4h)', 'GPT-4o access', 'Advanced analytics'],
  },
  {
    id: 'max', name: 'Max', price: 39.99, credits: Infinity, dailyLimit: Infinity,
    features: ['Unlimited credits', 'Unlimited servers', 'Unlimited voice', 'Unlimited memory', 'Dedicated SLA support', 'All models', 'API access + white-label'],
  },
];

const COUPON_CODES: Record<string, { desc: string; discount: number }> = {
  DISCORD20: { desc: '20% off first month', discount: 20 },
  BETA10: { desc: '10% off', discount: 10 },
  FREEPRO: { desc: '1 month Pro free', discount: 100 },
};

export default function Billing() {
  usePageTitle("Billing");
  const { user, updateProfile } = useAuth();
  const { data: history = [], loading, refetch } = useBilling(user?.id);
  const [upgrading, setUpgrading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponResult, setCouponResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = PLANS.find(p => p.id === user?.tier) ?? PLANS[0];
  const creditsUsed = user?.credits_used ?? 0;
  const creditsLimit = user?.credits_limit ?? 500;
  const isUnlimited = creditsLimit === Infinity || creditsLimit === 9999999;
  const creditPct = isUnlimited ? 10 : Math.min(100, Math.round((creditsUsed / creditsLimit) * 100));

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPON_CODES[code]) {
      setCouponResult({ success: true, msg: `✓ Applied: ${COUPON_CODES[code].desc}` });
    } else {
      setCouponResult({ success: false, msg: '✗ Invalid code' });
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === user?.tier) return;
    setUpgrading(true);
    setSelectedPlan(planId);
    const plan = PLANS.find(p => p.id === planId)!;
    try {
      // In production, this would go through Stripe. Here we update Supabase directly.
      await supabase.from('profiles').update({
        tier: planId,
        credits_limit: plan.credits === Infinity ? 9999999 : plan.credits,
      }).eq('id', user!.id);
      await updateProfile({ tier: planId as any, credits_limit: plan.credits === Infinity ? 9999999 : plan.credits });
      // Add billing record
      if (plan.price > 0) {
        await supabase.from('billing_history').insert({
          user_id: user!.id,
          amount: plan.price,
          status: 'paid',
          description: `${plan.name} Plan — Monthly`,
        });
        await refetch();
      }
      setShowUpgrade(false);
    } catch (e) {
      console.error(e);
    } finally {
      setUpgrading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start pb-12">
      <div className="flex-1 space-y-12 w-full min-w-0">
        <header>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Billing & Plans.</h1>
          <p className="font-mono text-sm text-muted-foreground uppercase">Manage your subscription and credits.</p>
        </header>

        {/* Current Plan Panel */}
        <div className="bg-blueprint border border-white/10 p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 font-mono text-xs text-primary/70">FIG.01 // CURRENT PLAN</div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-5xl font-display font-black text-white">{currentPlan.name.toUpperCase()}</h2>
            <div className="bg-primary text-black font-mono text-[10px] font-bold px-2 py-1 uppercase border border-black">Active</div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between font-mono text-xs uppercase">
              <span className="text-blueprint-foreground opacity-70">Credits Remaining</span>
              <span className="text-white">
                {isUnlimited ? '∞ Unlimited' : `${(creditsLimit - creditsUsed).toLocaleString()} / ${creditsLimit.toLocaleString()}`}
              </span>
            </div>
            <div className="w-full h-2 bg-black overflow-hidden border border-white/10">
              <div
                className={cn("h-full transition-all duration-700", creditPct > 80 ? "bg-red-500" : creditPct > 60 ? "bg-orange-400" : "bg-primary")}
                style={{ width: `${creditPct}%` }}
              />
            </div>
            <div className="font-mono text-[10px] text-blueprint-foreground opacity-50">{isUnlimited ? '∞ Unlimited credits' : `${creditPct}% used · Resets monthly`}</div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowUpgrade(!showUpgrade)} className="bg-primary text-black font-mono font-bold px-6 py-3 uppercase text-xs corner-brackets hover:bg-white transition-colors">
              {showUpgrade ? 'Hide Plans' : 'Upgrade Plan'}
            </button>
            {user?.tier !== 'free' && (
              <button onClick={() => handleUpgrade('free')} className="border border-white/20 text-white font-mono text-xs uppercase px-6 py-3 hover:bg-white/10 transition-colors">
                Downgrade to Free
              </button>
            )}
          </div>
        </div>

        {/* Plan Cards */}
        {showUpgrade && (
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PLANS.map(plan => {
              const isCurrent = plan.id === user?.tier;
              return (
                <div key={plan.id} className={cn("border p-6 relative flex flex-col transition-colors", isCurrent ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40")}>
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-px left-4 right-4 h-px bg-primary" />
                  )}
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-black font-mono text-[9px] font-bold px-3 py-1 uppercase whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="font-display font-bold text-xl uppercase mb-1 text-white">{plan.name}</div>
                    <div className="text-3xl font-display font-black text-white">
                      {plan.price === 0 ? '$0' : `$${plan.price}`}
                      <span className="text-sm font-mono font-normal text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 font-mono text-xs text-muted-foreground">
                        <Check size={12} className="text-accent mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || upgrading}
                    className={cn("w-full py-2.5 font-mono text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2",
                      isCurrent ? "bg-primary/20 text-primary border border-primary cursor-default" : "bg-primary text-black hover:bg-white"
                    )}
                  >
                    {upgrading && selectedPlan === plan.id ? <RefreshCw size={12} className="animate-spin" /> : null}
                    {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Method */}
        <section>
          <h3 className="font-mono text-sm font-bold uppercase text-primary mb-6">02 &gt; Payment Method</h3>
          <div className="border border-border bg-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-white text-black flex items-center justify-center">
                <CardIcon size={18} />
              </div>
              <div>
                <div className="font-mono text-sm">•••• •••• •••• 4242</div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase">Expires 12/27</div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Lock size={12} />
              <span className="hidden sm:inline">Secured by Stripe</span>
            </div>
          </div>
        </section>

        {/* Billing History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono text-sm font-bold uppercase text-primary">03 &gt; Billing History</h3>
            <button onClick={() => refetch()} className="text-muted-foreground hover:text-white transition-colors">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="border border-border bg-card overflow-hidden">
            <table className="w-full text-left font-mono text-sm">
              <thead className="border-b border-border bg-background">
                <tr>
                  <th className="p-4 font-normal text-muted-foreground uppercase text-xs">Date</th>
                  <th className="p-4 font-normal text-muted-foreground uppercase text-xs">Description</th>
                  <th className="p-4 font-normal text-muted-foreground uppercase text-xs">Amount</th>
                  <th className="p-4 font-normal text-muted-foreground uppercase text-xs">Status</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center">
                    <RefreshCw size={16} className="animate-spin text-muted-foreground mx-auto" />
                  </td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center font-mono text-xs text-muted-foreground">
                    // NO BILLING HISTORY
                  </td></tr>
                ) : (
                  history.map(inv => (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="p-4">{inv.description ?? 'Plan charge'}</td>
                      <td className="p-4">${Number(inv.amount).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={cn("flex items-center gap-1 text-[10px] uppercase",
                          inv.status === 'paid' ? "text-accent" : inv.status === 'failed' ? "text-red-500" : "text-muted-foreground"
                        )}>
                          <Check size={10} /> {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {inv.invoice_url ? (
                          <a href={inv.invoice_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Download invoice">
                            <Download size={14} />
                          </a>
                        ) : (
                          <span className="text-muted-foreground/30 cursor-not-allowed" title="No invoice available">
                            <Download size={14} />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Sticky Summary */}
      <div className="w-full lg:w-80 shrink-0 border border-border bg-card p-6 sticky top-24">
        <div className="font-mono text-primary font-bold uppercase text-xs mb-6 border-b border-border pb-2">// Billing Summary</div>
        <div className="space-y-4 font-mono text-sm mb-8">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <span className="text-white">{currentPlan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly</span>
            <span className="text-white">{currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credits</span>
            <span className="text-white">{isUnlimited ? '∞' : creditsLimit.toLocaleString()}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Charge</span>
            <span className="text-white">{(() => {
              const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(1);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            })()}</span>
          </div>
        </div>
        <div className="pt-4 border-t border-border space-y-3">
          <label className="font-mono text-xs uppercase text-muted-foreground block">Apply Coupon</label>
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={e => { setCoupon(e.target.value); setCouponResult(null); }}
              className="flex-1 bg-background border border-border px-3 py-2 font-mono text-xs focus:outline-none focus:border-primary uppercase"
              placeholder="CODE"
            />
            <button onClick={applyCoupon} className="bg-primary text-black px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-white transition-colors">
              Apply
            </button>
          </div>
          {couponResult && (
            <div className={cn("font-mono text-xs", couponResult.success ? "text-accent" : "text-red-400")}>
              {couponResult.msg}
            </div>
          )}
          <div className="font-mono text-[10px] text-muted-foreground">Try: DISCORD20 · BETA10 · FREEPRO</div>
        </div>
        {user?.tier !== 'max' && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-1 font-mono text-[10px] text-primary uppercase mb-2">
              <Zap size={10} /> Upgrade for more
            </div>
            <button onClick={() => setShowUpgrade(true)} className="w-full bg-primary text-black font-mono text-xs font-bold uppercase py-3 corner-brackets hover:bg-white transition-colors">
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
