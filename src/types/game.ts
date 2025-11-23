export type LetterState = "correct" | "present" | "absent" | "empty";

export interface Tile {
  letter: string;
  state: LetterState;
}

export interface Guess {
  word: string;
  tiles: Tile[];
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  currentGuess: string;
  guesses: Guess[];
  status: GameStatus;
  letterStates: Record<string, LetterState>;
  dailyWord: string;
  date: string;
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}
