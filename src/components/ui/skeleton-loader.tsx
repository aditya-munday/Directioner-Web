import { cn } from '@/lib/utils';

/* ── Base shimmer box ─────────────────────────────────────────────────────── */
export function SkeletonBox({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('rounded-sm', className)}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

/* ── Text line ────────────────────────────────────────────────────────────── */
export function SkeletonText({ width = '100%', className }: { width?: string; className?: string }) {
  return <SkeletonBox className={cn('h-4', className)} style={{ width }} />;
}

/* ── Single card ─────────────────────────────────────────────────────────── */
export function SkeletonCard() {
  return (
    <div
      className="p-6 space-y-4"
      style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3 w-24" />
        </div>
      </div>
      <SkeletonBox className="h-14 w-full" />
      <div className="flex gap-2">
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-8 w-16" />
      </div>
    </div>
  );
}

/* ── Dashboard home skeleton ─────────────────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 md:p-8" role="status" aria-label="Loading dashboard…">
      <div className="space-y-2">
        <SkeletonBox className="h-8 w-64" />
        <SkeletonBox className="h-4 w-48" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 space-y-3"
            style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-8 w-20" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <SkeletonBox className="h-64 w-full" />

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonBox className="h-48 w-full" />
        <SkeletonBox className="h-48 w-full" />
      </div>
    </div>
  );
}

/* ── Bot list skeleton ───────────────────────────────────────────────────── */
export function BotListSkeleton() {
  return (
    <div className="space-y-4 p-6" role="status" aria-label="Loading servers…">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-9 w-36" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="p-5 space-y-3"
          style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="h-4 w-40" />
              <SkeletonBox className="h-3 w-28" />
            </div>
            <SkeletonBox className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex gap-4">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Analytics skeleton ──────────────────────────────────────────────────── */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 p-6" role="status" aria-label="Loading analytics…">
      <SkeletonBox className="h-8 w-56" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-5 space-y-3"
            style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-7 w-16" />
          </div>
        ))}
      </div>
      <SkeletonBox className="h-80 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonBox className="h-48 w-full" />
        <SkeletonBox className="h-48 w-full" />
      </div>
    </div>
  );
}