import React from "react";

export const GameShell = ({ children }: React.PropsWithChildren) => {
  return (
    <section className="game-shell">
      {children}
    </section>
  );
};
