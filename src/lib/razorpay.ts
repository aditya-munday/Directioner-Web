/**
 * Razorpay checkout integration.
 * Loads the Razorpay script on demand and opens the checkout modal.
 *
 * Required env var: VITE_RAZORPAY_KEY_ID
 * Set this in Replit Secrets (Settings → Secrets).
 */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (INR smallest unit)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: () => void): void;
}

/** Load the Razorpay checkout script (idempotent). */
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.head.appendChild(script);
  });
}

export interface OpenCheckoutOptions {
  planName: string;
  /** Price in INR (e.g. 14.99 → 1499 paise internally) */
  priceINR: number;
  userName?: string;
  userEmail?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}

/** Open the Razorpay checkout modal for a plan purchase. */
export async function openRazorpayCheckout({
  planName,
  priceINR,
  userName,
  userEmail,
  onSuccess,
  onDismiss,
}: OpenCheckoutOptions): Promise<void> {
  await loadRazorpayScript();

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

  if (!key) {
    throw new Error(
      'VITE_RAZORPAY_KEY_ID is not set. Add it to your Replit Secrets to enable payments.'
    );
  }

  const rzp = new window.Razorpay({
    key,
    amount: Math.round(priceINR * 100), // convert to paise
    currency: 'INR',
    name: 'Directioner',
    description: `${planName} Plan — Monthly Subscription`,
    image: '/favicon.ico',
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: { color: '#FFE500' },
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  });

  rzp.open();
}
