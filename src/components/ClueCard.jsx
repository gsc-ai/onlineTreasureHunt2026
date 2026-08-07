import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowRight } from "lucide-react";

export const ClueCard = ({ clue, onSolve }) => {
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [inputErrorMsg, setInputErrorMsg] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    const fullQuestion = `${clue.id}. ${clue.question}`;
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullQuestion.length) {
        setDisplayedText(fullQuestion.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [clue]);

  useEffect(() => {
    setInputValue("");
    setIsError(false);
    setInputErrorMsg("");
    setIsSolved(false);
  }, [clue.id]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (/[^a-z0-9]/.test(value)) {
      setInputErrorMsg(
        "ONLY LOWERCASE LETTERS ALLOWED (NO SPACES/SPECIAL CHARS)",
      );
    } else {
      setInputErrorMsg("");
    }

    const sanitized = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    setInputValue(sanitized);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedInput = inputValue.trim().toLowerCase().replace(/\s+/g, "");

    if (normalizedInput === clue.answer) {
      setIsError(false);
      setIsSolved(true);
      setTimeout(() => {
        onSolve();
      }, 1500);
    } else {
      setIsError(true);
      setInputValue("");
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={clue.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="glass-panel"
        style={{
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          border: isSolved
            ? "1px solid var(--accent-color)"
            : "1px solid var(--glass-border)",
          boxShadow: isSolved
            ? "var(--glow-shadow)"
            : "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1rem",
          }}
        >
          <h2
            style={{
              color: "var(--accent-color)",
              margin: 0,
              fontSize: "1.5rem",
            }}
          >
            NODE_{clue.id.toString().padStart(2, "0")}
          </h2>
          <motion.div
            initial={false}
            animate={{
              color: isSolved ? "var(--accent-color)" : "var(--text-secondary)",
            }}
          >
            {isSolved ? <Unlock size={24} /> : <Lock size={24} />}
          </motion.div>
        </div>
        <div
          style={{
            minHeight: "100px",
            marginBottom: "2rem",
            fontSize: "1.1rem",
            lineHeight: "1.6",
          }}
        >
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              display: "inline-block",
              width: "8px",
              height: "1.1em",
              background: "var(--accent-color)",
              marginLeft: "4px",
              verticalAlign: "middle",
            }}
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className={isError ? "shake" : ""}
          style={{ position: "relative", width: "100%" }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isSolved}
            placeholder="Enter decryption key..."
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            style={{
              width: "100%",
              padding: "1rem 3rem 1rem 1rem",
              background: "var(--input-bg)",
              border: `1px solid ${isError ? "var(--error-color)" : "var(--border-subtle)"}`,
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontSize: "1rem",
              fontFamily: "'Inter', sans-serif",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow: isError ? "0 0 10px var(--error-dim)" : "none",
            }}
            onFocus={(e) => {
              if (!isError) e.target.style.borderColor = "var(--accent-color)";
              if (!isError) e.target.style.boxShadow = "var(--glow-shadow)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isError
                ? "var(--error-color)"
                : "var(--border-subtle)";
              e.target.style.boxShadow = isError
                ? "0 0 10px var(--error-dim)"
                : "none";
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSolved}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background:
                inputValue.trim() && !isSolved
                  ? "var(--accent-color)"
                  : "transparent",
              color:
                inputValue.trim() && !isSolved
                  ? "var(--bg-color)"
                  : "var(--text-secondary)",
              border: "none",
              borderRadius: "4px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor:
                inputValue.trim() && !isSolved ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
            }}
          >
            <ArrowRight size={18} />
          </button>
        </form>
        <div
          style={{
            height: "24px",
            marginTop: "0.5rem",
            fontSize: "0.85rem",
            color:
              inputErrorMsg || isError
                ? "var(--error-color)"
                : "var(--accent-color)",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          <AnimatePresence>
            {inputErrorMsg && !isError && !isSolved && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {inputErrorMsg}
              </motion.div>
            )}
            {isError && !inputErrorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ACCESS DENIED. INVALID KEY.
              </motion.div>
            )}
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ACCESS GRANTED. DECRYPTING NEXT NODE...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
