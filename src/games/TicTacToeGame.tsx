import React, { useState } from "react";

type Player = "X" | "O";
type CellValue = Player | null;
type GameStatus = "in_progress" | "won" | "draw";

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: CellValue[]): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

// Very simple AI:
// 1. Take winning move if available
// 2. Block human's winning move
// 3. Take center if free
// 4. Otherwise pick a random empty cell
function chooseAiMove(board: CellValue[]): number | null {
  const emptyIndices = board
    .map((val, idx) => (val === null ? idx : -1))
    .filter((idx) => idx !== -1);

  if (emptyIndices.length === 0) return null;

  // helper to test move
  const tryMove = (idx: number, player: Player): boolean => {
    const copy = [...board];
    copy[idx] = player;
    return calculateWinner(copy) === player;
  };

  // 1. winning move
  for (const idx of emptyIndices) {
    if (tryMove(idx, "O")) return idx;
  }

  // 2. block human
  for (const idx of emptyIndices) {
    if (tryMove(idx, "X")) return idx;
  }

  // 3. center
  if (emptyIndices.includes(4)) return 4;

  // 4. random
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X"); // human starts
  const [status, setStatus] = useState<GameStatus>("in_progress");
  const [winner, setWinner] = useState<Player | null>(null);

  const handleCellClick = (index: number) => {
    if (status !== "in_progress") return;
    if (board[index] !== null) return;
    if (currentPlayer !== "X") return; // wait for AI

    // Human move
    const humanBoard = [...board];
    humanBoard[index] = "X";
    finishTurn(humanBoard, "X", true);
  };

  const finishTurn = (
    newBoard: CellValue[],
    playerJustMoved: Player,
    shouldTriggerAi: boolean
  ) => {
    const win = calculateWinner(newBoard);
    if (win) {
      setBoard(newBoard);
      setStatus("won");
      setWinner(win);
      return;
    }

    if (isBoardFull(newBoard)) {
      setBoard(newBoard);
      setStatus("draw");
      setWinner(null);
      return;
    }

    if (shouldTriggerAi && playerJustMoved === "X") {
      // AI's turn
      const aiIndex = chooseAiMove(newBoard);
      if (aiIndex === null) {
        setBoard(newBoard);
        setStatus("draw");
        setWinner(null);
        return;
      }

      const aiBoard = [...newBoard];
      aiBoard[aiIndex] = "O";

      const aiWin = calculateWinner(aiBoard);
      if (aiWin) {
        setBoard(aiBoard);
        setStatus("won");
        setWinner(aiWin);
        setCurrentPlayer("X");
        return;
      }

      if (isBoardFull(aiBoard)) {
        setBoard(aiBoard);
        setStatus("draw");
        setWinner(null);
        setCurrentPlayer("X");
        return;
      }

      setBoard(aiBoard);
      setCurrentPlayer("X");
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer(playerJustMoved === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setStatus("in_progress");
    setWinner(null);
  };

  const statusText = (() => {
    if (status === "won" && winner === "X") return "You win! 🎉";
    if (status === "won" && winner === "O") return "AI wins! 🤖";
    if (status === "draw") return "It's a draw.";
    return "Your turn (X)";
  })();

  return (
    <div className="ttt">
      <h2>Tic-Tac-Toe</h2>
      <p className="ttt-subtitle">You are X. Try to beat the AI!</p>

      <div className="ttt-grid">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="ttt-cell"
            onClick={() => handleCellClick(idx)}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="ttt-status">{statusText}</div>

      <div className="ttt-actions">
        <button className="primary-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
