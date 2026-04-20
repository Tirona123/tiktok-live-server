import { useState, useEffect, useCallback, useRef } from "react";
import { COUNTRIES, EVENTS } from "../data/countries";

export interface FloatingPoint {
  id: string;
  countryId: string;
  points: number;
  emoji: string;
  x: number;
  y: number;
}

export interface GameEvent {
  id: string;
  viewerName: string;
  countryId: string;
  eventName: string;
  emoji: string;
  points: number;
  timestamp: number;
}

export type GamePhase = "idle" | "running" | "ended";

const GAME_DURATION = 5 * 60;

export function useGameState() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(COUNTRIES.map((c) => [c.id, 0]))
  );

  const [ranks, setRanks] = useState<Record<string, number>>(
    Object.fromEntries(COUNTRIES.map((c, i) => [c.id, i + 1]))
  );

  const [prevRanks, setPrevRanks] = useState<Record<string, number>>(
    Object.fromEntries(COUNTRIES.map((c, i) => [c.id, i + 1]))
  );

  const [recentEvents, setRecentEvents] = useState<GameEvent[]>([]);
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([]);

  // ✅ NEW: viewer leaderboard
  const [viewers, setViewers] = useState<Record<string, number>>({});

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // -------------------------
  // RANKS FOR COUNTRIES
  // -------------------------
  const computeRanks = useCallback((s: Record<string, number>) => {
    const sorted = Object.entries(s).sort(([, a], [, b]) => b - a);
    const newRanks: Record<string, number> = {};

    sorted.forEach(([id], i) => {
      newRanks[id] = i + 1;
    });

    return newRanks;
  }, []);

  // -------------------------
  // ADD POINTS (MAIN ENGINE)
  // -------------------------
  const addPoints = useCallback(
    (
      countryId: string,
      points: number,
      emoji: string,
      viewerName?: string,
      eventName?: string
    ) => {
      setScores((prev) => {
        const updated = {
          ...prev,
          [countryId]: (prev[countryId] ?? 0) + points,
        };

        const newRanks = computeRanks(updated);
        setPrevRanks(ranks);
        setRanks(newRanks);

        return updated;
      });

      // ✅ VIEWER LEADERBOARD UPDATE
      if (viewerName) {
        setViewers((prev) => ({
          ...prev,
          [viewerName]: (prev[viewerName] || 0) + points,
        }));
      }

      // events
      if (viewerName && eventName) {
        const event: GameEvent = {
          id: `${Date.now()}-${Math.random()}`,
          viewerName,
          countryId,
          eventName,
          emoji,
          points,
          timestamp: Date.now(),
        };

        setRecentEvents((prev) => [event, ...prev].slice(0, 30));
      }

      const fp: FloatingPoint = {
        id: `fp-${Date.now()}-${Math.random()}`,
        countryId,
        points,
        emoji,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
      };

      setFloatingPoints((prev) => [...prev, fp]);

      setTimeout(() => {
        setFloatingPoints((prev) =>
          prev.filter((item) => item.id !== fp.id)
        );
      }, 1200);
    },
    [computeRanks, ranks]
  );

  // -------------------------
  // SELECT COUNTRY
  // -------------------------
  const selectCountry = useCallback((countryId: string) => {
    setSelectedCountry((prev) =>
      prev === countryId ? null : countryId
    );
  }, []);

  // -------------------------
  // SEND GIFT (UPDATED FLOW)
  // -------------------------
  const sendGift = useCallback(
    (countryId: string, gift?: (typeof EVENTS)[number]) => {
      if (phase !== "running") return;

      if (!gift) {
        selectCountry(countryId);
        return;
      }

      addPoints(
        countryId,
        gift.points,
        gift.emoji,
        "viewer",
        gift.name
      );

      setSelectedCountry(null);
    },
    [phase, addPoints, selectCountry]
  );

  // -------------------------
  // WEBSOCKET
  // -------------------------
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "gift") {
        const { countryId, points, emoji, viewerName, eventName } =
          msg.data;

        if (phase === "running") {
          addPoints(
            countryId,
            points,
            emoji,
            viewerName,
            eventName
          );
        }
      }
    };

    wsRef.current = ws;
    return () => ws.close();
  }, [addPoints, phase]);

  // -------------------------
  // TIMER
  // -------------------------
  useEffect(() => {
    if (phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("ended");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // -------------------------
  // START GAME
  // -------------------------
  const startGame = useCallback(() => {
    setPhase("running");
    setTimeLeft(GAME_DURATION);

    setScores(
      Object.fromEntries(COUNTRIES.map((c) => [c.id, 0]))
    );

    setViewers({}); // reset leaderboard

    const initRanks = Object.fromEntries(
      COUNTRIES.map((c, i) => [c.id, i + 1])
    );

    setRanks(initRanks);
    setPrevRanks(initRanks);
    setRecentEvents([]);
    setFloatingPoints([]);
    setSelectedCountry(null);
  }, []);

  const resetGame = useCallback(() => {
    setPhase("idle");
    setTimeLeft(GAME_DURATION);
    setViewers({});
    setSelectedCountry(null);
  }, []);

  // -------------------------
  // HELPERS
  // -------------------------
  const getSortedCountries = useCallback(() => {
    return [...COUNTRIES].sort(
      (a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0)
    );
  }, [scores]);

  const getMaxScore = useCallback(() => {
    return Math.max(...Object.values(scores), 1);
  }, [scores]);

  // 🏆 VIEWER RANKING
  const getViewerRanking = useCallback(() => {
    return Object.entries(viewers)
      .sort(([, a], [, b]) => b - a)
      .map(([name, points]) => ({ name, points }));
  }, [viewers]);

  return {
    phase,
    timeLeft,
    scores,
    ranks,
    prevRanks,
    recentEvents,
    floatingPoints,

    selectedCountry,

    viewers,              // NEW
    getViewerRanking,     // NEW

    startGame,
    resetGame,
    sendGift,
    getSortedCountries,
    getMaxScore,
  };
}