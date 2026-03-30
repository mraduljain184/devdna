"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";

export default function AuthSuccessPage() {
  const { setUser, setToken, setLoading } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      window.location.replace("/login?error=" + error);
      return;
    }

    if (!token) {
      window.location.replace("/login");
      return;
    }

    // Save token to localStorage
    localStorage.setItem("devdna_token", token);
    setToken(token);

    // Fetch user data
    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
        window.location.replace("/dashboard");
      })
      .catch(() => {
        localStorage.removeItem("devdna_token");
        window.location.replace("/login?error=fetch_failed");
      });
  }, [setUser, setToken, setLoading]);

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🧬</div>
        <h2 className="text-white text-2xl font-semibold mb-2">
          Analyzing your DNA...
        </h2>
        <p className="text-gray-400">
          Please wait while we set up your profile
        </p>

        {/* Loading spinner */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </main>
  );
}
