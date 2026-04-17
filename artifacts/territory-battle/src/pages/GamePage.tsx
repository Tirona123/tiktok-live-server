import { useGameState } from "../hooks/useGameState";
import { CountryCard } from "../components/CountryCard";
import { EventFeed } from "../components/EventFeed";
import { Timer } from "../components/Timer";
import { WinnerScreen } from "../components/WinnerScreen";
import { COUNTRIES, EVENTS } from "../data/countries";

const GAME_DURATION = 5 * 60;

export function GamePage() {
  const {
    phase,
    timeLeft,
    scores,
    ranks,
    prevRanks,
    recentEvents,
    winner,
    startGame,
    resetGame,
    sendGift,
    getSortedCountries,
    getMaxScore,
  } = useGameState();

  const sortedCountries = getSortedCountries();
  const maxScore = getMaxScore();
  const leaderId = sortedCountries[0]?.id;
  const totalEvents = recentEvents.length;
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="text-2xl">⚔️</div>
          <div>
            <div className="text-white font-black text-lg leading-tight tracking-tight">Territory Battle</div>
            <div className="text-white/35 text-xs font-medium">TikTok Live • 9 Countries</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {phase === "running" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wide">Live</span>
            </div>
          )}
          {phase === "running" && (
            <div className="text-white/40 text-xs">
              <span className="font-bold text-white/70">{totalEvents}</span> events ·{" "}
              <span className="font-bold text-white/70">{totalPoints.toLocaleString()}</span> pts
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 overflow-hidden">
        {/* Left: Leaderboard */}
        <div className="flex-1 flex flex-col px-3 pt-3 pb-4 min-w-0">
          {/* Timer + CTA row */}
          <div className="flex items-center justify-between mb-4">
            {phase === "idle" && (
              <div className="flex-1">
                <h2 className="text-white font-black text-2xl mb-1 leading-tight">
                  5-Minute Battle
                </h2>
                <p className="text-white/40 text-sm">
                  Support your country with gifts. The highest score wins!
                </p>
              </div>
            )}

            {phase !== "idle" && (
              <Timer timeLeft={timeLeft} totalTime={GAME_DURATION} />
            )}

            <div className="flex-shrink-0 ml-4">
              {phase === "idle" && (
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-black transition-all active:scale-95 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #FBBF24, #F97316)",
                    boxShadow: "0 0 24px rgba(251,191,36,0.4)",
                  }}
                >
                  Start Battle
                </button>
              )}
              {phase === "running" && (
                <div className="text-center">
                  <div className="text-white/30 text-xs mb-1 uppercase tracking-wider">Tap country to support</div>
                  <div className="flex gap-1 flex-wrap justify-center max-w-[120px]">
                    {EVENTS.slice(0, 3).map((e) => (
                      <span key={e.name} className="text-lg">{e.emoji}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Countries list */}
          <div className="flex flex-col gap-1.5">
            {sortedCountries.map((country) => (
              <CountryCard
                key={country.id}
                countryId={country.id}
                score={scores[country.id] ?? 0}
                rank={ranks[country.id] ?? 9}
                prevRank={prevRanks[country.id] ?? 9}
                maxScore={maxScore}
                phase={phase}
                isLeader={country.id === leaderId && phase === "running"}
                onSendGift={sendGift}
              />
            ))}
          </div>

          {/* Legend */}
          {phase === "idle" && (
            <div className="mt-6 grid grid-cols-3 gap-2">
              {EVENTS.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/6"
                >
                  <span className="text-lg">{e.emoji}</span>
                  <div>
                    <div className="text-white/80 text-xs font-semibold">{e.name}</div>
                    <div className="text-yellow-400 text-xs font-bold">+{e.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Event feed */}
        {(phase === "running" || phase === "ended") && (
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/6 flex flex-col">
            <div className="px-3 py-2.5 border-b border-white/6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Live Events</span>
            </div>
            <div className="flex-1 p-2 overflow-hidden" style={{ height: "320px", maxHeight: "320px" }}>
              <EventFeed events={recentEvents} />
            </div>

            {/* Quick support grid */}
            {phase === "running" && (
              <div className="border-t border-white/6 p-3">
                <div className="text-white/40 text-xs mb-2 font-medium uppercase tracking-wider">Quick Support</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {COUNTRIES.slice(0, 9).map((country) => (
                    <button
                      key={country.id}
                      onClick={() => sendGift(country.id)}
                      className="flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg border border-white/8 bg-white/4 text-xs font-semibold transition-all active:scale-95 hover:bg-white/8"
                      style={{ color: country.color }}
                    >
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="text-[10px] text-white/50 font-medium">{country.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Winner overlay */}
      {phase === "ended" && winner && (
        <WinnerScreen winnerId={winner} scores={scores} onReset={resetGame} />
      )}
    </div>
  );
}
