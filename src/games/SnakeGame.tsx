import React, { useEffect, useState, useCallback } from "react";
import "./SnakeGame.css";

type Cell = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const TICK_MS = 120;

const randomCell = (): Cell => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const cellsEqual = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Cell[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<Cell>(randomCell);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setFood(randomCell());
    setIsRunning(true);
    setScore(0);
    setGameOver(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver && (e.key === "Enter" || e.key === " ")) {
        reset();
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          setIsRunning((prev) => !prev);
          break;
      }
    },
    [direction, gameOver, reset]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isRunning || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Cell = { ...head };

        switch (direction) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Wrap around edges (or change to "death on wall" if you want)
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;

        // Check self collision
        if (prevSnake.some((segment) => cellsEqual(segment, newHead))) {
          setGameOver(true);
          setIsRunning(false);
          setHighScore((prev) => Math.max(prev, score));
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check food
        if (cellsEqual(newHead, food)) {
          setScore((s) => s + 1);
          let newFood = randomCell();
          // Avoid spawning food on snake
          while (newSnake.some((s) => cellsEqual(s, newFood))) {
            newFood = randomCell();
          }
          setFood(newFood);
        } else {
          newSnake = newSnake.slice(0, -1);
        }

        return newSnake;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [direction, isRunning, gameOver, food, score]);

  const cells: Cell[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="snake-container">
      <div className="snake-header">
        <h2>Snake</h2>
        <div className="snake-stats">
          <span>Score: {score}</span>
          <span>Best: {highScore}</span>
        </div>
        <div className="snake-controls-hint">
          Use arrow keys or WASD • Space to pause
        </div>
      </div>

      <div
        className={`snake-grid ${!isRunning ? "paused" : ""} ${
          gameOver ? "game-over" : ""
        }`}
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {cells.map((cell) => {
          const isSnake = snake.some((s) => cellsEqual(s, cell));
          const isHead = cellsEqual(cell, snake[0]);
          const isFood = cellsEqual(cell, food);
          return (
            <div
              key={`${cell.x}-${cell.y}`}
              className={[
                "snake-cell",
                isSnake ? "snake-body" : "",
                isHead ? "snake-head" : "",
                isFood ? "snake-food" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          );
        })}
      </div>

      <div className="snake-footer">
        {gameOver ? (
          <button className="snake-btn" onClick={reset}>
            Game Over – Play Again
          </button>
        ) : (
          <button
            className="snake-btn"
            onClick={() => setIsRunning((prev) => !prev)}
          >
            {isRunning ? "Pause" : "Resume"}
          </button>
        )}
      </div>
    </div>
  );
};
