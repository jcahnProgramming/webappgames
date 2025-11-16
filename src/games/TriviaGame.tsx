import React, { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

type TriviaStatus = "playing" | "finished";

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which language is primarily used with React for type safety?",
    options: ["Java", "TypeScript", "Python", "Ruby"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "Hyper Text Markdown Language",
      "Hyperlink and Text Mark Language",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Which of these is NOT a JavaScript framework?",
    options: ["React", "Vue", "Laravel", "Svelte"],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "What is the value of 2 ** 3 in JavaScript?",
    options: ["5", "6", "8", "9"],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "Which HTTP status code means 'Not Found'?",
    options: ["200", "301", "404", "500"],
    correctIndex: 2,
  },
  {
    id: 6,
    question: "CSS is mainly used for:",
    options: [
      "Structuring content",
      "Styling and layout",
      "Database management",
      "Server configuration",
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: "Which company created React?",
    options: ["Google", "Microsoft", "Facebook (Meta)", "Amazon"],
    correctIndex: 2,
  },
  {
    id: 8,
    question: "In Git, which command creates a new branch?",
    options: ["git commit", "git checkout -b", "git merge", "git status"],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "What does API stand for?",
    options: [
      "Advanced Programming Internet",
      "Application Programming Interface",
      "Applied Program Integration",
      "Automated Protocol Interface",
    ],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "JSON is most similar to:",
    options: ["XML", "CSV", "YAML", "JavaScript objects"],
    correctIndex: 3,
  },
];

export const TriviaGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<TriviaStatus>("playing");
  const [score, setScore] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const hasNext = currentIndex < QUESTIONS.length - 1;

  const handleOptionClick = (index: number) => {
    if (selectedIndex !== null || status !== "playing") return;
    setSelectedIndex(index);

    if (index === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex === null) return;

    if (hasNext) {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
    } else {
      setStatus("finished");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setStatus("playing");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (status !== "playing") return;
    if (selectedIndex !== null) return;

    const maxOption = currentQuestion.options.length;

    if (e.key >= "1" && e.key <= String(maxOption)) {
      e.preventDefault();
      const idx = Number(e.key) - 1;
      handleOptionClick(idx);
    }
  };

  const progressText = `Question ${currentIndex + 1} of ${QUESTIONS.length}`;

  const resultMessage = (() => {
    const pct = (score / QUESTIONS.length) * 100;
    if (pct === 100) return "Perfect! 🔥";
    if (pct >= 80) return "Great job! 🎉";
    if (pct >= 50) return "Nice work! 👍";
    return "Keep practicing! 💪";
  })();

  return (
    <div
      className="trivia"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>Trivia Quiz</h2>

      {status === "playing" ? (
        <>
          <div className="trivia-progress">
            <span>{progressText}</span>
            <span>Score: {score}</span>
          </div>

          <div className="trivia-question">{currentQuestion.question}</div>

          <div className="trivia-options">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              const showCorrect = selectedIndex !== null && isCorrect;
              const showIncorrect =
                selectedIndex !== null && isSelected && !isCorrect;

              const classes = [
                "trivia-option",
                isSelected ? "trivia-option--selected" : "",
                showCorrect ? "trivia-option--correct" : "",
                showIncorrect ? "trivia-option--incorrect" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={idx}
                  className={classes}
                  onClick={() => handleOptionClick(idx)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="trivia-actions">
            <button
              className="primary-button"
              onClick={handleNext}
              disabled={selectedIndex === null}
            >
              {hasNext ? "Next Question" : "Finish Quiz"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="trivia-result">
            <h3>Quiz Complete</h3>
            <p>
              You scored {score} out of {QUESTIONS.length}.
            </p>
            <p>{resultMessage}</p>
          </div>
          <div className="trivia-actions">
            <button className="primary-button" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </>
      )}
    </div>
  );
};
