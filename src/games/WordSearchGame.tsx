import React, { useState } from "react";

type Cell = {
  letter: string;
  x: number;
  y: number;
};

type WordPlacement = {
  word: string;
  positions: { x: number; y: number }[];
};

type Puzzle = {
  grid: Cell[][];
  placements: WordPlacement[];
};

const WORDS = ["CAT", "DOG", "BIRD", "MOON", "STAR"];
const GRID_SIZE = 12;

// Pure helper: builds a fresh puzzle (no React state here)
function createPuzzle(): Puzzle {
  const newGrid: Cell[][] = Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      letter: "",
      x,
      y,
    }))
  );

  const newPlacements: WordPlacement[] = [];

  // Directions: right, down, diagonal down-right
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
  ];

  for (const word of WORDS) {
    let placed = false;

    while (!placed) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * GRID_SIZE);
      const startY = Math.floor(Math.random() * GRID_SIZE);

      let fits = true;
      const positions: { x: number; y: number }[] = [];

      for (let i = 0; i < word.length; i++) {
        const x = startX + dir.dx * i;
        const y = startY + dir.dy * i;

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
          fits = false;
          break;
        }

        positions.push({ x, y });
      }

      if (fits) {
        positions.forEach((pos, i) => {
          newGrid[pos.y][pos.x].letter = word[i];
        });

        newPlacements.push({ word, positions });
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (newGrid[y][x].letter === "") {
        newGrid[y][x].letter = String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        );
      }
    }
  }

  return { grid: newGrid, placements: newPlacements };
}

export const WordSearchGame: React.FC = () => {
  // Lazy init: createPuzzle() runs once on first render
  const [puzzle, setPuzzle] = useState<Puzzle>(() => createPuzzle());
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [dragCells, setDragCells] = useState<{ x: number; y: number }[]>([]);

  const { grid, placements } = puzzle;

  const generatePuzzle = () => {
    setPuzzle(createPuzzle());
    setFoundWords([]);
    setDragCells([]);
  };

  const handleCellDown = (x: number, y: number) => {
    setDragCells([{ x, y }]);
  };

  const handleCellEnter = (x: number, y: number) => {
    setDragCells((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.x === x && last.y === y) return prev;
      return [...prev, { x, y }];
    });
  };

  const handleCellUp = () => {
    if (dragCells.length > 1) {
      checkWord(dragCells);
    }
    setDragCells([]);
  };

  const checkWord = (cells: { x: number; y: number }[]) => {
    for (const p of placements) {
      if (arraysEqual(p.positions, cells)) {
        if (!foundWords.includes(p.word)) {
          setFoundWords((prev) => [...prev, p.word]);
        }
        return;
      }
    }
  };

  const arraysEqual = (
    a: { x: number; y: number }[],
    b: { x: number; y: number }[]
  ) => {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v.x === b[i].x && v.y === b[i].y);
  };

  return (
    <div className="word-search">
      <h2>Word Search</h2>
      <p>Click and drag (or touch and drag) to select words.</p>

      <div
        className="ws-grid"
        onMouseLeave={() => setDragCells([])}
        onMouseUp={handleCellUp}
        onTouchEnd={handleCellUp}
      >
        {grid.map((row) =>
          row.map((cell) => {
            const isDragging = dragCells.some(
              (c) => c.x === cell.x && c.y === cell.y
            );

            const isFound = placements
              .filter((p) => foundWords.includes(p.word))
              .some((p) =>
                p.positions.some(
                  (pos) => pos.x === cell.x && pos.y === cell.y
                )
              );

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`ws-cell ${isDragging ? "ws-drag" : ""} ${
                  isFound ? "ws-found" : ""
                }`}
                onMouseDown={() => handleCellDown(cell.x, cell.y)}
                onMouseEnter={(e) => {
                  if (e.buttons === 1) handleCellEnter(cell.x, cell.y);
                }}
                onTouchStart={() => handleCellDown(cell.x, cell.y)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const elem = document.elementFromPoint(
                    touch.clientX,
                    touch.clientY
                  ) as HTMLElement | null;

                  if (elem?.dataset?.x && elem?.dataset?.y) {
                    handleCellEnter(
                      Number(elem.dataset.x),
                      Number(elem.dataset.y)
                    );
                  }
                }}
                data-x={cell.x}
                data-y={cell.y}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>

      <div className="ws-words">
        {WORDS.map((w) => (
          <div
            key={w}
            className={`ws-word ${
              foundWords.includes(w) ? "ws-word-found" : ""
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      <button className="primary-button" onClick={generatePuzzle}>
        New Puzzle
      </button>
    </div>
  );
};
