import { Link, useLocation } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md border border-border bg-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="p-12 text-center">
          <div className="font-mono text-6xl text-primary font-bold mb-6">404</div>
          <div className="font-mono text-xs text-muted-foreground mb-2">FIG.404 // ROUTE_NOT_FOUND</div>
          <h1 className="font-display text-2xl font-bold uppercase mb-8">Page does not exist.</h1>
          
          <Link href="/" className="inline-block border border-border font-mono text-xs uppercase px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
            Return to System
          </Link>
        </div>
        
        {/* Blueprint styling */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
    </div>
  );
}
