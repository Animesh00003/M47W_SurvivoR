"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface GuildStats {
  guild_name: string;
  guild_icon: string | null;
  guild_invite_link: string | null;
  online_user: number;
  total_user: number;
}

export interface TournamentItem {
  tour_id: string;
  name: string;
  format: string;
  conduct_date: string | null;
  status: string;
  banner_url: string | null;
}

export interface LandingData {
  guild: GuildStats;
  guild_data: GuildStats; // Alias for backwards-compatibility
  tournaments: TournamentItem[];
  meta?: any;
}

interface LiveDataContextType {
  data: LandingData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const LiveDataContext = createContext<LiveDataContextType>({
  data: null,
  loading: true,
  error: null,
  refetch: async () => {},
});

export function LiveDataProvider({ children }: { children: React.ReactNode; pagePath?: string }) {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanding = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://survivors-backend.animeshmal03.workers.dev";
      if (!API_URL || API_URL.includes("YOUR-SUBDOMAIN")) {
        throw new Error("NEXT_PUBLIC_API_URL is not set correctly in .env.local");
      }

      const res = await fetch(`${API_URL}/api/landing`, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const json = await res.json();
      
      // Normalize data so components can access data.guild or data.guild_data
      const normalizedData: LandingData = {
        guild: json.guild,
        guild_data: json.guild, // Supports existing components seamlessly
        tournaments: json.tournaments || [],
        meta: json.meta,
      };

      setData(normalizedData);
      setError(null);
    } catch (err: any) {
      console.warn("Failed to fetch landing data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLanding();

    // Auto-refresh data every 30 seconds
    const interval = setInterval(fetchLanding, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", color: "#00f0ff" }}>
        <div className="spinner" style={{ width: "50px", height: "50px", border: "4px solid rgba(0, 240, 255, 0.1)", borderTopColor: "#00f0ff", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <p style={{ marginTop: "24px", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "2px", fontSize: "0.9rem" }}>LOADING DATA...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", color: "#ef4444", textAlign: "center", padding: "20px" }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "20px" }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 style={{ fontFamily: "var(--font-heading), sans-serif", letterSpacing: "2px", marginBottom: "10px" }}>NETWORK ERROR</h2>
        <p style={{ color: "#94a3b8", maxWidth: "400px" }}>Unable to connect to the central server. Please check your connection and try again.</p>
        <button onClick={() => fetchLanding()} style={{ marginTop: "30px", padding: "12px 24px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "1px", transition: "all 0.2s" }}>RETRY CONNECTION</button>
      </div>
    );
  }

  return (
    <LiveDataContext.Provider value={{ data, loading, error, refetch: fetchLanding }}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  return useContext(LiveDataContext);
}
