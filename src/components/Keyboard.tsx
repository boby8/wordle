import type { GameState } from "../types/game";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

interface KeyboardProps {
  gameState: GameState;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

export function Keyboard({
  gameState,
  onKeyPress,
  disabled = false,
}: KeyboardProps) {
  const getKeyClass = (key: string): string => {
    if (key === "ENTER" || key === "DELETE") {
      return "key-special";
    }
    const letterState = gameState.letterStates[key];
    if (letterState) {
      return `key-${letterState}`;
    }
    return "";
  };

  const handleKeyClick = (key: string) => {
    if (disabled) return;

    if (key === "ENTER") {
      onKeyPress("Enter");
    } else if (key === "DELETE") {
      onKeyPress("Backspace");
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key ${getKeyClass(key)}`}
              onClick={() => handleKeyClick(key)}
              disabled={disabled || gameState.status !== "playing"}
            >
              {key === "DELETE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
