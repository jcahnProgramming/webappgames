import React, { useState } from "react";

type Player = "R" | "Y";
type Cell = Player | null;

type StatusCF = "playing" | "won" | "draw";

const ROWS = 6;
const COLS = 7;

type Board = Cell[][]; // [row][col]

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );
}

function dropDisc(board: Board, col: number, player: Player): Board | null {
  if (col < 0 || col >= COLS) return null;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      return newBoard;
    }
  }
  return null;
}

function checkWinner(board: Board): Player | null {
  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diag down-right
    { dr: -1, dc: 1 }, // diag up-right
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell) continue;

      for (const { dr, dc } of directions) {
        let count = 1;
        let rr = r + dr;
        let cc = c + dc;

        while (
          rr >= 0 &&
          rr < ROWS &&
          cc >= 0 &&
          cc < COLS &&
          board[rr][cc] === cell
        ) {
          count++;
          if (count === 4) return cell;
          rr += dr;
          cc += dc;
        }
      }
    }
  }

  return null;
}

function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== null);
}

export const ConnectFourGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("R");
  const [status, setStatus] = useState<StatusCF>("playing");
  const [winner, setWinner] = useState<Player | null>(null);

  const handleColumnClick = (col: number) => {
    if (status !== "playing") return;

    const newBoard = dropDisc(board, col, currentPlayer);
    if (!newBoard) return;

    const maybeWinner = checkWinner(newBoard);

    if (maybeWinner) {
      setBoard(newBoard);
      setStatus("won");
      setWinner(maybeWinner);
      return;
    }

    if (isBoardFull(newBoard)) {
      setBoard(newBoard);
      setStatus("draw");
      setWinner(null);
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer((p) => (p === "R" ? "Y" : "R"));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (status !== "playing") return;

    if (e.key >= "1" && e.key <= "7") {
      e.preventDefault();
      const col = Number(e.key) - 1;
      handleColumnClick(col);
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("R");
    setStatus("playing");
    setWinner(null);
  };

  const statusText = (() => {
    if (status === "won" && winner === "R") return "Red wins! 🔴🎉";
    if (status === "won" && winner === "Y") return "Yellow wins! 🟡🎉";
    if (status === "draw") return "It's a draw.";
    return currentPlayer === "R" ? "Red’s turn (🔴)" : "Yellow’s turn (🟡)";
  })();

  return (
    <div
      className="c4"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>Connect Four</h2>
      <p className="c4-subtitle">{statusText}</p>

      <div className="c4-board">
        <div className="c4-columns">
          {Array.from({ length: COLS }).map((_, col) => (
            <button
              key={col}
              className="c4-col-button"
              onClick={() => handleColumnClick(col)}
            >
              ▼
            </button>
          ))}
        </div>

        <div className="c4-grid">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const classes = [
                "c4-cell",
                cell === "R" ? "c4-cell-red" : "",
                cell === "Y" ? "c4-cell-yellow" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={`${r}-${c}`} className={classes}>
                  <div className="c4-disc" />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="c4-actions">
        <button className="primary-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
