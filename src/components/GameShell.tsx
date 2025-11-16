import React from "react";
import type { ReactNode } from "react";
import { SKINS, useArcade } from "../context/ArcadeContext";
import type { GameId } from "../context/ArcadeContext";

type GameShellProps = {
  controls: string[];
  children: ReactNode;
  gameId: GameId;
  gameTitle: string;
};

export const GameShell: React.FC<GameShellProps> = ({
  controls,
  children,
  gameId,
  gameTitle,
}) => {
  const { skinsUnlocked, equippedSkins } = useArcade();

  const skinsForGame = SKINS.filter(
    (skin) => skin.gameId === gameId || skin.gameId === "global"
  );

  const equippedId =
    equippedSkins[gameId] ?? equippedSkins.global ?? null;

  const activeSkin =
    skinsForGame.find((s) => s.id === equippedId) ??
    skinsForGame[0] ??
    null;

  const shellStyle = activeSkin
    ? { background: activeSkin.preview }
    : undefined;

  return (
    <div className="game-shell" style={shellStyle}>
      <div className="game-shell-header">
        <div>
          <h2 className="game-shell-title">{gameTitle}</h2>
          {activeSkin && (
            <p className="game-shell-skin-label">
              Theme: <span>{activeSkin.name}</span>
            </p>
          )}
        </div>
        {skinsForGame.length > 0 && (
          <div className="game-shell-skin-tags">
            {skinsForGame.map((skin) => {
              const unlocked = skinsUnlocked.includes(skin.id);
              const isActive = activeSkin?.id === skin.id;

              return (
                <span
                  key={skin.id}
                  className={[
                    "game-shell-skin-tag",
                    unlocked ? "game-shell-skin-tag--unlocked" : "",
                    isActive ? "game-shell-skin-tag--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {skin.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="game-shell-body">{children}</div>

      {controls.length > 0 && (
        <div className="game-shell-controls">
          <h3>How to play</h3>
          <ul>
            {controls.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
