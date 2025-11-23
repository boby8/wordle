import { TileComponent } from "./Tile";
import type { Tile, GameState } from "../types/game";

const ROWS = 6;
const COLS = 5;

interface WordleProps {
  gameState: GameState;
}

export function Wordle({ gameState }: WordleProps) {
  const getTileForPosition = (rowIndex: number, colIndex: number): Tile => {
    if (rowIndex < gameState.guesses.length) {
      // Show completed guesses
      return gameState.guesses[rowIndex].tiles[colIndex];
    } else if (rowIndex === gameState.guesses.length) {
      // Show current guess
      const letter = gameState.currentGuess[colIndex] || "";
      return { letter, state: "empty" };
    } else {
      // Empty row
      return { letter: "", state: "empty" };
    }
  };

  return (
    <div className="wordle-board">
      {Array(ROWS)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {Array(COLS)
              .fill(null)
              .map((_, colIndex) => {
                const tile = getTileForPosition(rowIndex, colIndex);
                const isRevealed = rowIndex < gameState.guesses.length;
                return (
                  <TileComponent
                    key={`${rowIndex}-${colIndex}-${tile.letter}-${tile.state}`}
                    tile={tile}
                    isRevealed={isRevealed}
                    delay={colIndex * 100}
                  />
                );
              })}
          </div>
        ))}
    </div>
  );
}
