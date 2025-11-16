import React, { useState } from "react";

type SlideStatus = "playing" | "solved";

const SIZE = 4;
const TILE_COUNT = SIZE * SIZE;
const EMPTY = 0;

type Board = number[]; // length 16, values 0–15

function createSolvedBoard(): Board {
  // 1..15, 0 = empty
  const arr: number[] = [];
  for (let i = 1; i < TILE_COUNT; i++) {
    arr.push(i);
  }
  arr.push(EMPTY);
  return arr;
}

function indexToRC(index: number): { r: number; c: number } {
  return {
    r: Math.floor(index / SIZE),
    c: index % SIZE,
  };
}

function rcToIndex(r: number, c: number): number {
  return r * SIZE + c;
}

function getNeighbors(index: number): number[] {
  const { r, c } = indexToRC(index);
  const neighbors: number[] = [];

  if (r > 0) neighbors.push(rcToIndex(r - 1, c));
  if (r < SIZE - 1) neighbors.push(rcToIndex(r + 1, c));
  if (c > 0) neighbors.push(rcToIndex(r, c - 1));
  if (c < SIZE - 1) neighbors.push(rcToIndex(r, c + 1));

  return neighbors;
}

// Shuffle by performing many random valid moves from the solved board
function createShuffledBoard(moves: number = 200): Board {
  let board = createSolvedBoard();

  let emptyIndex = board.indexOf(EMPTY);

  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(emptyIndex);
    const randNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    const newBoard = [...board];
    newBoard[emptyIndex] = newBoard[randNeighbor];
    newBoard[randNeighbor] = EMPTY;

    board = newBoard;
    emptyIndex = randNeighbor;
  }

  return board;
}

function isSolved(board: Board): boolean {
  for (let i = 0; i < TILE_COUNT - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[TILE_COUNT - 1] === EMPTY;
}

export const SlidingPuzzleGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => createShuffledBoard());
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<SlideStatus>("playing");

  const tryMoveTileAtIndex = (index: number) => {
    if (status !== "playing") return;

    const emptyIndex = board.indexOf(EMPTY);
    const neighbors = getNeighbors(emptyIndex);

    if (!neighbors.includes(index)) return; // must be adjacent to empty

    const newBoard = [...board];
    newBoard[emptyIndex] = newBoard[index];
    newBoard[index] = EMPTY;

    const newMoves = moves + 1;
    const solved = isSolved(newBoard);

    setBoard(newBoard);
    setMoves(newMoves);
    setStatus(solved ? "solved" : "playing");
  };

  const handleTileClick = (index: number) => {
    tryMoveTileAtIndex(index);
  };

const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
  if (
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight"
  ) {
    e.preventDefault();
  }

  if (status !== "playing") return;

  const emptyIndex = board.indexOf(EMPTY);
  const { r, c } = indexToRC(emptyIndex);

  let targetIndex: number | null = null;

  if (e.key === "ArrowUp" && r < SIZE - 1) {
    targetIndex = rcToIndex(r + 1, c);
  } else if (e.key === "ArrowDown" && r > 0) {
    targetIndex = rcToIndex(r - 1, c);
  } else if (e.key === "ArrowLeft" && c < SIZE - 1) {
    targetIndex = rcToIndex(r, c + 1);
  } else if (e.key === "ArrowRight" && c > 0) {
    targetIndex = rcToIndex(r, c - 1);
  }

  if (targetIndex !== null) {
    tryMoveTileAtIndex(targetIndex);
  }
};


  const resetGame = () => {
    setBoard(createShuffledBoard());
    setMoves(0);
    setStatus("playing");
  };

  const statusText =
    status === "solved"
      ? `Solved in ${moves} moves! 🎉`
      : "Slide tiles to put them in order.";

  return (
    <div
      className="slide"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>Sliding Puzzle</h2>
      <p className="slide-subtitle">{statusText}</p>

      <div className="slide-moves">Moves: {moves}</div>

      <div className="slide-grid">
  {board.map((value, index) => {
    const isEmpty = value === EMPTY;
    const isCorrectSpot = !isEmpty && value === index + 1;

    const tileClasses = [
      "slide-tile",
      isEmpty ? "slide-tile-empty" : "slide-tile-filled",
      isCorrectSpot ? "slide-tile-correct" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        key={index}
        className={tileClasses}
        onClick={() => handleTileClick(index)}
        disabled={isEmpty}
      >
        {!isEmpty && value}
      </button>
    );
  })}
</div>


      <div className="slide-actions">
        <button className="primary-button" onClick={resetGame}>
          New Shuffle
        </button>
      </div>
    </div>
  );
};
