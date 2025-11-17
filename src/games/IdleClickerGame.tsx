import React, { useEffect, useState } from "react";
import "./IdleClickerGame.css";

type Upgrade = {
  id: string;
  name: string;
  baseCost: number;
  cps: number; // coins per second
  owned: number;
};

export const IdleClickerGame: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [perClick, setPerClick] = useState(1);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: "cursor", name: "Auto Clicker", baseCost: 25, cps: 0.2, owned: 0 },
    { id: "assistant", name: "Assistant", baseCost: 100, cps: 1, owned: 0 },
    { id: "factory", name: "Mini Factory", baseCost: 500, cps: 5, owned: 0 },
  ]);

  const totalCps = upgrades.reduce(
    (sum, u) => sum + u.cps * u.owned,
    0
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((c) => c + totalCps / 2); // 2 ticks per second
    }, 500);
    return () => clearInterval(interval);
  }, [totalCps]);

  const handleClick = () => {
    setCoins((c) => c + perClick);
  };

  const buyUpgrade = (id: string) => {
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const cost = getUpgradeCost(u);
        if (coins < cost) return u;
        setCoins((c) => c - cost);
        return { ...u, owned: u.owned + 1 };
      })
    );
  };

  const getUpgradeCost = (u: Upgrade) =>
    Math.floor(u.baseCost * Math.pow(1.2, u.owned));

  return (
    <div className="idle-container">
      <h2>Idle Clicker</h2>
      <div className="idle-stats">
        <div>Coins: {coins.toFixed(1)}</div>
        <div>Per Click: {perClick}</div>
        <div>Per Second: {totalCps.toFixed(1)}</div>
      </div>

      <button className="idle-big-button" onClick={handleClick}>
        Tap for Coins
      </button>

      <div className="idle-upgrades">
        <h3>Upgrades</h3>
        {upgrades.map((u) => {
          const cost = getUpgradeCost(u);
          const affordable = coins >= cost;
          return (
            <button
              key={u.id}
              className={`idle-upgrade ${affordable ? "idle-upgrade--ok" : ""}`}
              onClick={() => buyUpgrade(u.id)}
              disabled={!affordable}
            >
              <div className="idle-upgrade-header">
                <span>{u.name}</span>
                <span>Owned: {u.owned}</span>
              </div>
              <div className="idle-upgrade-body">
                <span>+{u.cps} / sec</span>
                <span>Cost: {cost}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
