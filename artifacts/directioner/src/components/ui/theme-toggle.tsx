import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle — persists dark/light preference in localStorage.
 * Reads/writes the 'light' class on <html>. Works without next-themes.
 */
export function ThemeToggle({ size = 16 }: { size?: number }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains('light'));
  }, []);

  const toggle = () => {
    const nowLight = document.documentElement.classList.toggle('light');
    setIsDark(!nowLight);
    try {
      localStorage.setItem('directioner-theme', nowLight ? 'light' : 'dark');
    } catch {
      // ignore storage errors
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded transition-colors hover:bg-white/5 focus-visible:outline"
      style={{ color: 'rgba(255,255,255,0.5)' }}
    >
      {isDark
        ? <Sun size={size} aria-hidden="true" />
        : <Moon size={size} aria-hidden="true" />}
    </button>
  );
}
