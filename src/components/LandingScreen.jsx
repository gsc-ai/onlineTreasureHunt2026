import { motion } from "framer-motion";
import { Terminal, ChevronRight } from "lucide-react";

export const LandingScreen = ({ onStart }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: "2rem", color: "var(--accent-color)" }}
      >
        <Terminal
          size={64}
          style={{ filter: "drop-shadow(0 0 10px rgba(0,255,204,0.5))" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h2
          className="orbitron"
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.2rem",
            marginBottom: "0.5rem",
          }}
        >
          GOOGLE STUDENTS CLUB PRESENTS
        </h2>
        <h1
          className="orbitron glow-text"
          style={{
            fontSize: "3.5rem",
            marginBottom: "1.5rem",
            lineHeight: "1.2",
          }}
        >
          ONLINE
          <br />
          TREASURE HUNT
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{ maxWidth: "600px", marginBottom: "3rem" }}
      >
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
          }}
        >
          Welcome, Code Breaker. You are about to enter a sequence of 10
          encrypted nodes. The answer to each node is the decryption key for the
          next.
        </p>
        <div
          style={{
            background: "var(--panel-bg)",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)",
            textAlign: "left",
          }}
        >
          <h4
            className="orbitron"
            style={{ color: "var(--accent-color)", marginBottom: "1rem" }}
          >
            RULES OF ENGAGEMENT:
          </h4>
          <ul
            style={{
              color: "var(--text-secondary)",
              paddingLeft: "1.2rem",
              lineHeight: "1.8",
            }}
          >
            <li>
              Enter answers without spaces (e.g., "treasure hunt" →
              "treasurehunt")
            </li>
            <li>No special characters required</li>
            <li>Only small letters are allowed.</li>
            <li>Find the final clue to claim your victory</li>
          </ul>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--accent-color)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "transparent",
          color: "var(--accent-color)",
          border: "2px solid var(--accent-color)",
          padding: "1rem 3rem",
          borderRadius: "30px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          fontFamily: "'Orbitron', sans-serif",
          cursor: "pointer",
          boxShadow: "0 0 10px var(--accent-dim)",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        INITIALIZE SEQUENCE
        <ChevronRight size={24} />
      </motion.button>
    </div>
  );
};
