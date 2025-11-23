import { useState, useEffect, useCallback } from "react";
import {
  getDailyWord,
  getRandomWord,
  compareWords,
  updateLetterStates,
} from "../utils/gameLogic";
import { isValidWord } from "../data/words";
import type { GameState, Guess, GameStatus } from "../types/game";

const STORAGE_KEY = "wordle-game-state";
const PRACTICE_STORAGE_KEY = "wordle-practice-state";
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export function useWordle(isPracticeMode: boolean = false) {
  const today = new Date().toDateString();
  const dailyWord = isPracticeMode ? getRandomWord() : getDailyWord();

  const [gameState, setGameState] = useState<GameState>(() => {
    const storageKey = isPracticeMode ? PRACTICE_STORAGE_KEY : STORAGE_KEY;

    if (isPracticeMode) {
      // Practice mode: load saved game or create new one
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isPracticeMode) {
          return parsed;
        }
      }
      return {
        currentGuess: "",
        guesses: [],
        status: "playing",
        letterStates: {},
        dailyWord,
        date: today,
        isPracticeMode: true,
      };
    } else {
      // Daily mode: load saved game or create new one
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset if it's a new day
        if (parsed.date === today && !parsed.isPracticeMode) {
          return parsed;
        }
      }
      return {
        currentGuess: "",
        guesses: [],
        status: "playing",
        letterStates: {},
        dailyWord,
        date: today,
        isPracticeMode: false,
      };
    }
  });

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    const storageKey = isPracticeMode ? PRACTICE_STORAGE_KEY : STORAGE_KEY;
    if (isPracticeMode) {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    } else if (gameState.date === today) {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, today, isPracticeMode]);

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

  const resetGame = useCallback(() => {
    const newWord = isPracticeMode ? getRandomWord() : getDailyWord();
    setGameState({
      currentGuess: "",
      guesses: [],
      status: "playing",
      letterStates: {},
      dailyWord: newWord,
      date: today,
      isPracticeMode,
    });
  }, [isPracticeMode, today]);

  return {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
  };
}
