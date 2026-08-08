import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Clock, Calendar, Link as LinkIcon } from "lucide-react";

export const MaintenanceScreen = ({ theme }) => {
  // Target: Sunday, August 9, 2026 at 09:00 AM IST
  const targetDate = new Date("2026-08-09T09:00:00+05:30").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isLauched, setIsLaunched] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = targetDate - Date.now();
      
      if (difference <= 0) {
        setIsLaunched(true);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      color: "var(--text-primary)",
      padding: "2rem 1rem",
      textAlign: "center",
      position: "relative",
      zIndex: 1
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel"
        style={{
          maxWidth: "650px",
          width: "100%",
          padding: "3rem 2rem",
          border: "1px solid var(--border-subtle)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Pulsing Header Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(0, 229, 255, 0.08)",
              border: "1px solid var(--accent-color)",
              color: "var(--accent-color)",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: "1px",
              boxShadow: "var(--glow-shadow)"
            }}
          >
            <ShieldAlert size={14} /> SIGNAL SECURED // PRE-LAUNCH
          </motion.div>
        </div>

        <h1 className="orbitron glow-text" style={{ fontSize: "2.2rem", marginBottom: "1.5rem" }}>
          GSC TREASURE HUNT 2026
        </h1>

        <div style={{
          background: "var(--panel-bg)",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid var(--border-faint)",
          marginBottom: "2rem",
          fontSize: "1.1rem",
          lineHeight: "1.6",
          color: "var(--text-secondary)"
        }}>
          The online event conducted by the <strong>Google Students Club</strong> will go live on 
          <span style={{ color: "var(--accent-color)", display: "block", marginTop: "0.5rem", fontWeight: "bold" }}>
            Sunday, 09/08/2026 from 09:00 AM onwards
          </span>
        </div>

        {/* Countdown Area */}
        {!isLauched ? (
          <div>
            <h3 className="orbitron" style={{ fontSize: "1rem", color: "var(--accent-color)", marginBottom: "1rem", letterSpacing: "2px" }}>
              TIME REMAINING
            </h3>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.2rem",
              marginBottom: "2rem"
            }}>
              {[
                { label: "DAYS", val: timeLeft.days },
                { label: "HOURS", val: timeLeft.hours },
                { label: "MINS", val: timeLeft.minutes },
                { label: "SECS", val: timeLeft.seconds }
              ].map((t, idx) => (
                <div key={idx} style={{
                  minWidth: "75px",
                  padding: "0.8rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-faint)",
                  borderRadius: "8px"
                }}>
                  <div className="orbitron" style={{ fontSize: "1.8rem", fontWeight: "bold", color: "var(--text-primary)" }}>
                    {t.val.toString().padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem", letterSpacing: "1px" }}>
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="orbitron" style={{ fontSize: "1.3rem", color: "#39ff14", marginBottom: "2rem", letterSpacing: "2px" }}>
            EVENT IS CURRENTLY LIVE! REFRESH THE PAGE TO BEGIN.
          </div>
        )}

        {/* Bottom Banner */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          color: "var(--text-secondary)",
          fontSize: "0.85rem",
          fontFamily: "'Orbitron', sans-serif"
        }}>
          <span>GOOGLE STUDENTS CLUB @ MEPCO</span>
        </div>
      </motion.div>
    </div>
  );
};
