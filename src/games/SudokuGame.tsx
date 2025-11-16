import React, { useState } from "react";

type Cell = {
  row: number;
  col: number;
  value: number | null;
  fixed: boolean;
};

type SudokuGameState = {
  board: Cell[][];
  solution: number[][];
};

type Status = "playing" | "won";

const PUZZLES: { puzzle: string; solution: string }[] = [
  // 0 = empty
  {
    puzzle:
      "530070000" +
      "600195000" +
      "098000060" +
      "800060003" +
      "400803001" +
      "700020006" +
      "060000280" +
      "000419005" +
      "000080079",
    solution:
      "534678912" +
      "672195348" +
      "198342567" +
      "859761423" +
      "426853791" +
      "713924856" +
      "961537284" +
      "287419635" +
      "345286179",
  },
  {
    puzzle:
      "000260701" +
      "680070090" +
      "190004500" +
      "820100040" +
      "004602900" +
      "050003028" +
      "009300074" +
      "040050036" +
      "703018000",
    solution:
      "435269781" +
      "682571493" +
      "197834562" +
      "826195347" +
      "374682915" +
      "951743628" +
      "519326874" +
      "248957136" +
      "763418259",
  },
];

function parseBoard(puzzle: string, solution: string): SudokuGameState {
  const board: Cell[][] = [];
  const solutionGrid: number[][] = [];

  for (let r = 0; r < 9; r++) {
    const row: Cell[] = [];
    const solRow: number[] = [];

    for (let c = 0; c < 9; c++) {
      const pIndex = r * 9 + c;
      const pChar = puzzle[pIndex];
      const sChar = solution[pIndex];
      const value = pChar === "0" ? null : Number(pChar);
      const solValue = Number(sChar);

      row.push({
        row: r,
        col: c,
        value,
        fixed: value !== null,
      });

      solRow.push(solValue);
    }

    board.push(row);
    solutionGrid.push(solRow);
  }

  return { board, solution: solutionGrid };
}

function createRandomSudoku(): SudokuGameState {
  const random = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  return parseBoard(random.puzzle, random.solution);
}

export const SudokuGame: React.FC = () => {
  const [game, setGame] = useState<SudokuGameState>(() => createRandomSudoku());
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(
    null
  );
  const [status, setStatus] = useState<Status>("playing");

  const { board, solution } = game;

  const selectCell = (cell: Cell) => {
    if (cell.fixed) return;
    setSelected({ row: cell.row, col: cell.col });
  };

  const handleNumberInput = (num: number | null) => {
    if (!selected || status !== "playing") return;

    setGame((prev) => {
      const newBoard = prev.board.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      const cell = newBoard[selected.row][selected.col];
      if (cell.fixed) return prev;

      cell.value = num;

      const newState: SudokuGameState = {
        board: newBoard,
        solution: prev.solution,
      };

      if (checkWin(newState)) {
        setStatus("won");
      }

      return newState;
    });
  };

  const checkWin = (state: SudokuGameState): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cellVal = state.board[r][c].value;
        if (cellVal === null || cellVal !== state.solution[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const isErrorCell = (cell: Cell): boolean => {
    if (cell.value === null) return false;
    return cell.value !== solution[cell.row][cell.col];
  };

  const newPuzzle = () => {
    setGame(createRandomSudoku());
    setSelected(null);
    setStatus("playing");
  };

  return (
    <div className="sudoku">
      <h2>Sudoku</h2>
      <p className="sudoku-subtitle">
        Tap a cell, then choose a number. Fill the grid to solve the puzzle.
      </p>

      <div className="sudoku-grid">
        {board.map((row) =>
          row.map((cell) => {
            const isSelected =
              selected?.row === cell.row && selected?.col === cell.col;

            const classes = [
              "sudoku-cell",
              cell.fixed ? "sudoku-cell--fixed" : "",
              isSelected ? "sudoku-cell--selected" : "",
              isErrorCell(cell) ? "sudoku-cell--error" : "",
              (cell.col + 1) % 3 === 0 && cell.col !== 8
                ? "sudoku-cell--vborder"
                : "",
              (cell.row + 1) % 3 === 0 && cell.row !== 8
                ? "sudoku-cell--hborder"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={`${cell.row}-${cell.col}`}
                className={classes}
                onClick={() => selectCell(cell)}
              >
                {cell.value ?? ""}
              </button>
            );
          })
        )}
      </div>

      <div className="sudoku-numpad">
        {Array.from({ length: 9 }).map((_, i) => {
          const num = i + 1;
          return (
            <button
              key={num}
              className="sudoku-num-btn"
              onClick={() => handleNumberInput(num)}
            >
              {num}
            </button>
          );
        })}
        <button
          className="sudoku-num-btn sudoku-num-btn--clear"
          onClick={() => handleNumberInput(null)}
        >
          Clear
        </button>
      </div>

      <div className="sudoku-actions">
        <button className="primary-button" onClick={newPuzzle}>
          New Puzzle
        </button>
      </div>

      {status === "won" && (
        <div className="sudoku-message">🎉 Nice! You solved it!</div>
      )}
    </div>
  );
};
