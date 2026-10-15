import { Trophy, Gift, Users, Newspaper, Megaphone, MessageCircle } from "lucide-react";
import { offersData } from "../data/dummyData";

const iconMap: Record<string, React.ReactNode> = {
  "trophy-alt": <Trophy size={40} className="offer-icon text-accent" />,
  "gift": <Gift size={40} className="offer-icon text-accent" />,
  "users-alt": <Users size={40} className="offer-icon text-accent" />,
  "news": <Newspaper size={40} className="offer-icon text-accent" />,
  "speaker": <Megaphone size={40} className="offer-icon text-accent" />,
  "chat": <MessageCircle size={40} className="offer-icon text-accent" />
};

export default function WhatWeOffer() {
  return (
    <section className="offers-section" id="features">
      <div className="container">
        <div className="section-header">
          <div className="line"></div>
          <h2 className="heading-primary section-title">WHAT WE OFFER</h2>
          <div className="line"></div>
        </div>
        
        <div className="offers-grid">
          {offersData.map((offer) => (
            <div key={offer.id} className="offer-card glass-panel">
              <div className="offer-icon-wrapper">
                {iconMap[offer.icon]}
              </div>
              <h3 className="offer-title heading-secondary">{offer.title}</h3>
              <p className="offer-desc">{offer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
