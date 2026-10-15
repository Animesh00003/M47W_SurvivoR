"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Home, Trophy, Users, Menu, X } from "lucide-react";
import { useLiveData } from "../hooks/useLiveData";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, loading } = useLiveData();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="container header-inner">
        
        <div className="header-left">
          <div className="logo">
            <Link href="/">
              <img src="/images/logo.png" alt="M47W METAL WINGS" className="logo-img" />
            </Link>
          </div>
          
          <div className="header-divider"></div>
        </div>

        <div className={`mobile-nav-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="nav-menu">
            <ul>
              <li>
                <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <Home size={16} />
                  <span>HOME</span>
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className={`nav-link ${pathname === "/tournaments" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <Trophy size={16} />
                  <span>TOURNAMENTS</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-right">
          <div className="status-bars">
            <div className="status-box online" title="ONLINE MEMBERS">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}></div>
              <div className="status-text">
                <span className="status-label">ONLINE MEMBERS</span>
                <span className="status-number">
                  {loading ? "..." : (data?.guild_data?.online_user ? data.guild_data.online_user.toLocaleString() : "1,247")}
                </span>
              </div>
            </div>
            
            <div className="status-box total" title="TOTAL MEMBERS">
              <Users size={18} className="status-icon" />
              <div className="status-text">
                <span className="status-label">TOTAL MEMBERS</span>
                <span className="status-number">
                  {loading ? "..." : (data?.guild_data?.total_user ? `${data.guild_data.total_user.toLocaleString()}` : "12,500")}
                </span>
              </div>
            </div>
          </div>

          <div className="header-action">
            <Link href={data?.guild_data?.guild_invite_link || "https://discord.com"} target="_blank" className="btn-discord">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              <span>JOIN DISCORD</span>
            </Link>
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
      </div>
    </header>
  );
}
