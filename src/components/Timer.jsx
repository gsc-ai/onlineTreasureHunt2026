import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export const Timer = ({ accumulatedTime, sessionStartTime, isFinished }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isFinished) {
      setElapsedTime(Math.floor(accumulatedTime / 1000));
      return;
    }

    if (!sessionStartTime) return;

    // Immediately set the time so there is no 1-second delay
    setElapsedTime(
      Math.floor((accumulatedTime + (Date.now() - sessionStartTime)) / 1000),
    );

    const interval = setInterval(() => {
      const currentSessionTime = Date.now() - sessionStartTime;
      setElapsedTime(Math.floor((accumulatedTime + currentSessionTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [accumulatedTime, sessionStartTime, isFinished]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "absolute",
        top: "1rem",
        right: "5rem", // next to the theme toggle
        zIndex: 100,
        background: "var(--glass-bg)",
        border: "1px solid var(--accent-color)",
        color: "var(--accent-color)",
        borderRadius: "30px",
        padding: "0.5rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: "bold",
        fontSize: "1.1rem",
        boxShadow: "var(--glow-shadow)",
      }}
    >
      <Clock size={18} />
      {formatTime(elapsedTime)}
    </motion.div>
  );
};
