export function SectionLabel({ number, name }: { number: string; name: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-6 h-6 bg-primary flex items-center justify-center shrink-0">
        <span className="font-mono text-[10px] text-black font-bold">{number}</span>
      </div>
      <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">&gt; {name}</span>
    </div>
  );
}
