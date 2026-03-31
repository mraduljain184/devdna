"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import EvolutionChart from "@/components/dna/EvolutionChart";
import ScoreRing from "@/components/dna/ScoreRing";

interface Snapshot {
  id: string;
  snapshotDate: string;
  clarityScore: number;
  defensivenessScore: number;
  velocityScore: number;
  architectureScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  collaborationScore: number;
  growthScore: number;
  overallScore: number;
  personalityType: string | null;
}

export default function EvolutionPage() {
  const router = useRouter();
  const { user, setUser, setToken, logout } = useAuthStore();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("devdna_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setToken(token);

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        logout();
        router.push("/login");
      });

    api
      .get("/api/dna/snapshots")
      .then((res) => {
        setSnapshots(res.data.snapshots);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router, setUser, setToken, logout]);

  const getChangeIndicator = (current: number, previous: number) => {
    const diff = Math.round(current - previous);
    if (diff > 0) return { text: `+${diff}`, color: "text-emerald-400" };
    if (diff < 0) return { text: `${diff}`, color: "text-red-400" };
    return { text: "0", color: "text-gray-400" };
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading your evolution...</p>
        </div>
      </main>
    );
  }

  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots[snapshots.length - 2];

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            🧬 Dev<span className="text-emerald-400">DNA</span>
          </h1>
          <div className="flex items-center gap-4">
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name || ""}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            📈 DNA Evolution Timeline
          </h2>
          <p className="text-gray-400">
            Track how your coding DNA has evolved over{" "}
            <span className="text-emerald-400 font-semibold">
              {snapshots.length} analysis
              {snapshots.length !== 1 ? "es" : ""}
            </span>
          </p>
        </div>

        {/* Latest vs Previous */}
        {latest && previous && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
            <h3 className="text-white text-xl font-semibold mb-6">
              🆚 Latest vs Previous Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Overall",
                  current: latest.overallScore,
                  prev: previous.overallScore,
                },
                {
                  label: "Clarity",
                  current: latest.clarityScore,
                  prev: previous.clarityScore,
                },
                {
                  label: "Velocity",
                  current: latest.velocityScore,
                  prev: previous.velocityScore,
                },
                {
                  label: "Growth",
                  current: latest.growthScore,
                  prev: previous.growthScore,
                },
              ].map((item) => {
                const change = getChangeIndicator(item.current, item.prev);
                return (
                  <div
                    key={item.label}
                    className="bg-gray-800 rounded-xl p-4 text-center"
                  >
                    <p className="text-gray-400 text-xs mb-3">{item.label}</p>
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.round(item.current)}
                    </div>
                    <div className={`text-sm font-semibold ${change.color}`}>
                      {change.text} from last
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evolution Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-white text-xl font-semibold mb-6">
            📊 Score Evolution
          </h3>
          <EvolutionChart snapshots={snapshots} />
        </div>

        {/* Snapshot History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-white text-xl font-semibold mb-6">
            🕐 Analysis History
          </h3>
          {snapshots.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🧬</div>
              <p className="text-gray-400">
                No analyses yet. Run your first DNA analysis to start tracking!
              </p>
              <button
                onClick={() => router.push("/dashboard/repos")}
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-xl transition-all text-sm"
              >
                🔬 Analyze My DNA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {[...snapshots].reverse().map((snapshot, index) => (
                <div
                  key={snapshot.id}
                  className="bg-gray-800 rounded-xl p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <span className="text-emerald-400 text-sm font-bold">
                        {snapshots.length - index}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        Analysis #{snapshots.length - index}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(snapshot.snapshotDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Overall</p>
                      <p className="text-emerald-400 font-bold">
                        {Math.round(snapshot.overallScore)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Personality</p>
                      <p className="text-white text-sm">
                        {snapshot.personalityType || "—"}
                      </p>
                    </div>
                    <ScoreRing
                      score={snapshot.overallScore}
                      size={50}
                      strokeWidth={5}
                      color="#10b981"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
