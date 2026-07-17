/**
 * Plausible Analytics wrapper — privacy-first, no cookies, GDPR compliant.
 * The script is loaded via <script defer> tag in index.html.
 *
 * Usage:
 *   trackEvent('Upgrade Plan', { plan: 'pro' });
 *   trackEvent('Bot Created');
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean>; callback?: () => void },
    ) => void;
  }
}

export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, props ? { props } : undefined);
  }
  if (import.meta.env.DEV) {
    console.debug('[Analytics]', eventName, props ?? '');
  }
}

export function trackPageView(): void {
  // Plausible auto-tracks the initial page load; call this for SPA route changes.
  trackEvent('pageview');
}
