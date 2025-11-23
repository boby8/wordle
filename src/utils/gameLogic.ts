import { DAILY_WORDS } from "../data/words";
import type { Tile, LetterState } from "../types/game";

// Get daily word based on date (same word for everyone globally per day)
// Official Wordle started on June 19, 2021 (day 0)
// Each day since then uses the next word in the answers list sequentially
export function getDailyWord(): string {
  const WORDLE_START_DATE = new Date("2021-06-19T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for consistent date comparison

  // Calculate days since Wordle started
  const diffTime = today.getTime() - WORDLE_START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Use modulo to cycle through the word list
  // This ensures we always have a valid word even after all words are used
  const index = diffDays % DAILY_WORDS.length;
  const dailyWord = DAILY_WORDS[index];

  // Debug: Log today's word selection
  console.log(
    `[Word Selection] Date: ${today.toDateString()}, Days since start: ${diffDays}, Index: ${index}, Word: ${dailyWord}`
  );

  return dailyWord;
}

// Compare guess word with target word and return tile states
export function compareWords(guess: string, target: string): Tile[] {
  const targetUpper = target.toUpperCase();
  const guessUpper = guess.toUpperCase();
  const tiles: Tile[] = [];
  const targetLetterCounts: Record<string, number> = {};
  const usedIndices = new Set<number>();

  // Count letters in target word
  for (let i = 0; i < targetUpper.length; i++) {
    const letter = targetUpper[i];
    targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
  }

  // First pass: mark correct positions (green)
  for (let i = 0; i < guessUpper.length; i++) {
    const letter = guessUpper[i];
    if (letter === targetUpper[i]) {
      tiles[i] = { letter, state: "correct" };
      usedIndices.add(i);
      targetLetterCounts[letter]--;
      console.log(
        `[compareWords] Position ${i}: '${letter}' = GREEN (matches target[${i}]='${targetUpper[i]}')`
      );
    } else {
      tiles[i] = { letter, state: "absent" };
      console.log(
        `[compareWords] Position ${i}: '${letter}' vs '${targetUpper[i]}' - No match, initially absent`
      );
    }
  }

  // Second pass: mark present letters (yellow)
  for (let i = 0; i < guessUpper.length; i++) {
    if (usedIndices.has(i)) continue;

    const letter = guessUpper[i];
    if (targetLetterCounts[letter] > 0) {
      tiles[i].state = "present";
      targetLetterCounts[letter]--;
      console.log(
        `[compareWords] Position ${i}: '${letter}' = YELLOW (in word but wrong position)`
      );
    } else {
      console.log(
        `[compareWords] Position ${i}: '${letter}' = GRAY (not in word or already used)`
      );
    }
  }

  console.log(
    `[compareWords] Final tiles for "${guess}" vs "${target}":`,
    tiles.map((t, i) => `[${i}]${t.letter}:${t.state}`).join(", ")
  );
  return tiles;
}

// Update letter states based on new guess
export function updateLetterStates(
  currentStates: Record<string, LetterState>,
  tiles: Tile[]
): Record<string, LetterState> {
  const newStates = { ...currentStates };

  for (const tile of tiles) {
    const letter = tile.letter;
    const currentState = newStates[letter];

    // Priority: correct > present > absent
    if (!currentState || currentState === "absent") {
      newStates[letter] = tile.state;
    } else if (currentState === "present" && tile.state === "correct") {
      newStates[letter] = "correct";
    }
  }

  return newStates;
}
