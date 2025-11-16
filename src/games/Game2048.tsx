import React, { useState } from "react";

type Direction = "up" | "down" | "left" | "right";
type Board = number[][];
type Status2048 = "playing" | "won" | "over";

const SIZE = 4;

function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => 0)
  );
}

function getEmptyCells(board: Board): { r: number; c: number }[] {
  const empties: { r: number; c: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) empties.push({ r, c });
    }
  }
  return empties;
}

function addRandomTile(board: Board): Board {
  const empties = getEmptyCells(board);
  if (empties.length === 0) return board;

  const idx = Math.floor(Math.random() * empties.length);
  const { r, c } = empties[idx];

  const value = Math.random() < 0.9 ? 2 : 4;

  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = value;
  return newBoard;
}

function createInitialBoard(): Board {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function slideAndCombine(row: number[]): { row: number[]; gained: number } {
  const nonZero = row.filter((v) => v !== 0);
  const result: number[] = [];
  let gained = 0;

  let i = 0;
  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const merged = nonZero[i] * 2;
      result.push(merged);
      gained += merged;
      i += 2;
    } else {
      result.push(nonZero[i]);
      i += 1;
    }
  }

  while (result.length < SIZE) {
    result.push(0);
  }

  return { row: result, gained };
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function transpose(board: Board): Board {
  const result: Board = createEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      result[c][r] = board[r][c];
    }
  }
  return result;
}

function reverseRows(board: Board): Board {
  return board.map((row) => [...row].reverse());
}

function moveBoard(board: Board, dir: Direction): { board: Board; gained: number } {
  let working = board.map((row) => [...row]);
  let totalGained = 0;

  if (dir === "up" || dir === "down") {
    working = transpose(working);
  }

  if (dir === "right" || dir === "down") {
    working = reverseRows(working);
  }

  working = working.map((row) => {
    const { row: newRow, gained } = slideAndCombine(row);
    totalGained += gained;
    return newRow;
  });

  if (dir === "right" || dir === "down") {
    working = reverseRows(working);
  }

  if (dir === "up" || dir === "down") {
    working = transpose(working);
  }

  return { board: working, gained: totalGained };
}

function hasMoves(board: Board): boolean {
  if (getEmptyCells(board).length > 0) return true;

  // Check horizontal neighbors
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 1; c++) {
      if (board[r][c] === board[r][c + 1]) return true;
    }
  }
  // Check vertical neighbors
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 1; r++) {
      if (board[r][c] === board[r + 1][c]) return true;
    }
  }

  return false;
}

export const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [status, setStatus] = useState<Status2048>("playing");

  const handleMove = (dir: Direction) => {
    if (status !== "playing") return;

    const { board: moved, gained } = moveBoard(board, dir);
    if (boardsEqual(board, moved)) {
      return; // no change, ignore
    }

    let withTile = addRandomTile(moved);
    let newStatus: Status2048 = status;

    // Check for 2048 tile (optional "won" state)
    if (
      withTile.some((row) =>
        row.some((v) => v === 2048)
      )
    ) {
      newStatus = "won";
    } else if (!hasMoves(withTile)) {
      newStatus = "over";
    }

    setBoard(withTile);
    setScore((s) => s + gained);
    setStatus(newStatus);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setScore(0);
    setStatus("playing");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowUp") handleMove("up");
    if (e.key === "ArrowDown") handleMove("down");
    if (e.key === "ArrowLeft") handleMove("left");
    if (e.key === "ArrowRight") handleMove("right");
  };

  const statusText =
    status === "playing"
      ? "Use arrows or buttons to slide tiles."
      : status === "won"
      ? "You made 2048! 🎉 (Keep playing if you like.)"
      : "No more moves. Game over.";

  return (
    <div
      className="g2048"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>2048</h2>
      <p className="g2048-subtitle">{statusText}</p>

      <div className="g2048-score">Score: {score}</div>

      <div className="g2048-board">
        {board.map((row, r) =>
          row.map((value, c) => {
            const tileClasses = [
              "g2048-cell",
              value ? `g2048-cell-${value}` : "g2048-cell-empty",
            ].join(" ");

            return (
              <div key={`${r}-${c}`} className={tileClasses}>
                {value !== 0 ? value : ""}
              </div>
            );
          })
        )}
      </div>

      <div className="g2048-controls">
        <button onClick={() => handleMove("up")}>↑</button>
        <div className="g2048-controls-middle">
          <button onClick={() => handleMove("left")}>←</button>
          <button onClick={() => handleMove("down")}>↓</button>
          <button onClick={() => handleMove("right")}>→</button>
        </div>
      </div>

      <div className="g2048-actions">
        <button className="primary-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
