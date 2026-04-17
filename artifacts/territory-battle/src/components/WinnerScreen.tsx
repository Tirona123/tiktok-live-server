import { COUNTRIES } from "../data/countries";
import { useEffect, useState } from "react";

interface WinnerScreenProps {
  winnerId: string;
  scores: Record<string, number>;
  onReset: () => void;
}

export function WinnerScreen({ winnerId, scores, onReset }: WinnerScreenProps) {
  const [show, setShow] = useState(false);
  const winner = COUNTRIES.find((c) => c.id === winnerId)!;

  const sorted = [...COUNTRIES]
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
    .slice(0, 3);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.97) 100%)",
      }}
    >
      {/* Confetti-like dots */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: COUNTRIES[i % COUNTRIES.length].color,
            animation: `float-up ${1.5 + Math.random() * 2}s ease-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}

      <div
        className={`relative flex flex-col items-center gap-6 text-center px-8 transition-all duration-700 ${
          show ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        }`}
      >
        {/* Winner announcement */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl mb-2">🏆</div>
          <div className="text-white/50 text-sm font-medium uppercase tracking-widest">
            Territory Battle — Final Results
          </div>
          <div className="text-7xl leading-none">{winner.flag}</div>
          <h1
            className="text-5xl font-black tracking-tight"
            style={{ color: winner.color, textShadow: `0 0 40px ${winner.color}66` }}
          >
            {winner.name}
          </h1>
          <div className="text-xl text-white/70 font-medium">
            WINS with{" "}
            <span className="font-black" style={{ color: winner.color }}>
              {(scores[winnerId] ?? 0).toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Podium */}
        <div className="flex items-end gap-4 mt-2">
          {/* 2nd */}
          {sorted[1] && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl">{sorted[1].flag}</div>
              <div className="text-white/60 text-xs font-bold">{sorted[1].name}</div>
              <div className="w-20 h-14 rounded-t-lg flex items-center justify-center"
                style={{ backgroundColor: `${sorted[1].color}30`, border: `1px solid ${sorted[1].color}40` }}>
                <span className="text-lg font-bold" style={{ color: sorted[1].color }}>🥈</span>
              </div>
              <div className="text-white/50 text-xs">{(scores[sorted[1].id] ?? 0).toLocaleString()}</div>
            </div>
          )}

          {/* 1st */}
          {sorted[0] && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-5xl">{sorted[0].flag}</div>
              <div className="text-white/80 text-sm font-bold">{sorted[0].name}</div>
              <div className="w-24 h-20 rounded-t-lg flex items-center justify-center winner-glow"
                style={{
                  backgroundColor: `${sorted[0].color}25`,
                  border: `2px solid ${sorted[0].color}60`,
                  color: sorted[0].color,
                }}>
                <span className="text-2xl">👑</span>
              </div>
              <div className="text-sm font-black" style={{ color: sorted[0].color }}>
                {(scores[sorted[0].id] ?? 0).toLocaleString()}
              </div>
            </div>
          )}

          {/* 3rd */}
          {sorted[2] && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl">{sorted[2].flag}</div>
              <div className="text-white/60 text-xs font-bold">{sorted[2].name}</div>
              <div className="w-20 h-10 rounded-t-lg flex items-center justify-center"
                style={{ backgroundColor: `${sorted[2].color}30`, border: `1px solid ${sorted[2].color}40` }}>
                <span className="text-lg font-bold" style={{ color: sorted[2].color }}>🥉</span>
              </div>
              <div className="text-white/50 text-xs">{(scores[sorted[2].id] ?? 0).toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Play again */}
        <button
          onClick={onReset}
          className="mt-4 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${winner.color}, ${winner.color}bb)`,
            color: "#000",
            boxShadow: `0 0 24px ${winner.color}55`,
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
