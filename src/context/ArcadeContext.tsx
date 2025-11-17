/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
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
  | "minesweeper"
  | "madlibs"
  | "snake"
  | "flappybird"
  | "idleclicker";

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
  {
    id: "madlibs_first_story",
    name: "Story Spinner",
    description: "Complete your first Mad Libs story.",
    rewardCurrency: 15,
    gameId: "madlibs",
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
  {
    id: "madlibs_neon_quill",
    name: "Neon Quill",
    gameId: "madlibs",
    preview: "linear-gradient(135deg, #a855f7, #22c55e)",
    requiresAchievement: "madlibs_first_story",
  },
];

type EquippedSkins = Record<GameId | "global", string | null>;

type ArcadeState = {
  globalStats: GlobalStats;
  perGameStats: Record<GameId, PerGameStats>;
  currency: number;
  achievements: string[]; // ids
  skinsUnlocked: string[]; // skin ids
  equippedSkins: EquippedSkins;
};

type AchievementToast = {
  id: string;
  label: string;
};

type RecordGameWinOptions = {
  score?: number;
  timeSeconds?: number;
};

type RecordGameResultOptions = {
  gameId: GameId;
  win?: boolean;
  score?: number;
  durationMs?: number;
};

export type ArcadeContextValue = ArcadeState & {
  recordGamePlayed: (gameId: GameId) => void;
  recordWin: (gameId: GameId, options?: RecordGameWinOptions) => void;
  recordGameResult: (options: RecordGameResultOptions) => void;
  addCoins: (amount: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  setEquippedSkin: (target: GameId | "global", skinId: string | null) => void;
  achievementToasts: AchievementToast[];
};

const STORAGE_KEY = "webarcade-arcade-state-v2";

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
    "madlibs",
    "snake",
    "flappybird",
    "idleclicker",
  ];

  const result: Partial<Record<GameId, PerGameStats>> = {};
  ids.forEach((id) => {
    result[id] = { ...defaultPerGameStats };
  });

  return result as Record<GameId, PerGameStats>;
}

const defaultEquippedSkins: EquippedSkins = {
  wordle: "wordle_classic",
  wordsearch: null,
  sudoku: null,
  tictactoe: null,
  game2048: "game2048_classic",
  memory: null,
  sliding: null,
  trivia: null,
  connect4: null,
  rpsls: null,
  minesweeper: null,
  madlibs: null,
  snake: null,
  flappybird: null,
  idleclicker: null,
  global: null,
};

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
  equippedSkins: defaultEquippedSkins,
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
      const parsed = JSON.parse(raw) as Partial<ArcadeState>;

      const parsedEquipped: EquippedSkins | undefined = parsed.equippedSkins;

      return {
        ...initialState,
        ...parsed,
        perGameStats: {
          ...createInitialPerGameStats(),
          ...(parsed.perGameStats ?? {}),
        },
        equippedSkins: {
          ...defaultEquippedSkins,
          ...(parsedEquipped ?? {}),
        },
      };
    } catch {
      return initialState;
    }
  });

  const [achievementToasts, setAchievementToasts] = useState<
    AchievementToast[]
  >([]);

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

  const queueAchievementToast = (achievementId: string) => {
    const def = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!def) return;

    const toastId = `${achievementId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    setAchievementToasts((prev) => [
      ...prev,
      { id: toastId, label: def.name },
    ]);

    setTimeout(() => {
      setAchievementToasts((prev) =>
        prev.filter((t) => t.id !== toastId)
      );
    }, 4000);
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

      // Auto-unlock base achievements with toasts
      if (totalGamesPlayed === 1 && !prev.achievements.includes("first_play")) {
        next = unlockAchievementInternal(next, "first_play");
        queueAchievementToast("first_play");
      }
      if (
        totalGamesPlayed === 10 &&
        !prev.achievements.includes("ten_games")
      ) {
        next = unlockAchievementInternal(next, "ten_games");
        queueAchievementToast("ten_games");
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

      // Auto-unlock some specific win achievements + toasts
      if (
        gameId === "wordle" &&
        !prev.achievements.includes("wordle_first_win")
      ) {
        next = unlockAchievementInternal(next, "wordle_first_win");
        queueAchievementToast("wordle_first_win");
      }
      if (
        gameId === "minesweeper" &&
        !prev.achievements.includes("minesweeper_first_win")
      ) {
        next = unlockAchievementInternal(next, "minesweeper_first_win");
        queueAchievementToast("minesweeper_first_win");
      }

      return updateLongestSession(next);
    });
  };

  const addCoins = (amount: number, _reason?: string) => {
    if (!amount) return;
    setState((prev) => ({
      ...prev,
      currency: Math.max(0, prev.currency + amount),
    }));
  };

  const recordGameResult = (options: RecordGameResultOptions) => {
    const { gameId, win, score, durationMs } = options;

    // Always record a play
    recordGamePlayed(gameId);

    // Optionally record a win with score / time
    if (win) {
      recordWin(gameId, {
        score,
        timeSeconds:
          typeof durationMs === "number"
            ? Math.max(0, Math.round(durationMs / 1000))
            : undefined,
      });
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setState((prev) => {
      if (prev.achievements.includes(achievementId)) {
        return prev;
      }
      const next = unlockAchievementInternal(prev, achievementId);
      queueAchievementToast(achievementId);
      return next;
    });
  };

  const setEquippedSkin = (
    target: GameId | "global",
    skinId: string | null
  ) => {
    setState((prev) => ({
      ...prev,
      equippedSkins: {
        ...prev.equippedSkins,
        [target]: skinId,
      },
    }));
  };

  const value: ArcadeContextValue = {
    ...state,
    recordGamePlayed,
    recordWin,
    recordGameResult,
    addCoins,
    unlockAchievement,
    setEquippedSkin,
    achievementToasts,
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
