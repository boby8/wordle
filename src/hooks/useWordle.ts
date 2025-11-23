import { useState, useEffect, useCallback } from "react";
import {
  getDailyWord,
  compareWords,
  updateLetterStates,
} from "../utils/gameLogic";
import { isValidWord } from "../data/words";
import type { GameState, Guess, GameStatus } from "../types/game";

const STORAGE_KEY = "wordle-game-state";
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export function useWordle() {
  const today = new Date().toDateString();
  const dailyWord = getDailyWord();

  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset if it's a new day
      if (parsed.date === today) {
        return parsed;
      }
    }
    // New game
    return {
      currentGuess: "",
      guesses: [],
      status: "playing",
      letterStates: {},
      dailyWord,
      date: today,
    };
  });

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    if (gameState.date === today) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, today]);

  const addLetter = useCallback((letter: string) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;
      if (prev.currentGuess.length >= WORD_LENGTH) return prev;

      return {
        ...prev,
        currentGuess: prev.currentGuess + letter.toUpperCase(),
      };
    });
  }, []);

  const removeLetter = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;
      if (prev.currentGuess.length === 0) return prev;

      return {
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      };
    });
  }, []);

  const submitGuess = useCallback(() => {
    let isValid = true;
    setGameState((prev) => {
      if (prev.status !== "playing") {
        isValid = false;
        return prev;
      }
      if (prev.currentGuess.length !== WORD_LENGTH) {
        isValid = false;
        return prev;
      }
      if (prev.guesses.some((g) => g.word === prev.currentGuess)) {
        isValid = false;
        return prev; // Duplicate guess
      }

      const guess = prev.currentGuess.toUpperCase();

      // Validate word
      if (!isValidWord(guess)) {
        isValid = false;
        return prev; // Invalid word
      }

      const tiles = compareWords(guess, prev.dailyWord);
      const newGuess: Guess = { word: guess, tiles };

      const isCorrect = tiles.every((tile) => tile.state === "correct");
      const isLastGuess = prev.guesses.length + 1 >= MAX_GUESSES;

      let newStatus: GameStatus = "playing";
      if (isCorrect) {
        newStatus = "won";
      } else if (isLastGuess) {
        newStatus = "lost";
      }

      const newLetterStates = updateLetterStates(prev.letterStates, tiles);

      return {
        ...prev,
        currentGuess: "",
        guesses: [...prev.guesses, newGuess],
        status: newStatus,
        letterStates: newLetterStates,
      };
    });
    return isValid;
  }, []);

  return {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
  };
}
