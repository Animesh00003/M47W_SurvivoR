"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Calendar, Users, Trophy, ChevronRight, ChevronLeft, Gamepad2, Layers, AlignLeft } from "lucide-react";

export default function TournamentsList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) throw new Error("API URL is missing");

        const res = await fetch(`${API_URL}/api/tournaments/all`);
        if (!res.ok) throw new Error("Failed to fetch tournaments");

        const json = await res.json();
        setData(Array.isArray(json) ? json : (json.tournaments || []));
      } catch (err: any) {
        console.warn("Failed to fetch tournaments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournaments();

    // Poll API every 1 minute (60000 ms) for background updates
    const intervalId = setInterval(fetchTournaments, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getStatus = (t: any) => {
    const s = (t.status || "").toLowerCase();
    if (s === "finished" || s === "completed") return "COMPLETED";
    if (s === "live" || s === "running") return "LIVE NOW";
    if (s === "registration open") return "REGISTRATION OPEN";
    return "UPCOMING";
  };

  const filteredData = useMemo(() => {
    if (activeTab === "ALL") return data;
    return data.filter(t => getStatus(t) === activeTab);
  }, [data, activeTab]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page on filter change
  };

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#00f0ff" }}>
        <div className="spinner" style={{ width: "40px", height: "40px", border: "3px solid rgba(0, 240, 255, 0.1)", borderTopColor: "#00f0ff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px auto" }}></div>
        <p style={{ fontFamily: "var(--font-heading)" }}>LOADING TOURNAMENTS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#ef4444" }}>
        <p style={{ fontFamily: "var(--font-heading)" }}>FAILED TO LOAD DATA.</p>
        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      {/* Header */}
      <div className="tour-page-header">
        <h1 className="tour-page-title">ALL TOURNAMENTS</h1>
        <p className="tour-page-desc">Explore all upcoming, ongoing and completed tournaments.</p>
      </div>

      {/* Filter Bar */}
      <div className="tour-filter-bar">
        <div className="tour-tabs">
          {["ALL", "UPCOMING", "REGISTRATION OPEN", "LIVE NOW", "COMPLETED"].map(tab => (
            <button 
              key={tab} 
              className={`tour-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="tour-list-container">
        {paginatedData.map((t, idx) => {
          const status = getStatus(t);
          const conductDate = new Date(t.conduct_date);
          const dateStr = t.conduct_date ? conductDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "TBD";
          const timeStr = t.conduct_date ? conductDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + " UTC" : "";

          let statusClass = "";
          let dotClass = "";
          if (status === "UPCOMING") { statusClass = "badge-upcoming"; dotClass = "dot-upcoming"; }
          if (status === "REGISTRATION OPEN") { statusClass = "badge-registration"; dotClass = "dot-registration"; }
          if (status === "LIVE NOW") { statusClass = "badge-live"; dotClass = "dot-live"; }
          if (status === "COMPLETED") { statusClass = "badge-completed"; dotClass = "dot-completed"; }

          const bannerImg = t.banner || t.banner_url || '/images/tournaments/bg.jpg';
          const tourId = t.id || t.tour_id;

          return (
            <div key={tourId || idx} className="tour-row">
              {/* Col 1: Thumb */}
              <div className="tour-thumb" style={{ backgroundImage: `url(${bannerImg})` }}>
                <div className="tour-thumb-overlay">
                  <div className={`tour-thumb-badge ${statusClass}`}>{status}</div>
                  <div>
                    <h4 className="text-shadow">{t.name}</h4>
                  </div>
                </div>
              </div>

              {/* Col 2: Details */}
              <div className="tour-details">
                <div className="tour-game-title">
                  <Gamepad2 size={14} /> {t.game || t.games || "MODERN WARSHIPS"}
                </div>
                <h3>{t.name}</h3>
                
                <div className="tour-stats-grid">
                  <div className="tour-stat-item">
                    <Layers size={20} className="tour-stat-icon" />
                    <div className="tour-stat-text">
                      <span className="tour-stat-val">{t.format || "5vs5"}</span>
                      <span className="tour-stat-label">Format</span>
                    </div>
                  </div>
                  
                  <div className="tour-stat-item">
                    <Calendar size={20} className="tour-stat-icon" />
                    <div className="tour-stat-text">
                      <span className="tour-stat-val">{dateStr}</span>
                      <span className="tour-stat-label">{timeStr || "Conduct Time"}</span>
                    </div>
                  </div>

                  {/* 3rd column: Guild / Organizer */}
                  <div className="tour-stat-item">
                    <Trophy size={20} className="tour-stat-icon" style={{ color: status === "COMPLETED" ? "#fbbf24" : "#3b82f6" }} />
                    <div className="tour-stat-text">
                      <span className="tour-stat-val">{t.guild_name || "M47W-SurvivoR"}</span>
                      <span className="tour-stat-label">Organizer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 3: Action */}
              <div className="tour-action">
                <Link href={`/tournaments/detail?id=${tourId}`} style={{ textDecoration: 'none', width: '100%' }}>
                  <button className="tour-btn">
                    {status === "COMPLETED" ? "VIEW RESULTS" : "VIEW DETAILS"} <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}

        {filteredData.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", background: "rgba(15, 23, 42, 0.4)", borderRadius: "8px" }}>
            No tournaments found for this category.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="tour-pagination">
          <button 
            className="page-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            className="page-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
