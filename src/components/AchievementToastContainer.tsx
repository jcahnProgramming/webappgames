import React from "react";
import { useArcade } from "../context/ArcadeContext";

const AchievementToastContainer: React.FC = () => {
  const { achievementToasts } = useArcade();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        zIndex: 9999,
      }}
    >
      {achievementToasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background:
              "linear-gradient(90deg, rgba(34,197,94,0.9), rgba(14,165,233,0.9))",
            color: "#020617",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            animation: "toastSlideIn 0.3s ease-out",
            minWidth: "240px",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>🏆</span>
          <div>
            <strong style={{ display: "block", fontSize: "0.95rem" }}>
              Achievement Unlocked!
            </strong>
            <span style={{ fontSize: "0.85rem" }}>{toast.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementToastContainer;
