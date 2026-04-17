import { useEffect, useRef } from "react";
import { COUNTRIES } from "../data/countries";
import type { GameEvent } from "../hooks/useGameState";

interface EventFeedProps {
  events: GameEvent[];
}

export function EventFeed({ events }: EventFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/25 text-sm">
        Waiting for events...
      </div>
    );
  }

  return (
    <div ref={feedRef} className="flex flex-col gap-1 overflow-y-auto h-full pr-1 scrollbar-thin">
      {events.map((event) => {
        const country = COUNTRIES.find((c) => c.id === event.countryId);
        if (!country) return null;
        return (
          <div
            key={event.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/4 text-xs animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <span className="text-base leading-none flex-shrink-0">{event.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="text-white/50 truncate block">
                <span className="text-white/80 font-medium">{event.viewerName}</span>
                {" sent "}
                <span>{event.eventName}</span>
                {" to "}
                <span style={{ color: country.color }}>{country.flag} {country.name}</span>
              </span>
            </div>
            <span className="font-bold flex-shrink-0" style={{ color: country.color }}>
              +{event.points}
            </span>
          </div>
        );
      })}
    </div>
  );
}
