import { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, Mail } from "lucide-react";

export const Congratulations = ({ finalAnswer }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!rollNo.trim()) {
      setError("Roll Number is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!email.toLowerCase().endsWith("@mepcoeng.ac.in")) {
      setError("Must be a @mepcoeng.ac.in email address");
      return;
    }
    
    setError("");
    
    const subject = encodeURIComponent("Treasure hunt Answer");
    const body = encodeURIComponent(`I have completed the Treasure Hunt!\n\nThe final clue answer is: ${finalAnswer}\n\nMy details:\nName: ${name}\nRoll No: ${rollNo}`);
    
    window.location.href = `mailto:gsc@mepcoeng.ac.in?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Confetti 
        width={window.innerWidth} 
        height={window.innerHeight}
        recycle={true} 
        numberOfPieces={200} 
        colors={['#00ffcc', '#0096ff', '#ffffff']} 
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-panel"
      style={{
        padding: "3rem",
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        textAlign: "center",
        border: "1px solid var(--accent-color)",
        boxShadow: "var(--glow-shadow)",
        position: "relative",
        zIndex: 10
      }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginBottom: "2rem", color: "var(--accent-color)", display: "flex", justifyContent: "center" }}
      >
        <Trophy size={80} style={{ filter: "drop-shadow(0 0 10px rgba(0,255,204,0.5))" }} />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="orbitron glow-text"
        style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--text-primary)" }}
      >
        MISSION ACCOMPLISHED
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: "1.1rem", marginBottom: "2.5rem", color: "var(--text-secondary)", lineHeight: "1.6" }}
      >
        Congratulations! You've successfully cracked all 10 nodes in the sequence. The digital vault is now open.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ background: "var(--panel-bg)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}
      >
        <h3 className="orbitron" style={{ marginBottom: "1.5rem", color: "var(--text-primary)" }}>CLAIM YOUR PRIZE</h3>
        <p style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Send your final answer to the Google Students Club to claim your victory.
        </p>

        <form onSubmit={handleSendEmail} style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "0.8rem", position: "relative" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Your Full Name"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--border-faint)",
                border: `1px solid ${error && !name.trim() ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            <input
              type="text"
              value={rollNo}
              onChange={(e) => {
                setRollNo(e.target.value);
                if (error) setError("");
              }}
              placeholder="Your Roll Number"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--border-faint)",
                border: `1px solid ${error && !rollNo.trim() ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="Your @mepcoeng.ac.in email"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--border-faint)",
                border: `1px solid ${error && (!email.trim() || !email.toLowerCase().endsWith("@mepcoeng.ac.in")) ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            {error && (
              <div style={{ color: "var(--error-color)", fontSize: "0.8rem", marginTop: "0.2rem", textAlign: "left" }}>
                {error}
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--accent-color)",
              color: "var(--bg-color)",
              border: "none",
              padding: "0.8rem 2rem",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "'Orbitron', sans-serif",
              cursor: "pointer",
              boxShadow: "0 0 15px var(--accent-dim)"
            }}
          >
            <Mail size={18} />
            TRANSMIT DATA
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
    </>
  );
};
