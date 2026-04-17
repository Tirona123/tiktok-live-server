interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = timeLeft / totalTime;
  const isUrgent = timeLeft <= 30;
  const isCritical = timeLeft <= 10;

  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          {/* Background ring */}
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="6"
          />
          {/* Progress ring */}
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke={isCritical ? "#EF4444" : isUrgent ? "#F97316" : "#FBBF24"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
            style={{
              filter: `drop-shadow(0 0 6px ${isCritical ? "#EF4444" : isUrgent ? "#F97316" : "#FBBF2499"})`,
            }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-black tabular-nums tracking-tight leading-none ${
              isCritical ? "text-red-400" : isUrgent ? "text-orange-400" : "text-white"
            }`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-white/30 text-[10px] font-medium mt-0.5 uppercase tracking-wider">
            remaining
          </span>
        </div>
      </div>
    </div>
  );
}
