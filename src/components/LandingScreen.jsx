import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight, UserCircle, Loader2 } from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const LandingScreen = ({ onStart }) => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSequence = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!rollNo.trim()) {
      setError("Roll Number is required");
      return;
    }
    if (!department.trim()) {
      setError("Department is required");
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

    setIsLoading(true);
    setError("");
    try {
      const normalizedRollNo = rollNo.trim().toUpperCase();
      const normalizedEmail = email.trim().toLowerCase();

      const docRef = doc(db, "participants", normalizedRollNo);
      const docSnap = await getDoc(docRef);

      let dbData;
      if (docSnap.exists()) {
        dbData = docSnap.data();

        if (dbData.email !== normalizedEmail) {
          setError(
            "This Roll Number is already registered with a different Email.",
          );
          setIsLoading(false);
          return;
        }
      } else {
        const emailQuery = query(
          collection(db, "participants"),
          where("email", "==", normalizedEmail),
        );
        const emailSnap = await getDocs(emailQuery);

        if (!emailSnap.empty) {
          setError(
            "This Email is already registered with a different Roll Number.",
          );
          setIsLoading(false);
          return;
        }

        dbData = {
          name: name.trim(),
          rollNo: normalizedRollNo,
          department: department.trim(),
          email: normalizedEmail,
          accumulatedTime: 0,
          currentClueIndex: 0,
          endTime: null,
          startedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        };
        await setDoc(docRef, dbData);
      }

      onStart(dbData);
    } catch (err) {
      console.error(err);
      setError(`Database Error: ${err.message || err.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };
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

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap-reverse",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "2rem",
          width: "100%",
          maxWidth: "1000px",
          marginTop: "1rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ flex: "1 1 400px", maxWidth: "500px" }}
        >
          <div
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
              padding: "1.2rem",
              borderRadius: "12px",
              background: "var(--panel-bg)",
              border: "1px dashed var(--accent-color)",
              boxShadow: "0 0 15px var(--accent-dim)",
              textAlign: "center",
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: "1px"
            }}
          >
            FIND ANSWERS IN:{" "}
            <motion.a
              href="https://www.mepcoeng.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                color: "var(--accent-color)",
                textDecoration: "none",
                fontWeight: "bold",
                borderBottom: "2px solid var(--accent-color)",
                paddingBottom: "2px",
                textShadow: "0 0 10px var(--accent-dim)",
                cursor: "pointer"
              }}
            >
              mepcoeng.ac.in
            </motion.a>
          </div>
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
              <li>Find answers in mepcoeng.ac.in</li>
              <li>Find the final clue to claim your victory</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{
            flex: "1 1 400px",
            maxWidth: "500px",
            background: "var(--panel-bg)",
            padding: "2rem",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3
            className="orbitron"
            style={{
              color: "var(--text-primary)",
              marginBottom: "1.5rem",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <UserCircle size={20} />
            PARTICIPANT DETAILS
          </h3>

          <form
            onSubmit={handleStartSequence}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Name"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: `1px solid ${error && !name.trim() ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <input
              type="text"
              value={rollNo}
              onChange={(e) => {
                setRollNo(e.target.value.toUpperCase());
                if (error) setError("");
              }}
              placeholder="Roll No"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: `1px solid ${error && !rollNo.trim() ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: `1px solid ${error && !department.trim() ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none",
                cursor: "pointer",
                appearance: "none"
              }}
            >
              <option value="" disabled>Select Department</option>
              {["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL", "BME", "BTECH"].map(dept => (
                <option key={dept} value={dept} style={{ background: "#111", color: "#fff" }}>
                  {dept}
                </option>
              ))}
            </select>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="Mail ID (@mepcoeng.ac.in)"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: `1px solid ${error && (!email.trim() || !email.toLowerCase().endsWith("@mepcoeng.ac.in")) ? "var(--error-color)" : "var(--border-subtle)"}`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none",
              }}
            />

            <div style={{ height: "20px" }}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      color: "var(--error-color)",
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px var(--accent-color)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "transparent",
                color: "var(--accent-color)",
                border: "2px solid var(--accent-color)",
                padding: "1rem 2rem",
                borderRadius: "30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                fontFamily: "'Orbitron', sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                boxShadow: "0 0 10px var(--accent-dim)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginTop: "0.5rem",
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={24} />
                </motion.div>
              ) : (
                <>
                  INITIALIZE SEQUENCE
                  <ChevronRight size={24} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
