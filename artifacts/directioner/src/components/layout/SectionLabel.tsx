export function SectionLabel({ number, label, name }: { number: string; label?: string; name?: string }) {
  const text = label ?? name ?? "";
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-6 h-6 bg-primary flex items-center justify-center shrink-0">
        <span className="font-mono text-[10px] text-black font-bold">{number}</span>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">&gt; {text}</span>
    </div>
  );
}
