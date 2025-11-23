import { useEffect, useState } from "react";
import { useWordle } from "./hooks/useWordle";
import { useTheme } from "./hooks/useTheme";
import { Wordle } from "./components/Wordle";
import { Keyboard } from "./components/Keyboard";
import "./App.css";

function App() {
  const { gameState, addLetter, removeLetter, submitGuess } = useWordle();
  const { theme, toggleTheme } = useTheme();
  const [shake, setShake] = useState(false);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status !== "playing") return;

      if (e.key === "Enter") {
        if (gameState.currentGuess.length === 5) {
          const wasValid = submitGuess();
          if (!wasValid) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
          }
        }
      } else if (e.key === "Backspace") {
        removeLetter();
      } else if (e.key.match(/^[a-zA-Z]$/)) {
        addLetter(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState.status,
    gameState.currentGuess,
    addLetter,
    removeLetter,
    submitGuess,
  ]);

  const handleKeyPress = (key: string) => {
    if (gameState.status !== "playing") return;

    if (key === "Enter") {
      if (gameState.currentGuess.length === 5) {
        const wasValid = submitGuess();
        if (!wasValid) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }
    } else if (key === "Backspace") {
      removeLetter();
    } else {
      addLetter(key);
    }
  };

  return (
    <div className={`app ${shake ? "shake" : ""}`}>
      <header className="header">
        <h1>WORDLE</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="main">
        <div style={{ minHeight: "400px" }}>
          <Wordle gameState={gameState} />
        </div>
        <Keyboard
          gameState={gameState}
          onKeyPress={handleKeyPress}
          disabled={gameState.status !== "playing"}
        />

        {gameState.status === "won" && (
          <div className="message message-success">🎉 You won! 🎉</div>
        )}
        {gameState.status === "lost" && (
          <div className="message message-error">
            Game Over! The word was: <strong>{gameState.dailyWord}</strong>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
