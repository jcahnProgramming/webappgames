import React, { useEffect, useState, useCallback } from "react";
import "./FlappyBirdGame.css";

type Pipe = {
  x: number;
  gapTop: number;
};

const GRAVITY = 0.45;
const FLAP_STRENGTH = -7;
const PIPE_SPEED = 2.1;
const PIPE_INTERVAL_MS = 1700;
const GAP_HEIGHT = 140;

export const FlappyBirdGame: React.FC = () => {
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const reset = useCallback(() => {
    setBirdY(200);
    setVelocity(0);
    setPipes([]);
    setRunning(true);
    setGameOver(false);
    setScore(0);
  }, []);

  const flap = useCallback(() => {
    if (!running && !gameOver) {
      setRunning(true);
    }
    if (gameOver) {
      reset();
      return;
    }
    setVelocity(FLAP_STRENGTH);
  }, [running, gameOver, reset]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    },
    [flap]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Pipes spawner
  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setPipes((prev) => {
        const gapTop =
          80 + Math.random() * (320 - GAP_HEIGHT - 80); // keep it on screen
        return [...prev, { x: 400, gapTop }];
      });
    }, PIPE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [running, gameOver]);

  // Game loop
  useEffect(() => {
    if (!running || gameOver) return;

    let animationFrame: number;

    const loop = () => {
      setBirdY((prev) => prev + velocity);
      setVelocity((v) => v + GRAVITY);

      setPipes((prev) => {
        let updated = prev.map((p) => ({ ...p, x: p.x - PIPE_SPEED }));
        updated = updated.filter((p) => p.x > -80);

        // scoring: when pipe crosses bird
        updated.forEach((p) => {
          if (p.x < 70 && p.x > 70 - PIPE_SPEED * 1.5) {
            setScore((s) => s + 1);
          }
        });

        return updated;
      });

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [running, gameOver, velocity]);

  // Collision detection + floor/ceiling
  useEffect(() => {
    if (!running || gameOver) return;

    const birdTop = birdY - 10;
    const birdBottom = birdY + 10;
    const birdX = 70;
    const birdWidth = 24;

    // Out of bounds
    if (birdBottom >= 390 || birdTop <= 10) {
      setGameOver(true);
      setRunning(false);
      setBest((b) => Math.max(b, score));
      return;
    }

    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + 60;

      const inXRange =
        birdX + birdWidth > pipeLeft && birdX < pipeRight;

      const topPipeBottom = pipe.gapTop;
      const bottomPipeTop = pipe.gapTop + GAP_HEIGHT;

      const hitTop = birdTop < topPipeBottom;
      const hitBottom = birdBottom > bottomPipeTop;

      if (inXRange && (hitTop || hitBottom)) {
        setGameOver(true);
        setRunning(false);
        setBest((b) => Math.max(b, score));
        break;
      }
    }
  }, [birdY, pipes, running, gameOver, score]);

  return (
    <div className="flappy-container">
      <div className="flappy-header">
        <h2>Flappy Bird</h2>
        <div className="flappy-stats">
          <span>Score: {score}</span>
          <span>Best: {best}</span>
        </div>
        <div className="flappy-hint">
          Press Space / ↑ or Tap the button to flap
        </div>
      </div>

      <div className="flappy-world">
        <div className="flappy-sky" />
        <div className="flappy-ground" />

        {/* bird */}
        <div
          className="flappy-bird"
          style={{ transform: `translate(70px, ${birdY}px)` }}
        />

        {/* pipes */}
        {pipes.map((pipe, idx) => (
          <React.Fragment key={idx}>
            <div
              className="flappy-pipe flappy-pipe-top"
              style={{
                transform: `translateX(${pipe.x}px)`,
                height: pipe.gapTop,
              }}
            />
            <div
              className="flappy-pipe flappy-pipe-bottom"
              style={{
                transform: `translateX(${pipe.x}px)`,
                top: pipe.gapTop + GAP_HEIGHT,
                height: 400 - (pipe.gapTop + GAP_HEIGHT),
              }}
            />
          </React.Fragment>
        ))}
      </div>

      <button className="flappy-btn" onClick={flap}>
        {gameOver ? "Game Over – Tap to Restart" : "Flap"}
      </button>
    </div>
  );
};
