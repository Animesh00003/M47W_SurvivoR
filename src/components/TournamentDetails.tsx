"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Gamepad2,
  Trophy,
  Calendar,
  Users,
  ChevronRight,
  User,
  Swords,
  Activity,
  FileText,
} from "lucide-react";

function TournamentDetailsContent() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "players" | "winners">("overview");

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) throw new Error("API URL is missing");
        const res = await fetch(`${API_URL}/api/tournaments?tour_id=${tourId}`);
        if (!res.ok) throw new Error("Failed to fetch tournament details");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetails();
    const interval = setInterval(fetchTourDetails, 60000);
    return () => clearInterval(interval);
  }, [tourId]);

  const statusInfo = useMemo(() => {
    const s = (data?.status || "").toLowerCase();
    if (s === "finished" || s === "completed")
      return { label: "COMPLETED", cls: "completed", dot: false };
    if (s === "live" || s === "running")
      return { label: "RUNNING", cls: "running", dot: true };
    if (s === "registration open")
      return { label: "REGISTRATION OPEN", cls: "open", dot: true };
    return { label: "UPCOMING", cls: "upcoming", dot: false };
  }, [data?.status]);

  const formattedDate = useMemo(() => {
    if (!data?.conduct_date) return "Date TBD";
    const d = new Date(data.conduct_date);
    const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + " UTC";
    return `${date}, ${time}`;
  }, [data?.conduct_date]);

  const registeredPlayers = data?.registered_players || [];
  const winners = data?.winners || [];
  const hasWinners = winners.length > 0;
  const registeredCount = registeredPlayers.length;

  // Auto-fit: calculate how many player cards fit in the row
  const rowRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const calcVisible = useCallback(() => {
    if (!rowRef.current) return;
    const containerWidth = rowRef.current.offsetWidth;
    // Each card ~174px wide (min 160 + 14px gap), reserve 60px for the +N bubble
    const CARD_W = 174;
    const BUBBLE_W = 60;
    const count = Math.max(1, Math.floor((containerWidth - BUBBLE_W) / CARD_W));
    setVisibleCount(Math.min(count, registeredCount));
  }, [registeredCount]);

  useEffect(() => {
    calcVisible();
    const ro = new ResizeObserver(calcVisible);
    if (rowRef.current) ro.observe(rowRef.current);
    return () => ro.disconnect();
  }, [calcVisible]);

  const shownPlayers = registeredPlayers.slice(0, visibleCount);
  const remainingCount = registeredCount - visibleCount;

  if (loading) {
    return (
      <div className="tdd-loading">
        <div className="tdd-spinner" />
        <p>LOADING TOURNAMENT DASHBOARD...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tdd-loading">
        <p style={{ color: "#ef4444", fontSize: "1.1rem" }}>ERROR LOADING TOURNAMENT</p>
        <p style={{ color: "#64748b", marginTop: 8 }}>{error || "Tournament data unavailable"}</p>
        <Link href="/tournaments" className="tdd-back-link" style={{ marginTop: 24 }}>
          <ArrowLeft size={14} /> Return to Tournaments
        </Link>
      </div>
    );
  }

  const bannerSrc = data.banner || data.banner_url || "/images/hero_bg.jpg";
  const gameName = data.game || "Modern Warships";
  const formatName = data.format || "5vs5 (Random Teams)";

  return (
    <div className="tdd-wrapper">

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <div className="tdd-hero" style={{ backgroundImage: `url(${bannerSrc})` }}>
        <div className="tdd-hero-overlay" />
        <div className="tdd-hero-inner">
          <Link href="/tournaments" className="tdd-back-link">
            <ArrowLeft size={14} /> BACK TO TOURNAMENTS
          </Link>
          <div className="tdd-hero-bottom">
            <div className="tdd-hero-text">
              <div className={`tdd-status-badge ${statusInfo.cls}`}>
                {statusInfo.dot && <span className="tdd-status-dot" />}
                {statusInfo.label}
              </div>
              <h1 className="tdd-hero-title">{data.name}</h1>
              <div className="tdd-hero-presented">
                <span className="tdd-presented-label">PRESENTED BY</span>
                <span className="tdd-presented-name">&nbsp;{data.guild_name || "M47W - SurvivoR"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB NAV ─────────────────────────────────────────── */}
      <div className="tdd-tabs-row">
        <button
          className={`tdd-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FileText size={15} /> Overview
        </button>
        <button
          className={`tdd-tab ${activeTab === "players" ? "active" : ""}`}
          onClick={() => setActiveTab("players")}
        >
          <Users size={15} /> Registered Players
          <span className="tdd-tab-badge">{registeredCount}</span>
        </button>
        {hasWinners && (
          <button
            className={`tdd-tab ${activeTab === "winners" ? "active" : ""}`}
            onClick={() => setActiveTab("winners")}
          >
            <Trophy size={15} /> Finalists &amp; Winners
          </button>
        )}
      </div>

      {/* ── PAGE CONTENT ────────────────────────────────────── */}
      <div className="tdd-content">

        {/* ── OVERVIEW TAB ──────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* Overview info card */}
            <div className="tdd-card">
              <div className="tdd-overview-right">
                <div className="tdd-card-heading">
                  <Users size={18} style={{ color: "#38bdf8" }} />
                  TOURNAMENT OVERVIEW
                </div>

                {/* 4-col stats row */}
                <div className="tdd-stats-row">
                  <div className="tdd-stat-cell">
                    <span className="tdd-stat-label">GAME</span>
                    <div className="tdd-stat-val-row">
                      <Gamepad2 size={16} className="tdd-stat-icon" />
                      <span className="tdd-stat-value">{gameName}</span>
                    </div>
                  </div>
                  <div className="tdd-stat-divider" />
                  <div className="tdd-stat-cell">
                    <span className="tdd-stat-label">FORMAT</span>
                    <div className="tdd-stat-val-row">
                      <Swords size={16} className="tdd-stat-icon" />
                      <span className="tdd-stat-value">{formatName}</span>
                    </div>
                  </div>
                  <div className="tdd-stat-divider" />
                  <div className="tdd-stat-cell">
                    <span className="tdd-stat-label">CONDUCT TIME</span>
                    <div className="tdd-stat-val-row">
                      <Calendar size={16} className="tdd-stat-icon" />
                      <span className="tdd-stat-value">{formattedDate}</span>
                    </div>
                  </div>
                  <div className="tdd-stat-divider" />
                  <div className="tdd-stat-cell">
                    <span className="tdd-stat-label">STATUS</span>
                    <div className="tdd-stat-val-row">
                      <Activity size={16} className="tdd-stat-icon" />
                      <span className={`tdd-stat-value tdd-status-text ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Winners podium if finished */}
            {hasWinners && (
              <div className="tdd-card">
                <div className="tdd-card-heading gold">
                  <Trophy size={18} /> TOURNAMENT WINNERS
                </div>
                <div className={`tdd-podium-grid count-${winners.length}`}>
                  {winners.map((w: any, i: number) => {
                    const isChamp = w.position === 1;
                    return (
                      <div key={i} className={`tdd-podium-card ${isChamp ? "champ" : "finalist"}`}>
                        <div className="tdd-podium-avatar">
                          {w.avatar_url ? <img src={w.avatar_url} alt={w.name} /> : <User size={22} />}
                        </div>
                        <div className="tdd-podium-info">
                          <span className={`tdd-podium-rank ${isChamp ? "champ" : "place"}`}>
                            {isChamp
                              ? "🏆 CHAMPION"
                              : w.position === 2
                              ? "🥈 2ND PLACE"
                              : w.position === 3
                              ? "🥉 3RD PLACE"
                              : `#${w.position} PLACE`}
                          </span>
                          <span className="tdd-podium-name">{w.name}</span>
                          <span className="tdd-podium-id">@{w.discord_id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Registered Players card — horizontal scroll row */}
            <div className="tdd-card tdd-players-row-card">
              {/* Heading */}
              <div className="tdd-card-heading" style={{ marginBottom: 18 }}>
                <Users size={18} style={{ color: "#38bdf8" }} />
                REGISTERED PLAYERS
              </div>

              {/* Fitted row — no scroll, +N at end */}
              {registeredCount > 0 ? (
                <div className="tdd-hscroll-row" ref={rowRef}>
                  {shownPlayers.map((p: any, i: number) => (
                    <div key={i} className="tdd-hplayer-card">
                      <div className="tdd-hplayer-avatar-wrap">
                        <div className="tdd-hplayer-avatar">
                          {p.avatar_url
                            ? <img src={p.avatar_url} alt={p.name} />
                            : <User size={22} />}
                        </div>
                        <div className="tdd-discord-badge">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="tdd-hplayer-info">
                        <span className="tdd-hplayer-name">{p.name}</span>
                        <span className="tdd-hplayer-id">@{p.discord_id}</span>
                      </div>
                    </div>
                  ))}
                  {/* +N remaining bubble */}
                  {remainingCount > 0 && (
                    <div className="tdd-hplayer-remaining" title={`+${remainingCount} more players`}>
                      +{remainingCount}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: "#64748b", fontSize: "0.82rem", padding: "20px 0" }}>
                  No players have registered yet.
                </p>
              )}

              {/* Centered VIEW ALL PLAYERS button */}
              <div className="tdd-view-all-center">
                <Link
                  href={`/tournaments/players?id=${tourId}`}
                  className="tdd-view-all-center-btn"
                >
                  VIEW ALL PLAYERS <ChevronRight size={15} />
                </Link>
              </div>
            </div>

          </>
        )}

        {/* ── PLAYERS TAB — navigates away, shown as redirect hint */}
        {activeTab === "players" && (
          <div className="tdd-card" style={{ textAlign: "center", padding: "48px 28px" }}>
            <Users size={32} style={{ color: "#38bdf8", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "#94a3b8", letterSpacing: "1px" }}>
              VIEW THE FULL PLAYER DIRECTORY
            </p>
            <Link href={`/tournaments/players?id=${tourId}`} className="tdd-view-all-btn" style={{ marginTop: 20, display: "inline-flex" }}>
              OPEN PLAYERS PAGE <ChevronRight size={15} />
            </Link>
          </div>
        )}

        {/* ── WINNERS TAB ───────────────────────── */}
        {activeTab === "winners" && hasWinners && (
          <div className="tdd-card">
            <div className="tdd-card-heading gold">
              <Trophy size={18} /> TOURNAMENT WINNERS
            </div>
            <div className={`tdd-podium-grid count-${winners.length}`}>
              {winners.map((w: any, i: number) => {
                const isChamp = w.position === 1;
                return (
                  <div key={i} className={`tdd-podium-card ${isChamp ? "champ" : "finalist"}`}>
                    <div className="tdd-podium-avatar">
                      {w.avatar_url ? <img src={w.avatar_url} alt={w.name} /> : <User size={22} />}
                    </div>
                    <div className="tdd-podium-info">
                      <span className={`tdd-podium-rank ${isChamp ? "champ" : "place"}`}>
                        {isChamp
                          ? "🏆 CHAMPION"
                          : w.position === 2
                          ? "🥈 2ND PLACE"
                          : w.position === 3
                          ? "🥉 3RD PLACE"
                          : `#${w.position} PLACE`}
                      </span>
                      <span className="tdd-podium-name">{w.name}</span>
                      <span className="tdd-podium-id">@{w.discord_id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>{/* end .tdd-content */}
    </div>
  );
}

export default function TournamentDetails() {
  return (
    <Suspense fallback={
      <div className="tdd-loading">
        <div className="tdd-spinner" />
        <p>LOADING DASHBOARD...</p>
      </div>
    }>
      <TournamentDetailsContent />
    </Suspense>
  );
}
