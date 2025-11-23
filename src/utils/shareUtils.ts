export function generateShareText(
  guesses: number,
  won: boolean,
  gameState: { guesses: Array<{ tiles: Array<{ state: string }> }> },
  dailyWord: string
): string {
  const gameNumber = getDayNumber();

  let shareText = `Wordle ${gameNumber} ${guesses}/6\n\n`;

  for (const guess of gameState.guesses) {
    let row = "";
    for (const tile of guess.tiles) {
      if (tile.state === "correct") {
        row += "🟩";
      } else if (tile.state === "present") {
        row += "🟨";
      } else {
        row += "⬛";
      }
    }
    shareText += row + "\n";
  }

  if (!won) {
    shareText += `\nThe word was: ${dailyWord}`;
  }

  return shareText;
}

export function getDayNumber(): number {
  const WORDLE_START_DATE = new Date("2021-06-19T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - WORDLE_START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch {
    return false;
  }
}
