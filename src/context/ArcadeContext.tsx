/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import type { ReactNode } from "react";

export type GameId =
  | "wordle"
  | "wordsearch"
  | "sudoku"
  | "tictactoe"
  | "game2048"
  | "memory"
  | "sliding"
  | "trivia"
  | "connect4"
  | "rpsls"
  | "minesweeper";

export type GlobalStats = {
  totalGamesPlayed: number;
  longestSession: number; // minutes
  favoriteGame: GameId;
};

export type PerGameStats = {
  plays: number;
  wins?: number;
  bestScore?: number;
  bestTime?: number; // seconds
};

export type ArcadeAchievement = {
  id: string;
  name: string;
  description: string;
  rewardCurrency?: number;
  gameId?: GameId | "global";
};

export type Skin = {
  id: string;
  name: string;
  gameId: GameId | "global";
  preview: string; // CSS background
  requiresAchievement?: string;
};

export const ACHIEVEMENTS: ArcadeAchievement[] = [
  {
    id: "first_play",
    name: "First Token Drop",
    description: "Play your first game in the arcade.",
    rewardCurrency: 10,
    gameId: "global",
  },
  {
    id: "ten_games",
    name: "Warming Up",
    description: "Play 10 games across the arcade.",
    rewardCurrency: 25,
    gameId: "global",
  },
  {
    id: "wordle_first_win",
    name: "Word Wrangler",
    description: "Win a Wordle game.",
    rewardCurrency: 20,
    gameId: "wordle",
  },
  {
    id: "minesweeper_first_win",
    name: "Bomb Squad",
    description: "Win a game of Minesweeper.",
    rewardCurrency: 25,
    gameId: "minesweeper",
  },
  {
    id: "trivia_perfect",
    name: "Know-It-All",
    description: "Get a perfect score in Trivia.",
    rewardCurrency: 40,
    gameId: "trivia",
  },
  {
    id: "2048_1024",
    name: "Almost There",
    description: "Reach the 1024 tile in 2048.",
    rewardCurrency: 30,
    gameId: "game2048",
  },
];

export const SKINS: Skin[] = [
  {
    id: "wordle_classic",
    name: "Classic",
    gameId: "wordle",
    preview: "linear-gradient(135deg, #111827, #020617)",
  },
  {
    id: "wordle_neon",
    name: "Neon Grid",
    gameId: "wordle",
    preview: "linear-gradient(135deg, #22c55e, #0ea5e9)",
    requiresAchievement: "wordle_first_win",
  },
  {
    id: "game2048_classic",
    name: "Classic",
    gameId: "game2048",
    preview: "linear-gradient(135deg, #fbbf24, #f97316)",
  },
  {
    id: "game2048_sunset",
    name: "Sunset Tiles",
    gameId: "game2048",
    preview: "linear-gradient(135deg, #fb7185, #f97316)",
    requiresAchievement: "2048_1024",
  },
];

type ArcadeState = {
  globalStats: GlobalStats;
  perGameStats: Record<GameId, PerGameStats>;
  currency: number;
  achievements: string[]; // ids
  skinsUnlocked: string[]; // skin ids
};

type RecordGameWinOptions = {
  score?: number;
  timeSeconds?: number;
};

type ArcadeContextValue = ArcadeState & {
  recordGamePlayed: (gameId: GameId) => void;
  recordWin: (gameId: GameId, options?: RecordGameWinOptions) => void;
  unlockAchievement: (achievementId: string) => void;
};

const STORAGE_KEY = "webarcade-arcade-state-v1";

const defaultPerGameStats: PerGameStats = {
  plays: 0,
};

function createInitialPerGameStats(): Record<GameId, PerGameStats> {
  const ids: GameId[] = [
    "wordle",
    "wordsearch",
    "sudoku",
    "tictactoe",
    "game2048",
    "memory",
    "sliding",
    "trivia",
    "connect4",
    "rpsls",
    "minesweeper",
  ];

  const result: Partial<Record<GameId, PerGameStats>> = {};
  ids.forEach((id) => {
    result[id] = { ...defaultPerGameStats };
  });

  return result as Record<GameId, PerGameStats>;
}

const initialState: ArcadeState = {
  globalStats: {
    totalGamesPlayed: 0,
    longestSession: 0,
    favoriteGame: "wordle",
  },
  perGameStats: createInitialPerGameStats(),
  currency: 0,
  achievements: [],
  skinsUnlocked: ["wordle_classic", "game2048_classic"],
};

const ArcadeContext = createContext<ArcadeContextValue | undefined>(undefined);

/**
 * Pure helper that takes a state object and returns a new state with
 * the given achievement (and any skin rewards) unlocked.
 */
function unlockAchievementInternal(
  current: ArcadeState,
  achievementId: string
): ArcadeState {
  if (current.achievements.includes(achievementId)) {
    return current;
  }

  const def = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!def) return current;

  const achievements = [...current.achievements, achievementId];

  let currency = current.currency;
  if (def.rewardCurrency) {
    currency += def.rewardCurrency;
  }

  const skinsUnlocked = [...current.skinsUnlocked];
  SKINS.forEach((skin) => {
    if (
      skin.requiresAchievement === achievementId &&
      !skinsUnlocked.includes(skin.id)
    ) {
      skinsUnlocked.push(skin.id);
    }
  });

  return {
    ...current,
    achievements,
    currency,
    skinsUnlocked,
  };
}

export const ArcadeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Session timing – initialized in an effect (no impure calls in render)
  const sessionStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStartRef.current === null) {
      sessionStartRef.current = Date.now();
    }
  }, []);

  const [state, setState] = useState<ArcadeState>(() => {
    if (typeof window === "undefined") return initialState;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;
      const parsed = JSON.parse(raw) as ArcadeState;

      return {
        ...initialState,
        ...parsed,
        perGameStats: {
          ...createInitialPerGameStats(),
          ...parsed.perGameStats,
        },
      };
    } catch {
      return initialState;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateLongestSession = (current: ArcadeState): ArcadeState => {
    const now = Date.now();
    const start = sessionStartRef.current ?? now;
    const minutes = Math.floor((now - start) / (1000 * 60)) || 0;

    if (minutes <= current.globalStats.longestSession) {
      return current;
    }

    return {
      ...current,
      globalStats: {
        ...current.globalStats,
        longestSession: minutes,
      },
    };
  };

  const recordGamePlayed = (gameId: GameId) => {
  setState((prev) => {
    const perGame = prev.perGameStats[gameId] ?? defaultPerGameStats;

    const totalGamesPlayed = prev.globalStats.totalGamesPlayed + 1;

    // Recompute favorite game by plays in a type-safe way
    const entries = Object.entries(
      prev.perGameStats
    ) as [GameId, PerGameStats][];

    let favoriteId: GameId = prev.globalStats.favoriteGame;
    let maxPlays = prev.perGameStats[favoriteId]?.plays ?? 0;

    for (const [id, stats] of entries) {
      const plays = stats.plays ?? 0;
      if (plays > maxPlays) {
        maxPlays = plays;
        favoriteId = id;
      }
    }

    let next: ArcadeState = {
      ...prev,
      globalStats: {
        totalGamesPlayed,
        longestSession: prev.globalStats.longestSession,
        favoriteGame: favoriteId,
      },
      perGameStats: {
        ...prev.perGameStats,
        [gameId]: {
          ...perGame,
          plays: (perGame.plays ?? 0) + 1,
        },
      },
    };

    // Auto-unlock base achievements
    if (totalGamesPlayed === 1) {
      next = unlockAchievementInternal(next, "first_play");
    }
    if (totalGamesPlayed === 10) {
      next = unlockAchievementInternal(next, "ten_games");
    }

    return updateLongestSession(next);
  });
};


  const recordWin = (gameId: GameId, options?: RecordGameWinOptions) => {
    setState((prev) => {
      const perGame = prev.perGameStats[gameId] ?? defaultPerGameStats;

      const bestScore =
        options?.score !== undefined
          ? perGame.bestScore === undefined
            ? options.score
            : Math.max(perGame.bestScore, options.score)
          : perGame.bestScore;

      const bestTime =
        options?.timeSeconds !== undefined
          ? perGame.bestTime === undefined
            ? options.timeSeconds
            : Math.min(perGame.bestTime, options.timeSeconds)
          : perGame.bestTime;

      const perGameStats: Record<GameId, PerGameStats> = {
        ...prev.perGameStats,
        [gameId]: {
          ...perGame,
          wins: (perGame.wins ?? 0) + 1,
          bestScore,
          bestTime,
        },
      };

      let next: ArcadeState = { ...prev, perGameStats };

      // Auto-unlock some specific win achievements
      if (gameId === "wordle") {
        next = unlockAchievementInternal(next, "wordle_first_win");
      }
      if (gameId === "minesweeper") {
        next = unlockAchievementInternal(next, "minesweeper_first_win");
      }

      return updateLongestSession(next);
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setState((prev) => unlockAchievementInternal(prev, achievementId));
  };

  const value: ArcadeContextValue = {
    ...state,
    recordGamePlayed,
    recordWin,
    unlockAchievement,
  };

  return (
    <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>
  );
};

export const useArcade = (): ArcadeContextValue => {
  const ctx = useContext(ArcadeContext);
  if (!ctx) {
    throw new Error("useArcade must be used within ArcadeProvider");
  }
  return ctx;
};
