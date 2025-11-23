// Official Wordle word lists
import answersData from "./answers.json";
import validGuessesData from "./validGuesses.json";

// Convert to uppercase for consistency
const ANSWERS: string[] = answersData.map((word: string) => word.toUpperCase());
const VALID_GUESSES: string[] = validGuessesData.map((word: string) =>
  word.toUpperCase()
);

// Daily puzzle words (from official Wordle answers list)
export const DAILY_WORDS = ANSWERS;

// Complete dictionary for validation (answers + valid guesses)
// Users can guess any word from either list
const ALL_VALID_WORDS = [...ANSWERS, ...VALID_GUESSES];
export const DICTIONARY = new Set(ALL_VALID_WORDS);

export function isValidWord(word: string): boolean {
  return DICTIONARY.has(word.toUpperCase());
}
