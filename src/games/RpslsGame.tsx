import React, { useState } from "react";

type Choice = "rock" | "paper" | "scissors" | "lizard" | "spock";
type Result = "win" | "lose" | "draw";

type Round = {
  player: Choice;
  cpu: Choice;
  result: Result;
};

const CHOICES: Choice[] = ["rock", "paper", "scissors", "lizard", "spock"];

const LABELS: Record<Choice, string> = {
  rock: "Rock 🪨",
  paper: "Paper 📄",
  scissors: "Scissors ✂️",
  lizard: "Lizard 🦎",
  spock: "Spock 🖖",
};

const RULES: Record<Choice, Choice[]> = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};

function getCpuChoice(): Choice {
  const idx = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[idx];
}

function getResult(player: Choice, cpu: Choice): Result {
  if (player === cpu) return "draw";
  if (RULES[player].includes(cpu)) return "win";
  return "lose";
}

export const RpslsGame: React.FC = () => {
  const [lastRound, setLastRound] = useState<Round | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);

  const play = (playerChoice: Choice) => {
    const cpuChoice = getCpuChoice();
    const result = getResult(playerChoice, cpuChoice);

    setLastRound({ player: playerChoice, cpu: cpuChoice, result });

    if (result === "win") setWins((w) => w + 1);
    if (result === "lose") setLosses((l) => l + 1);
    if (result === "draw") setDraws((d) => d + 1);
  };

  const reset = () => {
    setLastRound(null);
    setWins(0);
    setLosses(0);
    setDraws(0);
  };

  const resultText =
    lastRound?.result === "win"
      ? "You win! 🎉"
      : lastRound?.result === "lose"
      ? "You lose! 😈"
      : lastRound?.result === "draw"
      ? "It’s a draw. 🤝"
      : "Pick a move to play.";

  const detailText =
    lastRound &&
    `${LABELS[lastRound.player]} vs ${LABELS[lastRound.cpu]}`;

  return (
    <div className="rpsls">
      <h2>Rock–Paper–Scissors–Lizard–Spock</h2>
      <p className="rpsls-subtitle">
        Classic + nerdy. Rock crushes Scissors, Scissors cuts Paper, etc.
      </p>

      <div className="rpsls-stats">
        <span>Wins: {wins}</span>
        <span>Losses: {losses}</span>
        <span>Draws: {draws}</span>
      </div>

      <div className="rpsls-choices">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            className="rpsls-choice"
            onClick={() => play(choice)}
          >
            {LABELS[choice]}
          </button>
        ))}
      </div>

      <div className="rpsls-result">
        <div className="rpsls-result-main">{resultText}</div>
        {detailText && (
          <div className="rpsls-result-detail">{detailText}</div>
        )}
      </div>

      <div className="rpsls-actions">
        <button className="primary-button" onClick={reset}>
          Reset Stats
        </button>
      </div>
    </div>
  );
};
