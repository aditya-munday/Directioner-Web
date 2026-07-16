import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./_group.css";

const DirectionerLogo = ({ size = 40, color = "currentColor" }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 1000 900" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M551.81,896.38H0l282.04-387.8c-9.4-3.04-18.69-6.49-27.86-10.37-40.28-17.04-76.44-41.41-107.48-72.45-30.45-30.45-54.49-65.84-71.48-105.21-18.51-42.91-27.58-89.31-27.58-136.04V0h504.17c60.47,0,119.17,11.86,174.48,35.25,53.38,22.58,101.3,54.88,142.44,96.02,41.14,41.14,73.44,89.06,96.02,142.44,23.39,55.3,35.25,114.01,35.25,174.48s-11.86,119.18-35.25,174.48c-22.58,53.38-54.88,101.3-96.02,142.44-41.14,41.14-89.06,73.44-142.44,96.02-55.3,23.39-114.01,35.25-174.48,35.25Z" />
    <path d="M282.04,508.57l-209.91,288.63h187.22l37.46-51.97,160.31-220.42h-70.77c-36.38,0-71.41-5.73-104.26-16.34l-.05.1Z" opacity="0.5" />
  </svg>
);

const GlobeSVG = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SunMoonSVG = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export function Homepage() {
  const [animStage, setAnimStage] = useState("loading"); // loading, revealed
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    // Intro counter logic
    const duration = 2500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const val = Math.min(Math.round((currentStep / steps) * 100), 100);
      setCount(val);
      if (val >= 100) {
        clearInterval(interval);
        setTimeout(() => setAnimStage("revealed"), 200);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const intv = setInterval(updateTime, 60000);
    return () => clearInterval(intv);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const heroIcons = [
    { bg: "#9b59b6", emoji: "🤖" },
    { bg: "#3498db", emoji: "🎮" },
    { bg: "#3f51b5", emoji: "✨" },
    { bg: "#1abc9c", emoji: "🎵" },
  ];

  const features = [
    { num: "01", title: "AI MEMORY", desc: "Remembers every conversation, every member." },
    { num: "02", title: "VOICE COMMANDS", desc: "Speak to your server, get instant AI responses." },
    { num: "03", title: "MULTI-MODE", desc: "Switch between 12+ AI personalities on demand." },
    { num: "04", title: "AUTO MODERATION", desc: "Intelligent content filtering that learns your community." },
    { num: "05", title: "ANALYTICS", desc: "Deep insights into your community's engagement." },
  ];

  return (
    <div className={`dgb-page ${isDark ? "dark-mode" : ""}`}>
      {/* Intro Overlay */}
      <AnimatePresence>
        {animStage === "loading" && (
          <motion.div
            className="intro-overlay"
            initial={{ y: 0 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="intro-media-wrapper">
              <div className="logo-glitch" data-text="">
                <DirectionerLogo size={300} color="#fff" />
              </div>
            </div>
            <div className="intro-counter">{count}</div>
            <div className="intro-progress-bar">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`intro-progress-tick ${count >= (i + 1) * 10 ? "active" : ""}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className={`dgb-nav ${animStage === "loading" ? "hidden" : ""}`}>
        <ul className="nav-links">
          <li><a href="#commands">Commands</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="nav-logo">
          <DirectionerLogo size={40} color={isDark ? "#f0ede6" : "#0a0a0a"} />
        </div>
        <ul className="nav-links">
          <li><a href="#explore">Explore</a></li>
          <li><a href="#getbot">Get Bot</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="dgb-hero">
        <div className="hero-icons-row">
          {heroIcons.map((icon, i) => (
            <motion.div
              key={i}
              className="hero-icon"
              style={{ backgroundColor: icon.bg }}
              initial={{ y: "100vh" }}
              animate={animStage === "revealed" ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {icon.emoji}
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="hero-logotype"
          initial={{ scale: 0 }}
          animate={animStage === "revealed" ? { scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          DIRECTIONER.
        </motion.div>

        <motion.div
          className="hero-strapline"
          initial={{ opacity: 0 }}
          animate={animStage === "revealed" ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Unapologetically AI. For Discord.
        </motion.div>

        <motion.div
          style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}
          initial={{ opacity: 0 }}
          animate={animStage === "revealed" ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <ul className="nav-links">
            <li><a href="#start">Get Started</a></li>
            <li><a href="#features">Explore Features</a></li>
          </ul>
        </motion.div>
      </section>

      {/* Marquee 1 */}
      <div className="dgb-marquee">
        <div className="dgb-marquee-inner">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              AI POWERED · DISCORD BOT · MEMORY ENGINE · VOICE COMMANDS · MULTI-MODE · COMMUNITY AI · 
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="dgb-section" id="features">
        <div className="section-label">01 — WHAT WE DO</div>
        <div className="features-list">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              className="feature-row"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="feature-num">{feat.num}</div>
              <div className="feature-title">{feat.title}</div>
              <div className="feature-desc">{feat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Work/Action Grid */}
      <section className="dgb-section">
        <div className="section-label">02 — IN ACTION</div>
        <div className="media-grid">
          <motion.div
            className="media-tile"
            style={{ gridColumn: "span 7", background: "#1e1e1e" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <div className="chat-terminal">
              <p><span className="user">@Admin:</span> /summon Directioner</p>
              <p><span className="bot">Directioner:</span> I'm here. Analyzing past 48 hours of server chat...</p>
              <p><span className="bot">Directioner:</span> Found 3 unresolved questions in #general.</p>
            </div>
          </motion.div>

          <motion.div
            className="media-tile"
            style={{ gridColumn: "span 5", background: "#f5f5f5" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <svg viewBox="0 0 100 100" width="60%" height="60%" style={{ overflow: "visible" }}>
              <circle cx="50" cy="50" r="10" fill="#ff005c" />
              <circle cx="20" cy="30" r="6" fill="#3498db" />
              <circle cx="80" cy="40" r="8" fill="#1abc9c" />
              <circle cx="30" cy="80" r="5" fill="#3f51b5" />
              <circle cx="70" cy="85" r="7" fill="#9b59b6" />
              <line x1="50" y1="50" x2="20" y2="30" stroke="#000" strokeWidth="1" strokeDasharray="2" opacity="0.3" />
              <line x1="50" y1="50" x2="80" y2="40" stroke="#000" strokeWidth="1" strokeDasharray="2" opacity="0.3" />
              <line x1="50" y1="50" x2="30" y2="80" stroke="#000" strokeWidth="1" strokeDasharray="2" opacity="0.3" />
              <line x1="50" y1="50" x2="70" y2="85" stroke="#000" strokeWidth="1" strokeDasharray="2" opacity="0.3" />
              <line x1="20" y1="30" x2="30" y2="80" stroke="#000" strokeWidth="1" strokeDasharray="2" opacity="0.1" />
            </svg>
            <div style={{ position: "absolute", bottom: "1rem", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "#000" }}>Memory Graph</div>
          </motion.div>

          <motion.div
            className="media-tile"
            style={{ gridColumn: "span 4", background: "#0a0a0a" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <svg viewBox="0 0 100 40" width="80%" height="80%">
              <rect x="10" y="15" width="4" height="10" rx="2" fill="#00fff9"><animate attributeName="height" values="10;30;10" dur="1s" repeatCount="indefinite" /><animate attributeName="y" values="15;5;15" dur="1s" repeatCount="indefinite" /></rect>
              <rect x="20" y="5" width="4" height="30" rx="2" fill="#00fff9"><animate attributeName="height" values="30;15;30" dur="0.8s" repeatCount="indefinite" /><animate attributeName="y" values="5;12.5;5" dur="0.8s" repeatCount="indefinite" /></rect>
              <rect x="30" y="20" width="4" height="20" rx="2" fill="#00fff9"><animate attributeName="height" values="20;5;20" dur="1.2s" repeatCount="indefinite" /><animate attributeName="y" values="10;17.5;10" dur="1.2s" repeatCount="indefinite" /></rect>
              <rect x="40" y="10" width="4" height="20" rx="2" fill="#00fff9"><animate attributeName="height" values="20;40;20" dur="0.9s" repeatCount="indefinite" /><animate attributeName="y" values="10;0;10" dur="0.9s" repeatCount="indefinite" /></rect>
              <rect x="50" y="15" width="4" height="10" rx="2" fill="#00fff9"><animate attributeName="height" values="10;25;10" dur="1.1s" repeatCount="indefinite" /><animate attributeName="y" values="15;7.5;15" dur="1.1s" repeatCount="indefinite" /></rect>
              <rect x="60" y="5" width="4" height="30" rx="2" fill="#00fff9"><animate attributeName="height" values="30;10;30" dur="1.3s" repeatCount="indefinite" /><animate attributeName="y" values="5;15;5" dur="1.3s" repeatCount="indefinite" /></rect>
              <rect x="70" y="10" width="4" height="20" rx="2" fill="#00fff9"><animate attributeName="height" values="20;35;20" dur="0.7s" repeatCount="indefinite" /><animate attributeName="y" values="10;2.5;10" dur="0.7s" repeatCount="indefinite" /></rect>
              <rect x="80" y="15" width="4" height="10" rx="2" fill="#00fff9"><animate attributeName="height" values="10;20;10" dur="1.4s" repeatCount="indefinite" /><animate attributeName="y" values="15;10;15" dur="1.4s" repeatCount="indefinite" /></rect>
            </svg>
            <div style={{ position: "absolute", bottom: "1rem", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "#fff" }}>Voice Mode</div>
          </motion.div>

          <motion.div
            className="media-tile"
            style={{ gridColumn: "span 8", background: "#e8e8e8" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
             <svg viewBox="0 0 200 100" width="80%" height="80%" style={{ overflow: "visible" }}>
              <rect x="10" y="60" width="20" height="30" fill="#3498db" rx="2" />
              <rect x="40" y="40" width="20" height="50" fill="#9b59b6" rx="2" />
              <rect x="70" y="20" width="20" height="70" fill="#e74c3c" rx="2" />
              <rect x="100" y="50" width="20" height="40" fill="#f1c40f" rx="2" />
              <rect x="130" y="10" width="20" height="80" fill="#1abc9c" rx="2" />
              <line x1="0" y1="90" x2="160" y2="90" stroke="#000" strokeWidth="2" opacity="0.2" />
            </svg>
            <div style={{ position: "absolute", bottom: "1rem", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "#000" }}>Community Stats</div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="dgb-section">
        <div className="section-label">03 — COMMUNITY LOVE</div>
        <div className="quote-masonry">
          <div className="quote-card span-2">
            <div className="quote-text">"Since we added Directioner, our mod queue dropped by 80%. The AI actually understands sarcasm and inside jokes."</div>
            <div className="quote-author">— The Creator Hub (80k members)</div>
          </div>
          <div className="quote-card">
            <div className="quote-text">"Voice commands in our raid channels are a game changer. Pure magic."</div>
            <div className="quote-author">— Guild of Legends</div>
          </div>
          <div className="quote-card">
            <div className="quote-text">"It remembered a lore detail from 3 weeks ago. Scary good."</div>
            <div className="quote-author">— RP World</div>
          </div>
          <div className="quote-card">
            <div className="quote-text">"Swapping personalities during events makes it feel alive."</div>
            <div className="quote-author">— Dev Community</div>
          </div>
          <div className="quote-card span-2">
            <div className="quote-text">"The analytics let us know exactly when people are active and what they care about. Best bot we've ever used."</div>
            <div className="quote-author">— E-Sports Weekly</div>
          </div>
          <div className="quote-card">
            <div className="quote-text">"Literally the brain of our server now."</div>
            <div className="quote-author">— Anon DAO</div>
          </div>
        </div>
      </section>

      {/* Marquee Pricing */}
      <div className="dgb-marquee" style={{ background: isDark ? "#111" : "#fff" }}>
        <div className="dgb-marquee-inner">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              PRO · $19/MO · BASIC · FREE · ENTERPRISE · CUSTOM · 
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="dgb-section" style={{ padding: "15vh 5vw", textAlign: "center" }}>
        <h2 className="heading h2" style={{ maxWidth: "800px", margin: "0 auto 3rem" }}>
          Ready to build something <b>damn good</b>?
        </h2>
        <ul className="nav-links" style={{ justifyContent: "center" }}>
          <li><a href="#invite">Invite to Server</a></li>
          <li><a href="#docs">Read Docs</a></li>
        </ul>
      </section>

      {/* Footer */}
      <footer className={`dgb-footer ${animStage === "loading" ? "hidden" : ""}`}>
        <div className="footer-brand">
          <label className="toggle-switch" style={{ display: "none" }} /> {/* Paintball toggle placeholder */}
          <GlobeSVG size={20} color={isDark ? "#f0ede6" : "#0a0a0a"} />
          <span className="footer-tagline">Unapologetically Bold. | Built for Discord</span>
        </div>
        <div className="footer-links">
          <a href="#discord">Discord</a>
          <button onClick={toggleTheme} aria-label="Toggle Theme">
            <SunMoonSVG size={16} />
          </button>
          <a href="#getbot">Get Bot ↗</a>
        </div>
      </footer>

      {/* Time Display */}
      <div className="time-container">{timeStr}</div>

      {/* Scroll indicator (aesthetic) */}
      <div className="scroll-indicator">
        <div className="scroll-dot active" />
        <div className="scroll-dot" />
        <div className="scroll-dot" />
      </div>
    </div>
  );
}
