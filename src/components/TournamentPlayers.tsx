"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Users, User, Search, Gamepad2, Trophy, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function TournamentPlayersContent() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) throw new Error("API URL is missing");

        const res = await fetch(`${API_URL}/api/tournaments?tour_id=${tourId}`);
        if (!res.ok) throw new Error("Failed to fetch tournament players");

        const json = await res.json();
        if (json.error) throw new Error(json.error);
        
        setData(json);
      } catch (err: any) {
        console.warn("Failed to fetch tournament players:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();

    // Poll every 1 minute (60000 ms) for registered players updates
    const interval = setInterval(fetchTourDetails, 60000);
    return () => clearInterval(interval);
  }, [tourId]);

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#00f0ff" }}>
        <div className="spinner" style={{ width: "40px", height: "40px", border: "3px solid rgba(0, 240, 255, 0.1)", borderTopColor: "#00f0ff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px auto" }}></div>
        <p style={{ fontFamily: "var(--font-heading)" }}>LOADING PLAYERS...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#ef4444" }}>
        <p>Error loading players: {error}</p>
        <Link href={`/tournaments/detail?id=${tourId}`} style={{ color: "#94a3b8", textDecoration: "underline", marginTop: "20px", display: "inline-block" }}>Return to Tournament</Link>
      </div>
    );
  }

  const registeredPlayers = data.registered_players || [];
  const filteredPlayers = registeredPlayers.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.discord_id.toString().includes(searchQuery)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getStatusText = () => {
    const s = (data.status || "").toLowerCase();
    if (s === "finished" || s === "completed") return "COMPLETED";
    if (s === "live" || s === "running") return "LIVE NOW";
    if (s === "registration open") return "REGISTRATION OPEN";
    return "UPCOMING";
  };

  const statusText = getStatusText();
  const isRegistrationOpen = statusText === "REGISTRATION OPEN";
  const gameName = data.game || ((!data.games || data.games === "MW") ? "MODERN WARSHIPS" : data.games);
  const bannerSrc = data.banner || data.banner_url;

  return (
    <div className="tour-details-container fade-in">
      <Link href={`/tournaments/detail?id=${tourId}`} className="back-nav">
        <ArrowLeft size={16} /> BACK TO TOURNAMENT
      </Link>

      {/* Header Section */}
      <div className="players-page-header">
        <div className="players-page-banner">
          {bannerSrc ? (
             <img src={bannerSrc} alt={data.name} />
          ) : (
             <div style={{width:'100%', height:'100%', background:'#1e293b'}}></div>
          )}
          <h3 className="overlay-title">{data.name}</h3>
        </div>
        
        <div className="players-page-info">
          <h1 className="players-page-maintitle">REGISTERED PLAYERS</h1>
          
          <div className="players-page-statbar">
            <div className="players-page-stat-item">
              <Gamepad2 size={16} className="text-accent" /> {gameName}
            </div>
            <div className="players-page-stat-item">
              <Calendar size={16} /> {data.conduct_date || "TBD"}
            </div>
            <div className={`players-page-stat-item ${isRegistrationOpen ? 'open' : ''}`}>
              <div className={`status-dot ${isRegistrationOpen ? 'dot-registration' : ''}`} style={{ width: 8, height: 8 }}></div>
              {statusText}
            </div>
          </div>
        </div>

        <div className="players-page-summarybox">
          <Users size={16} className="icon" />
          <span className="count">{registeredPlayers.length} REGISTERED</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="players-table-container">
        <div className="players-table-top">
          <h2>REGISTERED PLAYERS</h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search player or Discord ID..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
              style={{
                width: '100%',
                padding: '10px 15px 10px 40px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <div className="players-table-wrapper">
          <table className="players-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>#</th>
                <th style={{ width: "40%" }}>PLAYER</th>
                <th style={{ width: "50%" }}>DISCORD ID</th>
              </tr>

            </thead>
            <tbody>
              {paginatedPlayers.length > 0 ? (
                paginatedPlayers.map((player: any, idx: number) => {
                  const displayIndex = startIndex + idx + 1;
                  const formattedIndex = displayIndex < 10 ? `0${displayIndex}` : displayIndex;
                  return (
                    <tr key={idx}>
                      <td className="td-index">{formattedIndex}</td>
                      <td>
                        <div className="td-player">
                          {player.avatar_url ? (
                            <img src={player.avatar_url} alt={player.name} />
                          ) : (
                            <div className="avatar-fallback"><User size={18} /></div>
                          )}
                          <span>{player.name}</span>
                        </div>
                      </td>
                      <td className="td-discord">@{player.discord_id}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="pagination-bar">
            <div style={{ width: '150px' }}></div> {/* Spacer for center alignment */}
            
            <div className="pagination-controls">
              <button 
                className="page-btn" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              {getPageNumbers().map((num, idx) => (
                <button 
                  key={idx} 
                  className={`page-btn ${currentPage === num ? 'active' : ''}`}
                  onClick={() => typeof num === 'number' ? setCurrentPage(num) : undefined}
                  disabled={num === '...'}
                  style={num === '...' ? { background: 'transparent', border: 'none', cursor: 'default', opacity: 1 } : {}}
                >
                  {num}
                </button>
              ))}
              
              <button 
                className="page-btn" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="per-page-selector">
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function TournamentPlayers() {
  return (
    <Suspense fallback={<div style={{ padding: "100px", textAlign: "center", color: "#00f0ff" }}><p>LOADING PLAYERS...</p></div>}>
      <TournamentPlayersContent />
    </Suspense>
  );
}
