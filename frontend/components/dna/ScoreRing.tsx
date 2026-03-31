"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  color = "#10b981",
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth={strokeWidth}
          />
          {/* Score circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-white"
            style={{ fontSize: size * 0.2 }}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-gray-400 text-xs text-center">{label}</span>
      )}
    </div>
  );
}
