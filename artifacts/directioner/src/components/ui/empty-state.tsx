import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className ?? ''}`}
      role="status"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(255,229,0,0.08)', border: '1px solid rgba(255,229,0,0.15)' }}
      >
        <Icon size={28} style={{ color: '#FFE500' }} aria-hidden="true" />
      </div>
      <h3 className="font-display font-bold text-xl text-white mb-2">{title}</h3>
      <p className="font-mono text-sm max-w-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="font-mono text-xs uppercase tracking-widest px-6 py-3 font-semibold transition-all hover:opacity-90 active:scale-95 focus-visible:outline"
          style={{ background: '#FFE500', color: '#000', borderRadius: 2 }}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
