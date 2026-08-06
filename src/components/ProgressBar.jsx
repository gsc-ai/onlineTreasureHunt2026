import { motion } from "framer-motion";

export const ProgressBar = ({ currentClue, totalClues = 10 }) => {
  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto 2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        
        {/* Background Line */}
        <div style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: 0,
          right: 0,
          height: "2px",
          background: "var(--border-subtle)",
          zIndex: 0
        }} />

        {/* Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentClue - 1) / (totalClues - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: 0,
            height: "2px",
            background: "var(--accent-color)",
            boxShadow: "0 0 10px var(--accent-color)",
            zIndex: 1
          }} 
        />

        {/* Nodes */}
        {Array.from({ length: totalClues }).map((_, index) => {
          const clueNumber = index + 1;
          const isCompleted = clueNumber < currentClue;
          const isCurrent = clueNumber === currentClue;
          const isLocked = clueNumber > currentClue;

          return (
            <div key={clueNumber} style={{ position: "relative", zIndex: 2 }}>
              <motion.div
                animate={{
                  scale: isCurrent ? [1, 1.2, 1] : 1,
                  boxShadow: isCurrent 
                    ? ["0 0 5px var(--accent-color)", "0 0 15px var(--accent-color)", "0 0 5px var(--accent-color)"] 
                    : (isCompleted ? "0 0 10px var(--accent-color)" : "none")
                }}
                transition={{
                  duration: 2,
                  repeat: isCurrent ? Infinity : 0,
                  ease: "easeInOut"
                }}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: isCompleted || isCurrent ? "var(--bg-color)" : "var(--border-faint)",
                  border: `2px solid ${isCompleted || isCurrent ? "var(--accent-color)" : "var(--border-subtle)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isCompleted || isCurrent ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "12px",
                  fontWeight: "bold",
                  opacity: isLocked ? 0.5 : 1,
                  backdropFilter: "blur(4px)"
                }}
              >
                {clueNumber}
              </motion.div>
            </div>
          );
        })}
      </div>
      
      <div style={{ textAlign: "center", marginTop: "1rem", fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        CLUE <span style={{ color: "var(--accent-color)", fontWeight: "bold" }}>{currentClue}</span> / {totalClues}
      </div>
    </div>
  );
};
