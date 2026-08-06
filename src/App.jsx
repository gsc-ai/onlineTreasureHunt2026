import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ParticleBackground } from './components/ParticleBackground';
import { LandingScreen } from './components/LandingScreen';
import { ProgressBar } from './components/ProgressBar';
import { ClueCard } from './components/ClueCard';
import { Congratulations } from './components/Congratulations';
import { clues } from './data/clues';
import './index.css';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleSolveClue = () => {
    if (currentClueIndex < clues.length - 1) {
      setCurrentClueIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <>
      <ParticleBackground theme={theme} />
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 100,
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--accent-color)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--glow-shadow)'
        }}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <main style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1rem"
      }}>
        {!hasStarted ? (
          <LandingScreen onStart={handleStart} />
        ) : (
          <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column" }}>
            
            {/* Header / Logo */}
            <header style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h1 className="orbitron glow-text" style={{ fontSize: "1.5rem", margin: 0 }}>GSC TREASURE HUNT</h1>
            </header>

            {!isFinished && (
              <ProgressBar 
                currentClue={currentClueIndex + 1} 
                totalClues={clues.length} 
              />
            )}

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {!isFinished ? (
                <ClueCard 
                  clue={clues[currentClueIndex]} 
                  onSolve={handleSolveClue} 
                />
              ) : (
                <Congratulations finalAnswer={clues[clues.length - 1].answer} />
              )}
            </div>
            
            {/* Footer */}
            <footer style={{ textAlign: "center", marginTop: "3rem", color: "var(--text-secondary)", fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif" }}>
              SYSTEM V1.0 // GOOGLE STUDENTS CLUB @ MEPCO
            </footer>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
