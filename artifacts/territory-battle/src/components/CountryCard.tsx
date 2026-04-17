import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "../data/countries";
import type { GamePhase } from "../hooks/useGameState";

interface CountryCardProps {
  countryId: string;
  score: number;
  rank: number;
  prevRank: number;
  maxScore: number;
  phase: GamePhase;
  isLeader: boolean;
  onSendGift: (countryId: string) => void;
}

export function CountryCard({
  countryId,
  score,
  rank,
  prevRank,
  maxScore,
  phase,
  isLeader,
  onSendGift,
}: CountryCardProps) {
  const country = COUNTRIES.find((c) => c.id === countryId)!;
  const [prevScore, setPrevScore] = useState(score);
  const [isPopping, setIsPopping] = useState(false);
  const [rankChanged, setRankChanged] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (score !== prevScore) {
      setPrevScore(score);
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 300);
    }
  }, [score, prevScore]);

  useEffect(() => {
    if (rank !== prevRank) {
      setRankChanged(true);
      setTimeout(() => setRankChanged(false), 600);
    }
  }, [rank, prevRank]);

  const barWidth = maxScore > 0 ? Math.max((score / maxScore) * 100, score > 0 ? 2 : 0) : 0;
  const rankDiff = prevRank - rank;

  return (
    <div
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-500 cursor-pointer group
        ${isLeader ? "border-yellow-400/60 bg-gradient-to-r from-yellow-900/20 to-transparent" : `border-white/8 bg-white/4`}
        ${rankChanged ? "rank-flash" : ""}
        hover:bg-white/8 active:scale-[0.99]`}
      onClick={() => phase === "running" && onSendGift(countryId)}
    >
      {/* Rank */}
      <div className={`w-7 text-center font-bold text-sm flex-shrink-0 transition-all
        ${rank === 1 ? "text-yellow-400" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-amber-600" : "text-slate-500"}`}>
        {rank === 1 ? "👑" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
      </div>

      {/* Flag */}
      <div className="text-2xl flex-shrink-0 leading-none">{country.flag}</div>

      {/* Name + Bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-sm font-semibold text-white/90 truncate">{country.name}</span>
          <div className="flex items-center gap-1.5">
            {rankDiff > 0 && (
              <span className="text-green-400 text-xs font-bold">▲{rankDiff}</span>
            )}
            {rankDiff < 0 && (
              <span className="text-red-400 text-xs font-bold">▼{Math.abs(rankDiff)}</span>
            )}
            <span
              className={`text-sm font-bold tabular-nums transition-all ${isPopping ? "score-pop" : ""}`}
              style={{ color: country.color }}
            >
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, ${country.color}99, ${country.color})`,
              boxShadow: isLeader ? `0 0 8px 1px ${country.color}55` : undefined,
            }}
          />
        </div>
      </div>

      {/* Support button hint */}
      {phase === "running" && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white/40 font-medium">
          +pts
        </div>
      )}

      {/* Leader crown glow */}
      {isLeader && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px 0px ${country.color}15`,
          }}
        />
      )}
    </div>
  );
}
