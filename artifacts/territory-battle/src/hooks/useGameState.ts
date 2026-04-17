import { useState, useEffect, useCallback, useRef } from "react";
import { COUNTRIES, EVENTS, VIEWER_NAMES } from "../data/countries";

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

export interface CountryScore {
  id: string;
  score: number;
  rank: number;
  prevRank: number;
}

export type GamePhase = "idle" | "running" | "ended";

const GAME_DURATION = 5 * 60; // 5 minutes in seconds

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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoEventRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const floatCleanRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const computeRanks = useCallback((s: Record<string, number>) => {
    const sorted = Object.entries(s).sort(([, a], [, b]) => b - a);
    const newRanks: Record<string, number> = {};
    sorted.forEach(([id], i) => { newRanks[id] = i + 1; });
    return newRanks;
  }, []);

  const addPoints = useCallback((countryId: string, points: number, emoji: string, viewerName?: string, eventName?: string) => {
    setScores((prev) => {
      const updated = { ...prev, [countryId]: prev[countryId] + points };
      const newRanks = computeRanks(updated);
      setPrevRanks((r) => ({ ...r }));
      setRanks(newRanks);
      return updated;
    });

    // Add event to feed
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

    // Floating point animation
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
      setFloatingPoints((prev) => prev.filter((f) => f.id !== fp.id));
    }, 1300);
  }, [computeRanks]);

  const startGame = useCallback(() => {
    setPhase("running");
    setTimeLeft(GAME_DURATION);
    setWinner(null);
    setScores(Object.fromEntries(COUNTRIES.map((c) => [c.id, 0])));
    const initRanks = Object.fromEntries(COUNTRIES.map((c, i) => [c.id, i + 1]));
    setRanks(initRanks);
    setPrevRanks(initRanks);
    setRecentEvents([]);
    setFloatingPoints([]);
  }, []);

  const resetGame = useCallback(() => {
    setPhase("idle");
    setTimeLeft(GAME_DURATION);
    setWinner(null);
    setScores(Object.fromEntries(COUNTRIES.map((c) => [c.id, 0])));
    const initRanks = Object.fromEntries(COUNTRIES.map((c, i) => [c.id, i + 1]));
    setRanks(initRanks);
    setPrevRanks(initRanks);
    setRecentEvents([]);
    setFloatingPoints([]);
  }, []);

  // Countdown timer
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
          setScores((s) => {
            const sorted = Object.entries(s).sort(([, a], [, b]) => b - a);
            setWinner(sorted[0][0]);
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Auto-simulate viewer events
  useEffect(() => {
    if (phase !== "running") {
      if (autoEventRef.current) clearInterval(autoEventRef.current);
      return;
    }

    const simulate = () => {
      // Random 1-4 events at a time
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        const viewer = VIEWER_NAMES[Math.floor(Math.random() * VIEWER_NAMES.length)];
        const extraPoints = Math.random() < 0.1 ? event.points * 3 : event.points; // occasional "super gift"
        setTimeout(() => {
          addPoints(country.id, extraPoints, event.emoji, viewer, event.name);
        }, i * 100);
      }
    };

    autoEventRef.current = setInterval(simulate, 600 + Math.random() * 800);
    return () => {
      if (autoEventRef.current) clearInterval(autoEventRef.current);
    };
  }, [phase, addPoints]);

  const sendGift = useCallback((countryId: string) => {
    if (phase !== "running") return;
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    addPoints(countryId, event.points * 2, event.emoji, "you", event.name);
  }, [phase, addPoints]);

  const getSortedCountries = useCallback(() => {
    return [...COUNTRIES].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  }, [scores]);

  const getMaxScore = useCallback(() => {
    return Math.max(...Object.values(scores), 1);
  }, [scores]);

  return {
    phase,
    timeLeft,
    scores,
    ranks,
    prevRanks,
    recentEvents,
    floatingPoints,
    selectedCountry,
    setSelectedCountry,
    winner,
    startGame,
    resetGame,
    sendGift,
    getSortedCountries,
    getMaxScore,
  };
}
