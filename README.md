# 🎮 Mobile Webapp Arcade

A lightweight, fast-loading, mobile-optimized **web arcade** featuring multiple mini-games built with **React**, **TypeScript**, and a unified **ArcadeContext** game-loader system.  
Each game is isolated, plug-and-play, and mounted inside a shared `<GameShell />` UI.

This project is designed to be **expandable**, **themeable**, and extremely easy to maintain as new games are added.

---

## 🚀 Features

### 🎲 Included Games
- **Wordle Clone**
- **Word Search**
- **Sudoku**
- **Tic-Tac-Toe**
- **2048**
- **Memory Match**
- **Sliding Puzzle**
- **Trivia Game**
- **Connect Four**
- **Rock–Paper–Scissors–Lizard–Spock**
- **Minesweeper**
- **MadLibs (New!)**

Every game uses the shared loader provided by `ArcadeContext`.

---

## 🧠 Core Architecture

- **React + TypeScript**
- **Global state** managed through `ArcadeContext`
- `<GameShell />` handles:
  - Layout + shell UI  
  - Game switching  
  - Achievements  
  - Stats & score tracking  
- **ProfileDashboard** stores player progress, achievements, and history
- **Achievement Toast System** for instant reward feedback
- **Dynamic game loading** based on `GameId`

---

## 📁 Project Structure
```
src/
├── components/
│ ├── GameShell.tsx
│ ├── ProfileDashboard.tsx
│ ├── AchievementToastContainer.tsx
│ └── (shared UI components)
│
├── games/
│ ├── WordleGame/
│ ├── WordSearchGame/
│ ├── SudokuGame/
│ ├── TicTacToeGame/
│ ├── Game2048/
│ ├── MemoryMatchGame/
│ ├── SlidingPuzzleGame/
│ ├── TriviaGame/
│ ├── ConnectFourGame/
│ ├── RpslsGame/
│ ├── MinesweeperGame/
│ └── MadLibsGame/ ← NEW
│
├── context/
│ └── ArcadeContext.tsx
│
├── App.tsx
├── App.css
└── index.tsx
```

---

## 🧩 Adding a New Game

Follow these steps to add a new game:

### 1. Create the game folder
src/games/MyNewGame/


### 2. Export a React component for the game
export function MyNewGame() {
  return <div>My new game!</div>;
}

### 3. Register the game in ArcadeContext

Add a new GameId and map it to the component.

### 4. Add the game button (if required) to <GameShell />

The loader will automatically render whichever component matches the selected GameId.

## 🛠 Development

Install dependencies

```npm install```

Run the dev server

```npm run dev```

Build for production

```npm run build```

## 📱 Mobile-First Design Principles
The arcade is optimized for:

Touch screens

Mobile browsers

PWAs

Low-load, fast-startup sessions

Design choices include:

Lightweight components

Lazy-loaded games

Minimal dependencies

Responsive grid layout

## 🏆 Achievement System

Games can push achievement events into the shared context, enabling:

Score tracking

Level progression

Achievement toasts

Profile stat updates

Everything is centralized for consistency across all games.

## 🧭 Roadmap

Short-Term Goals

Add more games (Hangman, Blackjack, Slots, Escape Room)

Add global leaderboard

Add sound effects with user toggles

Improve accessibility (keyboard-only mode, contrast themes)

Long-Term Goals

Cloud-saved profiles

Multiplayer support (turn-based or realtime)

PWA offline mode

UI themes / skins / seasonal events

## 🤝 Contributing
Guidelines:

Each game must be fully self-contained

No external global state inside individual games

All state should flow through ArcadeContext

Keep components lightweight and mobile-friendly

PRs & improvements welcome.


## 📜 License

This project is proprietary and part of the Mobile Webapp Games system.
All rights reserved unless otherwise noted.

