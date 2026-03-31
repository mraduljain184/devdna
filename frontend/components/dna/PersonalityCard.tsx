"use client";

interface PersonalityInfo {
  emoji: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  bestTeamFit: string;
  color: string;
}

const personalityData: Record<string, PersonalityInfo> = {
  "The Architect": {
    emoji: "🏗️",
    description:
      "You think in systems. Before writing a single line, you design the structure. Your code is clean, scalable and built to last.",
    strengths: ["System design", "Clean code", "Long-term thinking"],
    blindSpots: ["Can over-engineer simple problems", "Slower to ship"],
    bestTeamFit:
      "Works best with Sprinters who balance speed with your structure",
    color: "#6366f1",
  },
  "The Sprinter": {
    emoji: "⚡",
    description:
      "You move fast and ship faster. You thrive under pressure and love getting things done. Velocity is your superpower.",
    strengths: ["High velocity", "Quick delivery", "Bias for action"],
    blindSpots: ["May skip tests", "Technical debt can accumulate"],
    bestTeamFit:
      "Works best with Craftsmen who clean up and stabilize your work",
    color: "#f59e0b",
  },
  "The Craftsman": {
    emoji: "🔨",
    description:
      "Quality is everything to you. You write tests, refactor ruthlessly and never cut corners. Your code is a work of art.",
    strengths: ["High quality", "Test coverage", "Attention to detail"],
    blindSpots: ["Can be slow to ship", "Perfectionism can block progress"],
    bestTeamFit: "Works best with Sprinters to balance quality with speed",
    color: "#10b981",
  },
  "The Collaborator": {
    emoji: "🤝",
    description:
      "You make the whole team better. You review PRs, share knowledge, contribute to open source and lift everyone around you.",
    strengths: ["Team player", "Code reviews", "Knowledge sharing"],
    blindSpots: ["Can spread too thin", "Own projects may suffer"],
    bestTeamFit: "Works well with any personality type — you are the glue",
    color: "#3b82f6",
  },
  "The Pragmatist": {
    emoji: "⚖️",
    description:
      "You balance all dimensions beautifully. You know when to be fast, when to be careful, and when to ask for help.",
    strengths: ["Balanced approach", "Adaptable", "Good judgment"],
    blindSpots: ["May lack a standout superpower"],
    bestTeamFit: "Works well in any team — you adapt to what is needed",
    color: "#8b5cf6",
  },
  "The Explorer": {
    emoji: "🧭",
    description:
      "You love trying new things. New languages, new frameworks, new paradigms. Your curiosity drives innovation.",
    strengths: ["Curiosity", "Innovation", "Breadth of knowledge"],
    blindSpots: ["Consistency can suffer", "May not go deep enough"],
    bestTeamFit: "Works best with Craftsmen who bring depth to your breadth",
    color: "#ec4899",
  },
  "The Generalist": {
    emoji: "🌐",
    description:
      "You do a bit of everything and handle whatever comes your way. You are the Swiss Army knife of your team.",
    strengths: ["Versatile", "Reliable", "Handles anything"],
    blindSpots: ["May lack specialization", "Hard to stand out"],
    bestTeamFit: "Works best in small teams where versatility is valued",
    color: "#14b8a6",
  },
};

interface PersonalityCardProps {
  personalityType: string;
}

export default function PersonalityCard({
  personalityType,
}: PersonalityCardProps) {
  const info =
    personalityData[personalityType] || personalityData["The Generalist"];

  return (
    <div
      className="bg-gray-900 border rounded-2xl p-8"
      style={{ borderColor: info.color + "40" }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: info.color + "20" }}
        >
          {info.emoji}
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Your Coding Personality</p>
          <h3 className="text-2xl font-bold" style={{ color: info.color }}>
            {personalityType}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">{info.description}</p>

      {/* Strengths & Blind Spots */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h4 className="text-emerald-400 font-semibold text-sm mb-3">
            ✅ Strengths
          </h4>
          <ul className="space-y-1">
            {info.strengths.map((s) => (
              <li key={s} className="text-gray-300 text-sm">
                • {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <h4 className="text-amber-400 font-semibold text-sm mb-3">
            ⚠️ Blind Spots
          </h4>
          <ul className="space-y-1">
            {info.blindSpots.map((b) => (
              <li key={b} className="text-gray-300 text-sm">
                • {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Best Team Fit */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: info.color + "15" }}
      >
        <h4
          className="font-semibold text-sm mb-1"
          style={{ color: info.color }}
        >
          🤝 Best Team Fit
        </h4>
        <p className="text-gray-300 text-sm">{info.bestTeamFit}</p>
      </div>
    </div>
  );
}
