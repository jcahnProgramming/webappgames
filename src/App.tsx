import React, { useState } from "react";
import "./App.css";

import { GameShell } from "./components/GameShell";
import { ProfileDashboard } from "./components/ProfileDashboard";
import { useArcade } from "./context/ArcadeContext";
import type { GameId } from "./context/ArcadeContext";
import AchievementToastContainer from "./components/AchievementToastContainer";

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

type ViewId = "arcade" | "profile" | "about";

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
    tagline: "Find hidden words in the letter grid.",
  },
  {
    id: "sudoku",
    shortName: "Sudoku",
    name: "Sudoku",
    tagline: "Fill the 9×9 grid so each row, column and box has 1–9.",
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

const GAME_CONTROLS: Record<GameId, string[]> = {
  wordle: [
    "Type letters A–Z to fill the row.",
    "Enter to submit your guess.",
    "Backspace deletes the last letter.",
  ],
  wordsearch: [
    "Click and drag to select letter paths.",
    "On mobile, use touch and drag to highlight words.",
  ],
  sudoku: [
    "Tap/click a cell, then choose a number.",
    "Each row, column and 3×3 box must contain 1–9.",
  ],
  tictactoe: [
    "Tap a square to place your mark.",
    "Play against the built-in AI.",
  ],
  game2048: [
    "Click/tap into the board, then use arrow keys to slide tiles.",
    "Try to reach the 2048 tile.",
  ],
  memory: [
    "Tap cards to flip them.",
    "Flip two matching cards to clear a pair.",
  ],
  sliding: [
    "Click a tile adjacent to the empty space to slide it.",
    "Or focus the puzzle and use arrow keys to move tiles.",
    "Tiles turn green when they’re in the correct position.",
  ],
  trivia: [
    "Click an answer option to select it.",
    "Or press keys 1–4 to choose an option.",
    "Then click 'Next Question' / 'Finish Quiz' to continue.",
  ],
  connect4: [
    "Click a column arrow to drop your disc.",
    "Or press keys 1–7 to drop in that column.",
    "First player to connect four in a row wins.",
  ],
  rpsls: [
    "Click any move button to play a round.",
    "Track wins, losses, and draws in the stats.",
  ],
  minesweeper: [
    "Tap cells to reveal them.",
    "Toggle 'Flag Mode' to mark suspected mines.",
    "Clear all safe cells without hitting a mine.",
  ],
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewId>("arcade");
  const [activeGame, setActiveGame] = useState<GameId>("wordle");

  const { currency, achievements } = useArcade();

  const currentMeta =
    GAME_LIST.find((g) => g.id === activeGame) ?? GAME_LIST[0];

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

  const scrollToGame = () => {
    const el = document.querySelector(".game-shell-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="site-container">
      {/* Global achievement toasts */}
      <AchievementToastContainer />

      {/* Top nav / chrome */}
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

        <nav className="site-nav">
          <button
            className={
              activeView === "arcade"
                ? "site-nav-item site-nav-item--active"
                : "site-nav-item"
            }
            onClick={() => setActiveView("arcade")}
          >
            Arcade
          </button>
          <button
            className={
              activeView === "profile"
                ? "site-nav-item site-nav-item--active"
                : "site-nav-item"
            }
            onClick={() => setActiveView("profile")}
          >
            Profile
          </button>
          <button
            className={
              activeView === "about"
                ? "site-nav-item site-nav-item--active"
                : "site-nav-item"
            }
            onClick={() => setActiveView("about")}
          >
            About
          </button>
        </nav>

        {/* Right-side HUD: coins + achievements */}
        <div className="site-hud">
          <div className="hud-pill hud-pill--coins">
            <span className="hud-label">Coins</span>
            <span className="hud-value">💰 {currency}</span>
          </div>
          <div className="hud-pill hud-pill--achievements">
            <span className="hud-label">Achievements</span>
            <span className="hud-value">🏆 {achievements.length}</span>
          </div>
        </div>
      </header>

      <main className="site-main">
        {activeView === "arcade" && (
          <>
            {/* Hero section */}
            <section className="site-hero">
              <div className="site-hero-text">
                <h2>Playful, responsive, and built for the browser.</h2>
                <p>
                  This mini arcade doubles as a portfolio piece: each game shows
                  off frontend state management, game logic, and mobile-first
                  UI.
                </p>
                <ul className="site-hero-list">
                  <li>⚡ React + TypeScript SPA</li>
                  <li>📱 Optimized for mobile &amp; desktop</li>
                  <li>🎯 Multiple genres: puzzle, logic, trivia &amp; more</li>
                </ul>
              </div>
              <div className="site-hero-highlight">
                <span className="site-hero-label">Now playing</span>
                <h3 className="site-hero-game-name">{currentMeta.name}</h3>
                <p className="site-hero-game-tagline">
                  {currentMeta.tagline}
                </p>
                <button
                  className="primary-button site-hero-play"
                  onClick={scrollToGame}
                >
                  Jump into game
                </button>
              </div>
            </section>

            {/* Game picker */}
            <section className="game-picker">
              <div className="game-picker-header">
                <div>
                  <h2>Choose a game</h2>
                  <p className="game-picker-subtitle">
                    Tap a game to load it below. Great for quick play sessions
                    or demoing your frontend chops.
                  </p>
                </div>
                <span className="game-picker-count">
                  {GAME_LIST.length} games and counting
                </span>
              </div>

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

              <div className="game-detail">
                <div className="game-detail-text">
                  <h3>{currentMeta.name}</h3>
                  <p>{currentMeta.tagline}</p>
                </div>
                <button
                  className="secondary-button game-detail-play"
                  onClick={scrollToGame}
                >
                  Scroll to game
                </button>
              </div>
            </section>

            {/* Game shell */}
            <section className="game-shell-section">
              <GameShell
                controls={GAME_CONTROLS[activeGame]}
                gameId={activeGame}
                gameTitle={currentMeta.name}
              >
                {renderGame()}
              </GameShell>
            </section>
          </>
        )}

        {activeView === "profile" && (
          <section className="profile-section-wrapper">
            <ProfileDashboard />
          </section>
        )}

        {activeView === "about" && (
          <section className="about-section">
            <h2>How this arcade is built</h2>
            <p>
              This mini arcade is built with React, TypeScript and a custom
              game framework of small, self-contained components. Each game
              demonstrates different UI and state-management patterns—from
              grid-based logic (Wordle, Sliding Puzzle, Minesweeper) to merge
              mechanics (2048) and win detection (Connect Four).
            </p>
            <p>
              The app is mobile-first and keyboard-friendly, with shared
              components like the game shell, a global arcade context for
              stats/achievements, and simple theming that can be extended with
              skins and a cosmetic store in the future.
            </p>
          </section>
        )}
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
