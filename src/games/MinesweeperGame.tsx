import React, { useState } from "react";

const ROWS = 8;
const COLS = 8;
const MINES = 10;

type Status = "playing" | "won" | "lost";

type Cell = {
  row: number;
  col: number;
  hasMine: boolean;
  adjacent: number;
  isRevealed: boolean;
  isFlagged: boolean;
};

type Board = Cell[][];

function createEmptyBoard(): Board {
  const board: Board = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        row: r,
        col: c,
        hasMine: false,
        adjacent: 0,
        isRevealed: false,
        isFlagged: false,
      });
    }
    board.push(row);
  }
  return board;
}

function getNeighbors(row: number, col: number): { row: number; col: number }[] {
  const neighbors: { row: number; col: number }[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }
  return neighbors;
}

function placeMines(board: Board, mineCount: number): Board {
  const copy = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  while (placed < mineCount) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!copy[r][c].hasMine) {
      copy[r][c].hasMine = true;
      placed++;
    }
  }

  // compute adjacent counts
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (copy[r][c].hasMine) {
        copy[r][c].adjacent = 0;
        continue;
      }
      const neighbors = getNeighbors(r, c);
      let count = 0;
      for (const n of neighbors) {
        if (copy[n.row][n.col].hasMine) count++;
      }
      copy[r][c].adjacent = count;
    }
  }

  return copy;
}

function createInitialBoard(): Board {
  const empty = createEmptyBoard();
  return placeMines(empty, MINES);
}

function floodReveal(board: Board, row: number, col: number): Board {
  const copy = board.map((r) => r.map((cell) => ({ ...cell })));
  const stack: { row: number; col: number }[] = [{ row, col }];

  while (stack.length > 0) {
    const { row: r, col: c } = stack.pop()!;
    const cell = copy[r][c];

    if (cell.isRevealed || cell.isFlagged) continue;

    cell.isRevealed = true;

    if (cell.adjacent === 0 && !cell.hasMine) {
      const neighbors = getNeighbors(r, c);
      for (const n of neighbors) {
        const nCell = copy[n.row][n.col];
        if (!nCell.isRevealed && !nCell.hasMine) {
          stack.push({ row: n.row, col: n.col });
        }
      }
    }
  }

  return copy;
}

function checkWin(board: Board): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.hasMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

export const MinesweeperGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [status, setStatus] = useState<Status>("playing");
  const [flagMode, setFlagMode] = useState(false);

  const handleCellClick = (cell: Cell) => {
    if (status !== "playing") return;

    if (flagMode) {
      // toggle flag
      if (cell.isRevealed) return;

      setBoard((prev) =>
        prev.map((row) =>
          row.map((c) =>
            c.row === cell.row && c.col === cell.col
              ? { ...c, isFlagged: !c.isFlagged }
              : c
          )
        )
      );
      return;
    }

    if (cell.isFlagged || cell.isRevealed) return;

    if (cell.hasMine) {
      // reveal all mines
      const exploded = board.map((row) =>
        row.map((c) =>
          c.hasMine ? { ...c, isRevealed: true } : c
        )
      );
      setBoard(exploded);
      setStatus("lost");
      return;
    }

    const newBoard = floodReveal(board, cell.row, cell.col);
    const won = checkWin(newBoard);
    setBoard(newBoard);
    if (won) {
      setStatus("won");
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setStatus("playing");
    setFlagMode(false);
  };

  const minesLeft = (() => {
    const flagged = board.reduce(
      (count, row) => count + row.filter((c) => c.isFlagged).length,
      0
    );
    return Math.max(MINES - flagged, 0);
  })();

  const statusText =
    status === "playing"
      ? "Tap to reveal. Toggle flag mode to mark mines."
      : status === "won"
      ? "You cleared the field! 🎉"
      : "Boom! You hit a mine. 💥";

  return (
    <div className="mine">
      <h2>Minesweeper Lite</h2>
      <p className="mine-subtitle">{statusText}</p>

      <div className="mine-info">
        <span>Mines: {MINES}</span>
        <span>Flags left: {minesLeft}</span>
      </div>

      <div className="mine-controls">
        <button
          className={`mine-flag-toggle ${
            flagMode ? "mine-flag-toggle--active" : ""
          }`}
          onClick={() => setFlagMode((v) => !v)}
        >
          {flagMode ? "Flag Mode: ON 🚩" : "Flag Mode: OFF"}
        </button>
      </div>

      <div className="mine-grid">
        {board.map((row) =>
          row.map((cell) => {
            const key = `${cell.row}-${cell.col}`;
            const isHidden = !cell.isRevealed && status === "playing";

            let content: React.ReactNode = "";
            let cls = "mine-cell";

            if (cell.isRevealed) {
              if (cell.hasMine) {
                content = "💣";
                cls += " mine-cell-mine";
              } else if (cell.adjacent > 0) {
                content = cell.adjacent;
                cls += " mine-cell-open";
              } else {
                cls += " mine-cell-open";
              }
            } else if (cell.isFlagged) {
              content = "🚩";
              cls += " mine-cell-flagged";
            } else {
              cls += " mine-cell-hidden";
            }

            return (
              <button
                key={key}
                className={cls}
                onClick={() => handleCellClick(cell)}
                disabled={!isHidden && !cell.isFlagged}
              >
                {content}
              </button>
            );
          })
        )}
      </div>

      <div className="mine-actions">
        <button className="primary-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
