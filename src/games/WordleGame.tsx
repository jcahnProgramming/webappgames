import React, { useState } from "react";

type WordleStatus = "playing" | "won" | "lost";

type LetterStatus = "correct" | "present" | "absent" | "empty";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Simple built-in word list – replace/expand as you like
const WORDS = ["APPLE", "REACT", "GAMES", "STACK", "CRANE", "WORLD", "TYPES"];

function pickRandomWord(): string {
  const idx = Math.floor(Math.random() * WORDS.length);
  return WORDS[idx];
}

function evaluateGuess(guess: string, target: string): LetterStatus[] {
  const result: LetterStatus[] = Array(WORD_LENGTH).fill("absent");
  const targetChars = target.split("");

  // First pass – correct positions
  const usedTarget = targetChars.map((ch) => ch);
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      usedTarget[i] = "*"; // mark as used
    }
  }

  // Second pass – present but wrong position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;

    const idx = usedTarget.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      usedTarget[idx] = "*";
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

export const WordleGame: React.FC = () => {
  const [target, setTarget] = useState<string>(() => pickRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [status, setStatus] = useState<WordleStatus>("playing");
  const [message, setMessage] = useState<string | null>(null);

  const rows = Array.from({ length: MAX_GUESSES }).map((_, i) => guesses[i] ?? "");

  const handleLetter = (letter: string) => {
    if (status !== "playing") return;
    if (currentGuess.length >= WORD_LENGTH) return;

    const upper = letter.toUpperCase();
    if (!/^[A-Z]$/.test(upper)) return;

    setCurrentGuess((prev) => prev + upper);
    setMessage(null);
  };

  const handleBackspace = () => {
    if (status !== "playing") return;
    if (currentGuess.length === 0) return;

    setCurrentGuess((prev) => prev.slice(0, -1));
    setMessage(null);
  };

  const handleSubmit = () => {
    if (status !== "playing") return;

    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Not enough letters.");
      return;
    }

    const guess = currentGuess.toUpperCase();
    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);
    setCurrentGuess("");

    if (guess === target) {
      setStatus("won");
      setMessage("You got it! 🎉");
      return;
    }

    if (nextGuesses.length >= MAX_GUESSES) {
      setStatus("lost");
      setMessage(`Out of guesses. The word was ${target}.`);
      return;
    }

    setMessage(null);
  };

  const resetGame = () => {
    setTarget(pickRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setStatus("playing");
    setMessage(null);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const key = e.key;

    if (/^[a-zA-Z]$/.test(key)) {
      e.preventDefault();
      handleLetter(key);
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      handleBackspace();
      return;
    }

    if (key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }
  };

  const getCellStatus = (rowIndex: number, colIndex: number): LetterStatus => {
    const guess = rows[rowIndex];
    const char = guess[colIndex];

    if (!char) return "empty";
    if (rowIndex >= guesses.length) return "empty";

    const evaluation = evaluateGuess(guesses[rowIndex], target);
    return evaluation[colIndex];
  };

  return (
    <div
      className="wordle"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>Wordle Clone</h2>
      <p className="wordle-subtitle">
        Type letters and press Enter to submit. Backspace deletes.
      </p>

      <div className="wordle-grid">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
              const guessChar =
                rowIndex === guesses.length
                  ? currentGuess[colIndex] ?? ""
                  : row[colIndex] ?? "";

              const statusForCell = getCellStatus(rowIndex, colIndex);

              const cellClass = [
                "wordle-cell",
                statusForCell === "correct" ? "wordle-cell-correct" : "",
                statusForCell === "present" ? "wordle-cell-present" : "",
                statusForCell === "absent" ? "wordle-cell-absent" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={colIndex} className={cellClass}>
                  {guessChar}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {message && <div className="wordle-message">{message}</div>}

      <div className="wordle-actions">
        <button
          className="primary-button"
          onClick={handleSubmit}
          disabled={status !== "playing"}
        >
          Submit Guess
        </button>
        <button className="secondary-button" onClick={resetGame}>
          New Word
        </button>
      </div>
    </div>
  );
};
