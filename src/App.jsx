import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { ParticleBackground } from "./components/ParticleBackground";
import { LandingScreen } from "./components/LandingScreen";
import { ProgressBar } from "./components/ProgressBar";
import { ClueCard } from "./components/ClueCard";
import { Congratulations } from "./components/Congratulations";
import { Timer } from "./components/Timer";
import { clues } from "./data/clues";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { AdminDashboard } from "./components/AdminDashboard";
import { MaintenanceScreen } from "./components/MaintenanceScreen";
import "./index.css";

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [userInfo, setUserInfo] = useState(null);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  const accumulatedRef = useRef(0);
  const sessionStartRef = useRef(null);

  useEffect(() => {
    const isadmin = window.location.pathname === "/admin" || window.location.hostname.includes("admin");
    setIsAdminRoute(isadmin);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleStart = (dbData) => {
    setUserInfo(dbData);

    const initialAcc = dbData.accumulatedTime || 0;
    setAccumulatedTime(initialAcc);
    accumulatedRef.current = initialAcc;

    const now = Date.now();
    setSessionStartTime(now);
    sessionStartRef.current = now;

    setCurrentClueIndex(dbData.currentClueIndex || 0);

    if (dbData.endTime) {
      setIsFinished(true);
    }

    setHasStarted(true);
  };

  const handleSolveClue = async () => {
    const nextIndex = currentClueIndex + 1;
    const isDone = nextIndex >= clues.length;

    const timeSpent = Date.now() - sessionStartRef.current;
    const newAccumulated = accumulatedRef.current + timeSpent;

    accumulatedRef.current = newAccumulated;
    sessionStartRef.current = Date.now();

    setAccumulatedTime(newAccumulated);
    setSessionStartTime(sessionStartRef.current);

    if (!isDone) {
      setCurrentClueIndex(nextIndex);
    } else {
      setIsFinished(true);
    }

    try {
      if (userInfo?.rollNo) {
        const docRef = doc(db, "participants", userInfo.rollNo);
        if (isDone) {
          await updateDoc(docRef, {
            currentClueIndex: nextIndex,
            accumulatedTime: newAccumulated,
            endTime: Date.now(),
          });
        } else {
          await updateDoc(docRef, {
            currentClueIndex: nextIndex,
            accumulatedTime: newAccumulated,
          });
        }
      }
    } catch (err) {
      console.error("Failed to sync progress to DB", err);
    }
  };

  useEffect(() => {
    if (!hasStarted || isFinished || !userInfo?.rollNo) return;

    const saveTime = () => {
      if (sessionStartRef.current) {
        const timeSpent = Date.now() - sessionStartRef.current;
        const newAccumulated = accumulatedRef.current + timeSpent;

        accumulatedRef.current = newAccumulated;
        sessionStartRef.current = Date.now();

        setAccumulatedTime(newAccumulated);
        setSessionStartTime(sessionStartRef.current);

        const docRef = doc(db, "participants", userInfo.rollNo);
        updateDoc(docRef, { accumulatedTime: newAccumulated }).catch(
          console.error,
        );
      }
    };

    window.addEventListener("beforeunload", saveTime);

    return () => {
      window.removeEventListener("beforeunload", saveTime);
    };
  }, [hasStarted, isFinished, userInfo]);

  const MAINTENANCE_MODE = true;

  if (isAdminRoute) {
    return (
      <>
        <ParticleBackground theme={theme} />
        <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
      </>
    );
  }

  if (MAINTENANCE_MODE) {
    return (
      <>
        <ParticleBackground theme={theme} />
        <button
          onClick={toggleTheme}
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 100,
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--accent-color)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--glow-shadow)",
          }}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <MaintenanceScreen theme={theme} />
      </>
    );
  }

  return (
    <>
      <ParticleBackground theme={theme} />
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 100,
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          color: "var(--accent-color)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "var(--glow-shadow)",
        }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {hasStarted && (
        <Timer
          accumulatedTime={accumulatedTime}
          sessionStartTime={sessionStartTime}
          isFinished={isFinished}
        />
      )}

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1rem",
        }}
      >
        {!hasStarted ? (
          <LandingScreen onStart={handleStart} />
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <header style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h1
                className="orbitron glow-text"
                style={{ fontSize: "1.5rem", margin: 0 }}
              >
                GSC TREASURE HUNT
              </h1>
            </header>

            {!isFinished && (
              <ProgressBar
                currentClue={currentClueIndex + 1}
                totalClues={clues.length}
              />
            )}

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!isFinished ? (
                <ClueCard
                  clue={clues[currentClueIndex]}
                  onSolve={handleSolveClue}
                />
              ) : (
                <Congratulations
                  finalAnswer={clues[clues.length - 1].answer}
                  userInfo={userInfo}
                  accumulatedTime={accumulatedTime}
                />
              )}
            </div>
            <footer
              style={{
                textAlign: "center",
                marginTop: "3rem",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              SYSTEM V1.0 // GOOGLE STUDENTS CLUB @ MEPCO
            </footer>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
