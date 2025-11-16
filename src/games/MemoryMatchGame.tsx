import React, { useState } from "react";

type CardSymbol = string;

type Card = {
  id: number;        // unique per card
  symbol: CardSymbol;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryStatus = "playing" | "won";

const SYMBOLS: CardSymbol[] = ["🐱", "🐶", "🐼", "🦊", "🐸", "🐻", "🐧", "🦄"];

function createShuffledDeck(): Card[] {
  const baseCards: Card[] = SYMBOLS.flatMap((symbol, idx) => [
    {
      id: idx * 2,
      symbol,
      isFlipped: false,
      isMatched: false,
    },
    {
      id: idx * 2 + 1,
      symbol,
      isFlipped: false,
      isMatched: false,
    },
  ]);

  // Fisher–Yates shuffle
  for (let i = baseCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baseCards[i], baseCards[j]] = [baseCards[j], baseCards[i]];
  }

  return baseCards;
}

export const MemoryMatchGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(() => createShuffledDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<MemoryStatus>("playing");

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    const card = cards[index];
    if (card.isMatched || card.isFlipped) return;

    // Flip the card
    const newCards = cards.map((c, i) =>
      i === index ? { ...c, isFlipped: true } : c
    );
    const newFlipped = [...flippedIndices, index];

    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [i1, i2] = newFlipped;
      const c1 = newCards[i1];
      const c2 = newCards[i2];

      if (c1.symbol === c2.symbol) {
        // Match
        const matchedCards = newCards.map((c, i) =>
          i === i1 || i === i2 ? { ...c, isMatched: true } : c
        );
        setTimeout(() => {
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsLocked(false);

          // Check win
          const allMatched = matchedCards.every((c) => c.isMatched);
          if (allMatched) setStatus("won");
        }, 400);
      } else {
        // Not a match: flip back after delay
        setTimeout(() => {
          const resetCards = newCards.map((c, i) =>
            i === i1 || i === i2 ? { ...c, isFlipped: false } : c
          );
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 700);
      }
    }
  };

  const resetGame = () => {
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setIsLocked(false);
    setMoves(0);
    setStatus("playing");
  };

  return (
    <div className="memory">
      <h2>Memory Match</h2>
      <p className="memory-subtitle">
        Flip two cards at a time and find all the pairs.
      </p>

      <div className="memory-stats">
        <span>Moves: {moves}</span>
        {status === "won" && <span className="memory-won">You won! 🎉</span>}
      </div>

      <div className="memory-grid">
        {cards.map((card, index) => {
          const isFaceUp = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              className={`memory-card ${
                isFaceUp ? "memory-card--up" : "memory-card--down"
              } ${card.isMatched ? "memory-card--matched" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <span className="memory-card-inner">
                {isFaceUp ? card.symbol : "?"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="memory-actions">
        <button className="primary-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
