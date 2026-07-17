import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#0f0f12] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg font-mono text-[13px]',
          description: 'group-[.toast]:text-white/50',
          actionButton: 'group-[.toast]:bg-[#FFE500] group-[.toast]:text-black',
          cancelButton: 'group-[.toast]:bg-white/5 group-[.toast]:text-white/60',
          success: 'group-[.toaster]:border-emerald-500/20',
          error: 'group-[.toaster]:border-red-500/20',
          warning: 'group-[.toaster]:border-amber-500/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
