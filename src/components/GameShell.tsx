import React from "react";

type GameShellProps = {
  children: React.ReactNode;
  controls?: string[];
};

export const GameShell: React.FC<GameShellProps> = ({ children, controls }) => {
  return (
    <div className="game-shell">
      <div className="game-shell-main">{children}</div>

      {controls && controls.length > 0 && (
        <aside className="game-shell-controls">
          <h3>Controls</h3>
          <ul>
            {controls.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
};
