import React, { useState } from "react";
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
  | "minesweeper"
  | "comingSoon";










const GAME_LABELS: Record<GameId, string> = {
  wordle: "Wordle Clone",
  wordsearch: "Word Search",
  sudoku: "Sudoku",
  tictactoe: "Tic-Tac-Toe",
  game2048: "2048",
  memory: "Memory Match",
  sliding: "Sliding Puzzle",
  trivia: "Trivia Quiz",
  connect4: "Connect Four",
  rpsls: "RPS Lizard Spock",
  minesweeper: "Minesweeper Lite",
  comingSoon: "More Games Soon",
};











const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId>("wordle");

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
      return (
        <div className="placeholder">
          More games are coming soon to this arcade. Stay tuned!</div>
      );
  }
};











  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Path’s Web Arcade</h1>
        <p className="app-subtitle">Mobile-friendly mini games built with TypeScript.</p>
      </header>

      <nav className="game-nav">
        {Object.entries(GAME_LABELS).map(([id, label]) => (
          <button
            key={id}
            className={`game-nav-button ${
              activeGame === id ? "game-nav-button--active" : ""
            }`}
            onClick={() => setActiveGame(id as GameId)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        <GameShell>{renderGame()}</GameShell>
      </main>

      <footer className="app-footer">
        <span>Built with React + TypeScript · Optimized for mobile</span>
      </footer>
    </div>
  );
};

export default App;
