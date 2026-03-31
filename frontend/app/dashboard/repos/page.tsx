"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  updated_at: string;
  html_url: string;
}

export default function ReposPage() {
  const router = useRouter();
  const { user, setUser, setToken, logout } = useAuthStore();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      .get("/api/dna/repos")
      .then((res) => {
        setRepos(res.data.repos);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch repositories");
        setIsLoading(false);
      });
  }, [router, setUser, setToken, logout]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    toast.loading("Analyzing your DNA... this may take a minute 🧬", {
      id: "analyzing",
    });

    try {
      await api.post("/api/dna/analyze");
      toast.success("DNA Analysis complete! 🎉", { id: "analyzing" });
      router.push("/dashboard");
    } catch {
      toast.error("Analysis failed. Please try again.", { id: "analyzing" });
      setIsAnalyzing(false);
    }
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-400",
      Python: "bg-green-500",
      Rust: "bg-orange-500",
      Go: "bg-cyan-400",
      Java: "bg-red-500",
      "C++": "bg-pink-500",
      Ruby: "bg-red-400",
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-500",
    };
    return colors[language || ""] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Fetching your repositories...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
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
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Your Repositories
            </h2>
            <p className="text-gray-400">
              Found{" "}
              <span className="text-emerald-400 font-semibold">
                {repos.length}
              </span>{" "}
              repositories — ready to analyze your DNA
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || repos.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              "🔬 Analyze My DNA"
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {repo.name}
                  </h3>
                  {repo.private && (
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Private
                    </span>
                  )}
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors text-xs"
                >
                  ↗
                </a>
              </div>

              {repo.description && (
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-auto">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`}
                    />
                    <span className="text-gray-400 text-xs">
                      {repo.language}
                    </span>
                  </div>
                )}
                {repo.stargazers_count > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-gray-400 text-xs">
                      {repo.stargazers_count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
