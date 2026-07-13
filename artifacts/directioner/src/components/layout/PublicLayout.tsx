import { Link, useLocation } from "wouter";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import logoSrc from "@assets/Directioner_1783857395826.png";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Don't show public navbar on dashboard routes
  if (location.startsWith("/dashboard")) return null;

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b",
          isScrolled 
            ? "bg-primary text-primary-foreground border-transparent" 
            : "bg-transparent text-foreground border-border backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-display font-bold text-xl tracking-tighter">
            <img src={logoSrc} alt="Directioner" className="w-8 h-8 object-contain mix-blend-difference" />
            <span className={cn(isScrolled && "text-black")}>DIRECTIONER</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase font-medium">
            <Link href="/features" className="hover:opacity-70 transition-opacity">Features</Link>
            <Link href="/commands" className="hover:opacity-70 transition-opacity">Commands</Link>
            <Link href="/use-cases" className="hover:opacity-70 transition-opacity">Use Cases</Link>
            <Link href="/explore" className="hover:opacity-70 transition-opacity">Explore</Link>
            <Link href="/pricing" className="hover:opacity-70 transition-opacity">Pricing</Link>
            <Link href="/faq" className="hover:opacity-70 transition-opacity">FAQ</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="font-mono text-xs uppercase px-4 py-2 border border-current hover:bg-foreground/10 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="font-mono text-xs uppercase hover:opacity-70">Sign In</Link>
                <Link href="/register" className={cn(
                  "font-mono text-xs uppercase px-4 py-2 corner-brackets transition-colors",
                  isScrolled ? "bg-black text-primary" : "bg-primary text-black"
                )}>
                  Add to Discord ↗
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur pt-24 px-6 flex flex-col gap-6 font-mono text-sm uppercase">
          <Link href="/features" onClick={()=>setMobileMenuOpen(false)}>Features</Link>
          <Link href="/commands" onClick={()=>setMobileMenuOpen(false)}>Commands</Link>
          <Link href="/use-cases" onClick={()=>setMobileMenuOpen(false)}>Use Cases</Link>
          <Link href="/explore" onClick={()=>setMobileMenuOpen(false)}>Explore</Link>
          <Link href="/pricing" onClick={()=>setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/faq" onClick={()=>setMobileMenuOpen(false)}>FAQ</Link>
          <hr className="border-border" />
          {user ? (
             <Link href="/dashboard" onClick={()=>setMobileMenuOpen(false)}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" onClick={()=>setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/register" onClick={()=>setMobileMenuOpen(false)} className="bg-primary text-black px-4 py-2 text-center w-full mt-4">Add to Discord</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export function Footer() {
  const [location] = useLocation();
  if (location.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-border bg-card pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 font-display font-bold text-xl tracking-tighter mb-4">
              <img src={logoSrc} alt="Directioner" className="w-8 h-8 object-contain" />
              <span>DIRECTIONER</span>
            </div>
            <div className="font-mono text-xs text-muted-foreground mb-6">
              // DISCORD BOT ——————————————— V1.0.0
            </div>
            <p className="text-sm text-muted-foreground">
              Production-grade AI for Discord communities. Built for precision, performance, and scale.
            </p>
          </div>
          
          <div className="flex gap-16 font-mono text-xs uppercase">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold mb-2">Product</span>
              <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="/commands" className="hover:text-primary transition-colors">Commands</Link>
              <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold mb-2">Resources</span>
              <Link href="/use-cases" className="hover:text-primary transition-colors">Use Cases</Link>
              <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold mb-2">Legal</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Directioner. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Released under MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
