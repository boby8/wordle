import { useState, useEffect, useCallback } from "react";
import type { Statistics } from "../types/game";

const STATS_STORAGE_KEY = "wordle-statistics";

const DEFAULT_STATS: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { ...DEFAULT_STATS };
      }
    }
    return { ...DEFAULT_STATS };
  });

  const lastPlayedDate = localStorage.getItem("wordle-last-played-date");

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(statistics));
  }, [statistics]);

  const updateStatistics = useCallback(
    (won: boolean, guesses: number, today: string) => {
      setStatistics((prev) => {
        const newStats = { ...prev };
        const todayDate = new Date(today).toDateString();
        const lastDate = lastPlayedDate
          ? new Date(lastPlayedDate).toDateString()
          : null;

        // Reset streak if it's a new day and they didn't play yesterday
        if (lastDate && lastDate !== todayDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate !== yesterday.toDateString()) {
            // Streak broken
            newStats.currentStreak = 0;
          }
        }

        // Only update if this is a new game (not already won/lost today)
        if (lastDate !== todayDate) {
          newStats.gamesPlayed += 1;

          if (won) {
            newStats.gamesWon += 1;
            newStats.currentStreak += 1;
            if (newStats.currentStreak > newStats.maxStreak) {
              newStats.maxStreak = newStats.currentStreak;
            }
            // Update guess distribution (1-6, where 1 means guessed on first try)
            if (guesses >= 1 && guesses <= 6) {
              newStats.guessDistribution[guesses - 1] += 1;
            }
          } else {
            newStats.currentStreak = 0;
          }
        }

        return newStats;
      });

      localStorage.setItem("wordle-last-played-date", today);
    },
    [lastPlayedDate]
  );

  const resetStatistics = useCallback(() => {
    setStatistics({ ...DEFAULT_STATS });
    localStorage.removeItem("wordle-last-played-date");
  }, []);

  return {
    statistics,
    updateStatistics,
    resetStatistics,
  };
}
