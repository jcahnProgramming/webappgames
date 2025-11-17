import React from "react";

import {
  ACHIEVEMENTS,
  SKINS,
  useArcade,
} from "../context/ArcadeContext";

import type { GameId } from "../context/ArcadeContext";

const GAME_LABELS: Record<GameId, string> = {
  wordle: "Wordle Clone",
  wordsearch: "Word Search",
  sudoku: "Sudoku",
  tictactoe: "Tic-Tac-Toe",
  game2048: "2048",
  memory: "Memory Match",
  sliding: "Sliding Puzzle",
  trivia: "Trivia Quiz",
  connect4: "Connect Four",
  rpsls: "RPS Lizard Spock",
  minesweeper: "Minesweeper Lite",
  madlibs: "Mad Libs Story Forge",
  snake: "Snake Classic",
  flappybird: "Flappy Bird Clone",
  idleclicker: "Idle Clicker",
};


export const ProfileDashboard: React.FC = () => {
  const {
    globalStats,
    perGameStats,
    achievements,
    currency,
    skinsUnlocked,
    equippedSkins,
    setEquippedSkin,
  } = useArcade();

  return (
    <div className="profile-dashboard">
      <h2>Your Arcade Profile</h2>

      {/* Global Stats */}
      <section className="profile-section">
        <h3>Global Stats</h3>
        <ul className="profile-stats-list">
          <li>
            <strong>Total Games Played:</strong>{" "}
            {globalStats.totalGamesPlayed}
          </li>
          <li>
            <strong>Longest Session:</strong>{" "}
            {globalStats.longestSession} minutes
          </li>
          <li>
            <strong>Favorite Game:</strong>{" "}
            {GAME_LABELS[globalStats.favoriteGame]}
          </li>
        </ul>
      </section>

      {/* Per-Game Stats */}
      <section className="profile-section">
        <h3>Stats by Game</h3>
        <div className="profile-game-stats-grid">
          {Object.entries(perGameStats).map(([gameId, stats]) => (
            <div key={gameId} className="profile-game-card">
              <h4>{GAME_LABELS[gameId as GameId]}</h4>
              <ul>
                <li>
                  <strong>Played:</strong> {stats.plays}
                </li>
                {stats.bestScore !== undefined && (
                  <li>
                    <strong>Best Score:</strong> {stats.bestScore}
                  </li>
                )}
                {stats.bestTime !== undefined && (
                  <li>
                    <strong>Best Time:</strong> {stats.bestTime}s
                  </li>
                )}
                {stats.wins !== undefined && (
                  <li>
                    <strong>Wins:</strong> {stats.wins}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="profile-section">
        <h3>Achievements</h3>
        <div className="profile-achievement-grid">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={
                achievements.includes(ach.id)
                  ? "achievement-card achievement-card--unlocked"
                  : "achievement-card"
              }
            >
              <h4>{ach.name}</h4>
              <p>{ach.description}</p>
              {ach.rewardCurrency && (
                <p className="achievement-reward">
                  +{ach.rewardCurrency} Coins
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skins */}
      <section className="profile-section">
        <h3>Unlocked Skins</h3>

        <div className="profile-skins-grid">
          {SKINS.map((skin) => {
            const unlocked = skinsUnlocked.includes(skin.id);
            const isEquipped =
              equippedSkins[skin.gameId] === skin.id;

            return (
              <div
                key={skin.id}
                className={
                  unlocked ? "skin-card skin-card--unlocked" : "skin-card"
                }
              >
                <div
                  className="skin-preview"
                  style={{ background: skin.preview }}
                />
                <h4>{skin.name}</h4>
                <p className="skin-game-label">
                  {skin.gameId === "global"
                    ? "Global theme"
                    : GAME_LABELS[skin.gameId]}
                </p>
                <p>
                  {unlocked
                    ? "Unlocked"
                    : `Locked – requires ${skin.requiresAchievement}`}
                </p>

                <button
                  className="skin-equip-button"
                  disabled={!unlocked}
                  onClick={() =>
                    unlocked
                      ? setEquippedSkin(skin.gameId, skin.id)
                      : undefined
                  }
                >
                  {isEquipped
                    ? "Equipped"
                    : unlocked
                    ? "Equip"
                    : "Locked"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Currency */}
      <section className="profile-section">
        <h3>Your Currency</h3>
        <p className="currency-amount">
          💰 <strong>{currency}</strong> coins
        </p>
        <p className="currency-note">
          Earn coins by completing achievements.  
          Future update: Spend them in a cosmetics shop!
        </p>
      </section>
    </div>
  );
};
