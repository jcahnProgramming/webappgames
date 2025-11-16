import React, { useMemo, useState } from "react";

type LetterStatus = "correct" | "present" | "absent" | "empty";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Very small word list to keep it simple.
// You can expand this later or load from a JSON file.
const WORD_LIST = [
  "APPLE",
  "BRAIN",
  "SMART",
  "CRANE",
  "CODES",
  "LIGHT",
  "POINT",
  "TRACK",
  "WORDS",
  "SHARE",
];

const KEYBOARD_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["ENTER", ..."ZXCVBNM".split(""), "DEL"],
];

type GameStatus = "playing" | "won" | "lost";

export const WordleGame: React.FC = () => {
  const [answer, setAnswer] = useState<string>(() => {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
});
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [message, setMessage] = useState<string | null>(null);

  const resetGame = () => {
  const randomWord =
    WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  setAnswer(randomWord);
  setGuesses([]);
  setCurrentGuess("");
  setStatus("playing");
  setMessage(null);
};

  const handleAddLetter = (letter: string) => {
    if (status !== "playing") return;
    if (currentGuess.length >= WORD_LENGTH) return;
    setCurrentGuess((prev) => prev + letter);
    setMessage(null);
  };

  const handleDeleteLetter = () => {
    if (status !== "playing") return;
    setCurrentGuess((prev) => prev.slice(0, -1));
    setMessage(null);
  };

  const handleSubmitGuess = () => {
    if (status !== "playing") return;
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Not enough letters.");
      return;
    }

    const newGuess = currentGuess.toUpperCase();

    // Optional dictionary validation could go here.

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (newGuess === answer) {
      setStatus("won");
      setMessage("Nice! You got it!");
      return;
    }

    if (newGuesses.length >= MAX_GUESSES) {
      setStatus("lost");
      setMessage(`Out of guesses! The word was ${answer}.`);
      return;
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "ENTER") {
      handleSubmitGuess();
    } else if (key === "DEL") {
      handleDeleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
      handleAddLetter(key);
    }
  };

  // Compute per-letter status for keyboard coloring
  const letterStatuses: Record<string, LetterStatus> = useMemo(() => {
    const map: Record<string, LetterStatus> = {};
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        const ch = guess[i];
        if (answer[i] === ch) {
          map[ch] = "correct";
        } else if (answer.includes(ch)) {
          if (map[ch] !== "correct") map[ch] = "present";
        } else {
          if (!map[ch]) map[ch] = "absent";
        }
      }
    }
    return map;
  }, [guesses, answer]);

  const getTileStatus = (rowIndex: number, colIndex: number): LetterStatus => {
    const guess = guesses[rowIndex];
    const isCurrentRow = rowIndex === guesses.length;

    if (!guess && !isCurrentRow) return "empty";

    if (isCurrentRow) {
      const letter = currentGuess[colIndex];
      return letter ? "empty" : "empty";
    }

    const letter = guess[colIndex];
    if (!letter) return "empty";

    if (answer[colIndex] === letter) return "correct";
    if (answer.includes(letter)) return "present";
    return "absent";
  };

  const getTileLetter = (rowIndex: number, colIndex: number): string => {
    const guess = guesses[rowIndex];
    const isCurrentRow = rowIndex === guesses.length;

    if (guess) {
      return guess[colIndex] ?? "";
    }

    if (isCurrentRow) {
      return currentGuess[colIndex] ?? "";
    }

    return "";
  };

  return (
    <div className="wordle">
      <div className="wordle-header">
        <h2>Wordle Clone</h2>
        <p>Guess the {WORD_LENGTH}-letter word in {MAX_GUESSES} tries.</p>
      </div>

      <div className="wordle-grid">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
              const status = getTileStatus(rowIndex, colIndex);
              const letter = getTileLetter(rowIndex, colIndex);
              return (
                <div
                  key={colIndex}
                  className={`wordle-tile wordle-tile--${status}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="wordle-keyboard">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="wordle-keyboard-row">
            {row.map((key) => {
              const isActionKey = key === "ENTER" || key === "DEL";
              const status =
                key.length === 1 ? letterStatuses[key] ?? "empty" : "empty";
              return (
                <button
                  key={key}
                  className={`wordle-key ${
                    isActionKey ? "wordle-key--wide" : ""
                  } wordle-key--${status}`}
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {message && <div className="wordle-message">{message}</div>}

      <div className="wordle-actions">
        <button className="primary-button" onClick={resetGame}>
          New Word
        </button>
      </div>
    </div>
  );
};
