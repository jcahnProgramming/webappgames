import React, { useState } from "react";
import "./App.css";

import { GameShell } from "./components/GameShell";

import { WordleGame } from "./games/WordleGame";
import { WordSearchGame } from "./games/WordSearchGame";
import { SudokuGame } from "./games/SudokuGame";
import { TicTacToeGame } from "./games/TicTacToeGame";
import { Game2048 } from "./games/Game2048";
import { MemoryMatchGame } from "./games/MemoryMatchGame";
import { SlidingPuzzleGame } from "./games/SlidingPuzzleGame";
import { TriviaGame } from "./games/TriviaGame";
import { ConnectFourGame } from "./games/ConnectFourGame";
import { RpslsGame } from "./games/RpslsGame";
import { MinesweeperGame } from "./games/MinesweeperGame";

type GameId =
  | "wordle"
  | "wordsearch"
  | "sudoku"
  | "tictactoe"
  | "game2048"
  | "memory"
  | "sliding"
  | "trivia"
  | "connect4"
  | "rpsls"
  | "minesweeper";

type GameMeta = {
  id: GameId;
  shortName: string;
  name: string;
  tagline: string;
  badge?: string;
};

const GAME_LIST: GameMeta[] = [
  {
    id: "wordle",
    shortName: "Wordle",
    name: "Wordle Clone",
    tagline: "Guess the hidden 5-letter word in 6 tries.",
    badge: "Popular",
  },
  {
    id: "wordsearch",
    shortName: "Word Search",
    name: "Word Search",
    tagline: "Drag to highlight hidden words in a letter grid.",
  },
  {
    id: "sudoku",
    shortName: "Sudoku",
    name: "Sudoku",
    tagline: "Fill the 9×9 board so each row, column and box has 1–9.",
  },
  {
    id: "tictactoe",
    shortName: "Tic-Tac-Toe",
    name: "Tic-Tac-Toe vs AI",
    tagline: "Classic X vs O with a simple computer opponent.",
  },
  {
    id: "game2048",
    shortName: "2048",
    name: "2048",
    tagline: "Slide and merge tiles to reach 2048.",
  },
  {
    id: "memory",
    shortName: "Memory",
    name: "Memory Match",
    tagline: "Flip cards and find all the emoji pairs.",
  },
  {
    id: "sliding",
    shortName: "Sliding",
    name: "Sliding Puzzle",
    tagline: "Rearrange tiles to put the numbers back in order.",
  },
  {
    id: "trivia",
    shortName: "Trivia",
    name: "Trivia Quiz",
    tagline: "10 quick dev-themed questions with instant feedback.",
  },
  {
    id: "connect4",
    shortName: "Connect 4",
    name: "Connect Four",
    tagline: "Drop discs and connect four in a row with a friend.",
  },
  {
    id: "rpsls",
    shortName: "RPSLS",
    name: "Rock–Paper–Scissors–Lizard–Spock",
    tagline: "Because normal RPS wasn’t chaotic enough.",
  },
  {
    id: "minesweeper",
    shortName: "Minesweeper",
    name: "Minesweeper Lite",
    tagline: "Clear the board without detonating a mine.",
  },
];

const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId>("wordle");

  const currentMeta = GAME_LIST.find((g) => g.id === activeGame) ?? GAME_LIST[0];

  const renderGame = () => {
    switch (activeGame) {
      case "wordle":
        return <WordleGame />;
      case "wordsearch":
        return <WordSearchGame />;
      case "sudoku":
        return <SudokuGame />;
      case "tictactoe":
        return <TicTacToeGame />;
      case "game2048":
        return <Game2048 />;
      case "memory":
        return <MemoryMatchGame />;
      case "sliding":
        return <SlidingPuzzleGame />;
      case "trivia":
        return <TriviaGame />;
      case "connect4":
        return <ConnectFourGame />;
      case "rpsls":
        return <RpslsGame />;
      case "minesweeper":
        return <MinesweeperGame />;
      default:
        return null;
    }
  };

  return (
    <div className="site-container">
      {/* Header / brand */}
      <header className="site-header">
        <div className="site-brand">
          <div className="site-logo">🎮</div>
          <div>
            <h1 className="site-title">Path&apos;s Mini Arcade</h1>
            <p className="site-tagline">
              A collection of small web games built with React + TypeScript.
            </p>
          </div>
        </div>
      </header>

      <main className="site-main">
        {/* Landing hero */}
        <section className="site-hero">
          <div className="site-hero-text">
            <h2>Playful, responsive, and built for the browser.</h2>
            <p>
              This mini arcade doubles as a portfolio piece: each game shows off
              frontend state management, game logic, and mobile-first UI.
            </p>
            <ul className="site-hero-list">
              <li>⚡ React + TypeScript SPA</li>
              <li>📱 Optimized for mobile & desktop</li>
              <li>🎯 Multiple genres: puzzle, logic, trivia & more</li>
            </ul>
          </div>
          <div className="site-hero-highlight">
            <span className="site-hero-label">Now playing</span>
            <h3 className="site-hero-game-name">{currentMeta.name}</h3>
            <p className="site-hero-game-tagline">{currentMeta.tagline}</p>
            <button
              className="primary-button site-hero-play"
              onClick={() => {
                const el = document.querySelector(".game-shell-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              Jump into game
            </button>
          </div>
        </section>

        {/* Game selection section */}
        <section className="game-picker">
          <div className="game-picker-header">
            <div>
              <h2>Choose a game</h2>
              <p className="game-picker-subtitle">
                Tap a game to load it below. Great for quick play sessions or
                demoing your frontend chops.
              </p>
            </div>
            <span className="game-picker-count">
              {GAME_LIST.length} games and counting
            </span>
          </div>

          {/* Upgraded selection bar */}
          <div className="game-chip-row">
            {GAME_LIST.map((game) => (
              <button
                key={game.id}
                className={[
                  "game-chip",
                  game.id === activeGame ? "game-chip--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActiveGame(game.id)}
              >
                <span className="game-chip-name">{game.shortName}</span>
                {game.badge && (
                  <span className="game-chip-badge">{game.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Current game summary */}
          <div className="game-detail">
            <div className="game-detail-text">
              <h3>{currentMeta.name}</h3>
              <p>{currentMeta.tagline}</p>
            </div>
            <button
              className="secondary-button game-detail-play"
              onClick={() => {
                const el = document.querySelector(".game-shell-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              Scroll to game
            </button>
          </div>
        </section>

        {/* Actual game area */}
        <section className="game-shell-section">
          <GameShell>{renderGame()}</GameShell>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Built with React + TypeScript. &copy; {new Date().getFullYear()} Path
        </p>
      </footer>
    </div>
  );
};

export default App;
