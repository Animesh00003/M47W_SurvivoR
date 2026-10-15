"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLiveData } from "../hooks/useLiveData";

export default function Tournaments() {
  const { data } = useLiveData();
  const liveTournaments = data?.tournaments;
  
  let tournamentsList: any[] = [];
  
  if (liveTournaments) {
    tournamentsList = liveTournaments.map((t: any) => {
      const conductDate = t.conduct_date ? new Date(t.conduct_date) : null;
      const statusText = t.status 
        ? t.status.toUpperCase() 
        : (t.its_finished ? "FINISHED" : (t.its_running ? "LIVE" : (t.registration_open ? "REGISTRATION OPEN" : "UPCOMING")));

      return {
        id: t.tour_id || t.id,
        status: statusText,
        title: t.name,
        format: t.format,
        prizePool: "TBD",
        startDate: conductDate && !isNaN(conductDate.getTime()) 
          ? conductDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() 
          : "TBD",
        timeString: conductDate && !isNaN(conductDate.getTime()) 
          ? conductDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + " UTC" 
          : "TBD",
        image: t.banner_url || "/images/tournaments/bg.jpg",
        guildName: data?.guild?.guild_name || "M47W"
      };
    });
  }


  // Carousel logic for 2 visible cards
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (tournamentsList.length <= 2) return; 
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tournamentsList.length);
    }, 10000); 
    // Restart interval whenever activeIndex changes manually
    return () => clearInterval(interval);
  }, [tournamentsList.length, activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + tournamentsList.length) % tournamentsList.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % tournamentsList.length);
  };

  // Touch swipe handlers
  const minSwipeDistance = 50; 
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  // Create an infinite loop effect by duplicating the array and slicing 2 items
  const visibleTournaments = tournamentsList.length > 2 
    ? [...tournamentsList, ...tournamentsList].slice(activeIndex, activeIndex + 2)
    : tournamentsList;

  // Dynamic badge class based on status text
  const getBadgeClass = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("LIVE")) return "tourn-badge-red";
    if (s.includes("OPEN") || s.includes("CHECKIN") || s.includes("REGISTRATION")) return "tourn-badge-red";
    if (s.includes("FINISHED") || s.includes("COMPLETED")) return "tourn-badge-blue";
    return "tourn-badge-neutral";
  };


  return (
    <section className="tournaments-section" id="tournaments">
      <div className="container">
        <div className="section-header align-left">
          <h2 className="heading-primary section-title">OFFICIALLY SPONSORED TOURNAMENTS</h2>
          <div className="line"></div>
        </div>
        <p className="section-subtitle">Compete. Prove your skill. Earn glory.</p>
        
        <div className="carousel-container">
          {tournamentsList.length > 2 && (
            <button className="carousel-arrow left" onClick={handlePrev}>
              <ChevronLeft size={32} />
            </button>
          )}

          <div 
            className="tournaments-layout grid-view"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {visibleTournaments.map((tournament, idx) => (
              <div key={`${tournament.id}-${activeIndex}-${idx}`} className="tournament-card futuristic-card slide-left-card">
                
                <div className="tournament-bg" style={{ backgroundImage: `url(${tournament.image})` }}>
                  <div className="tournament-overlay"></div>
                </div>
                
                {/* Badge container (Top Right) */}
                <div className="tourn-badge-wrapper">
                  <div className={`tourn-badge ${getBadgeClass(tournament.status)}`}>
                    <div className="tourn-badge-inner">
                      <span>{tournament.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="tournament-content-new">
                  
                  <h3 className="tourn-title heading-primary">{tournament.title}</h3>
                  <div className="tourn-title-line"></div>
                  
                  <div className="tourn-info-row">
                    <div className="tourn-info-col">
                      <Calendar size={28} className="tourn-icon" />
                      <div className="tourn-info-text">
                        <span className="info-label">START DATE</span>
                        <span className="info-value">{tournament.startDate || "TBD"}</span>
                      </div>
                    </div>
                    
                    <div className="tourn-info-divider"></div>
                    
                    <div className="tourn-info-col">
                      <Users size={28} className="tourn-icon" />
                      <div className="tourn-info-text">
                        <span className="info-label">CONDUCT TIME</span>
                        <span className="info-value">{tournament.timeString || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                  
                </div>

                <div className="tourn-footer">
                  <div className="tourn-footer-left">
                    <span className="footer-label">PRESENTED BY</span>
                    <span className="footer-brand text-accent">{tournament.guildName || "M47W"}</span>
                  </div>
                  <Link href="/tournaments" className="tourn-footer-right" style={{ textDecoration: 'none' }}>
                    <span className="view-details">VIEW DETAILS</span>
                    <ArrowRight size={16} className="text-accent" />
                  </Link>
                </div>

              </div>
            ))}
          </div>

          {tournamentsList.length > 2 && (
            <button className="carousel-arrow right" onClick={handleNext}>
              <ChevronRight size={32} />
            </button>
          )}
        </div>
        
        {tournamentsList.length > 2 && (
          <div className="carousel-indicators">
            {tournamentsList.map((_, idx) => (
              <div 
                key={idx} 
                className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                {idx === activeIndex && (
                  <div className="carousel-progress" key={`progress-${activeIndex}`}></div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
