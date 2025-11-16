import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ArcadeProvider } from "./context/ArcadeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ArcadeProvider>
      <App />
    </ArcadeProvider>
  </React.StrictMode>
);
