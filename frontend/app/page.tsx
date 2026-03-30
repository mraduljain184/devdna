"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const token = localStorage.getItem("devdna_token");
      window.location.replace(token ? "/dashboard" : "/login");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🧬</div>
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </main>
  );
}
