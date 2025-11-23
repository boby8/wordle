import { useEffect, useState } from "react";
import { useWordle } from "./hooks/useWordle";
import { useTheme } from "./hooks/useTheme";
import { useStatistics } from "./hooks/useStatistics";
import { Wordle } from "./components/Wordle";
import { Keyboard } from "./components/Keyboard";
import { StatisticsModal } from "./components/StatisticsModal";
import { HowToPlayModal } from "./components/HowToPlayModal";
import {
  generateShareText,
  copyToClipboard,
  getDayNumber,
} from "./utils/shareUtils";
import "./App.css";

function App() {
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const { gameState, addLetter, removeLetter, submitGuess, resetGame } =
    useWordle(isPracticeMode);
  const { theme, toggleTheme } = useTheme();
  const { statistics, updateStatistics, resetStatistics } = useStatistics();
  const [shake, setShake] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Show How To Play on first visit
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem(
      "wordle-has-seen-instructions"
    );
    if (!hasSeenInstructions) {
      setTimeout(() => {
        setShowHowToPlay(true);
        localStorage.setItem("wordle-has-seen-instructions", "true");
      }, 500);
    }
  }, []);

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

  // Update statistics when game ends (only in daily mode)
  useEffect(() => {
    if (
      !isPracticeMode &&
      (gameState.status === "won" || gameState.status === "lost")
    ) {
      const guesses = gameState.guesses.length;
      updateStatistics(gameState.status === "won", guesses, gameState.date);

      // Show stats modal after a short delay
      setTimeout(() => {
        setShowStats(true);
      }, 1500);
    }
  }, [
    gameState.status,
    gameState.guesses.length,
    gameState.date,
    updateStatistics,
    isPracticeMode,
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

  const handleShare = async () => {
    const guesses = gameState.status === "won" ? gameState.guesses.length : "X";
    const shareText = generateShareText(
      guesses === "X" ? 6 : guesses,
      gameState.status === "won",
      gameState,
      gameState.dailyWord
    );

    const success = await copyToClipboard(shareText);
    if (success) {
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  return (
    <div className={`app ${shake ? "shake" : ""}`}>
      <header className="header">
        <button
          className="help-button"
          onClick={() => setShowHowToPlay(true)}
          aria-label="How to Play"
          title="How to Play"
        >
          ❓
        </button>
        <div className="header-center">
          <h1>WORDLE</h1>
          {isPracticeMode && (
            <div className="practice-badge">Practice Mode</div>
          )}
        </div>
        <div className="header-right">
          <button
            className="stats-button"
            onClick={() => setShowStats(true)}
            aria-label="Statistics"
            title="Statistics"
          >
            📊
          </button>
          <button
            className="practice-toggle"
            onClick={() => {
              setIsPracticeMode(!isPracticeMode);
              setTimeout(() => resetGame(), 100);
            }}
            title={
              isPracticeMode
                ? "Switch to Daily Mode"
                : "Switch to Practice Mode"
            }
          >
            {isPracticeMode ? "📅" : "♻️"}
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
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
          <div className="message message-success">
            <div>🎉 You won! 🎉</div>
            <div className="message-subtitle">
              {isPracticeMode ? "Practice" : `Wordle ${getDayNumber()}`}{" "}
              {gameState.guesses.length}/6
            </div>
            <div className="message-actions">
              {isPracticeMode && (
                <button className="new-game-button" onClick={resetGame}>
                  New Word ♻️
                </button>
              )}
              {!isPracticeMode && (
                <button className="share-result-button" onClick={handleShare}>
                  {showShare ? "✓ Copied!" : "📤 Share Result"}
                </button>
              )}
            </div>
          </div>
        )}
        {gameState.status === "lost" && (
          <div className="message message-error">
            <div>Game Over!</div>
            <div className="message-subtitle">
              The word was: <strong>{gameState.dailyWord}</strong>
            </div>
            <div className="message-actions">
              {isPracticeMode && (
                <button className="new-game-button" onClick={resetGame}>
                  Try Another Word ♻️
                </button>
              )}
              {!isPracticeMode && (
                <button className="share-result-button" onClick={handleShare}>
                  {showShare ? "✓ Copied!" : "📤 Share Result"}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <StatisticsModal
        statistics={statistics}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onReset={resetStatistics}
        todayGuesses={
          gameState.status !== "playing" ? gameState.guesses.length : undefined
        }
        wonToday={
          gameState.status === "won"
            ? true
            : gameState.status === "lost"
            ? false
            : undefined
        }
        onShare={handleShare}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
}

export default App;
