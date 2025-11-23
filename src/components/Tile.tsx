import { useEffect, useState } from "react";
import type { Tile, LetterState } from "../types/game";

interface TileProps {
  tile: Tile;
  isRevealed: boolean;
  delay?: number;
}

export function TileComponent({ tile, isRevealed, delay = 0 }: TileProps) {
  const [flipStarted, setFlipStarted] = useState(false);
  const shouldFlip = isRevealed && tile.state !== "empty" && tile.letter;

  useEffect(() => {
    if (shouldFlip) {
      // Start flip animation after delay
      const timer = setTimeout(() => {
        setFlipStarted(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Use setTimeout to avoid sync setState warning
      const resetTimer = setTimeout(() => {
        setFlipStarted(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }
  }, [shouldFlip, delay]);

  const isFlipping = shouldFlip && flipStarted;

  const getStateClass = (state: LetterState): string => {
    switch (state) {
      case "correct":
        return "tile-correct";
      case "present":
        return "tile-present";
      case "absent":
        return "tile-absent";
      default:
        return "";
    }
  };

  // Always show color classes when revealed (not just during flip)
  const stateClass =
    isRevealed && tile.state !== "empty" ? getStateClass(tile.state) : "";

  // Debug: Log tile rendering for revealed tiles
  if (isRevealed && tile.letter && tile.state !== "empty") {
    console.log(
      `[Tile Render] Letter: ${tile.letter}, State: ${tile.state}, Class: ${stateClass}, isRevealed: ${isRevealed}`
    );
  }

  return (
    <div
      className={`tile ${stateClass} ${isFlipping ? "tile-flip" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {tile.letter}
    </div>
  );
}
