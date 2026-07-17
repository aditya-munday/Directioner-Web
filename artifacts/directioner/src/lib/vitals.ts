import type { Metric } from 'web-vitals';
import { trackEvent } from './analytics';

function reportMetric(metric: Metric) {
  trackEvent('Web Vital', {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating ?? 'unknown',
  });
}

export function reportWebVitals(): void {
  import('web-vitals')
    .then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(reportMetric);
      onINP(reportMetric);
      onLCP(reportMetric);
      onFCP(reportMetric);
      onTTFB(reportMetric);
    })
    .catch(() => {
      /* silently skip if web-vitals fails to load */
    });
}
