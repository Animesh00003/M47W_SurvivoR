"use client";
import { Users, Trophy, DollarSign, Shield, Activity } from "lucide-react";
import { statsData } from "../data/dummyData";
import { useLiveData } from "../hooks/useLiveData";

const iconMap: Record<string, React.ReactNode> = {
  "users": <Users size={32} className="stat-icon" />,
  "trophy": <Trophy size={32} className="stat-icon" />,
  "money": <DollarSign size={32} className="stat-icon" />,
  "shield": <Shield size={32} className="stat-icon" />,
  "activity": <Activity size={32} className="stat-icon" />
};

export default function StatsBar() {
  const { data, loading } = useLiveData();
  
  // Extract total_user and online_user from the API payload
  const totalUser = data?.guild_data?.total_user;
  const onlineUser = data?.guild_data?.online_user;

  // Helper to intelligently override dummy data with live data when it's available
  const getLiveTitle = (stat: any) => {
    if (stat.icon === "users") {
      if (totalUser !== undefined) {
        const rounded = Math.floor(totalUser / 100) * 100;
        return `${rounded.toLocaleString()}+`;
      }
      return stat.title;
    }
    if (stat.icon === "trophy") {
      return "100+";
    }
    if (stat.icon === "activity") {
      return "24/7";
    }
    return stat.title;
  };

  const getSubtitle = (stat: any) => {
    if (stat.icon === "activity") {
      return "ACTIVE COMMUNITY";
    }
    return stat.subtitle;
  };

  return (
    <section className="stats-section">
      <div className="container stats-container">
        {statsData.map((stat) => (
          <div key={stat.id} className="stat-item">
            <div className="stat-icon-wrapper">
              {iconMap[stat.icon]}
            </div>
            <div className="stat-info">
              <h3 className="stat-title heading-primary">
                {loading && stat.icon === "users" ? "..." : getLiveTitle(stat)}
              </h3>
              <p className="stat-subtitle">{getSubtitle(stat)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
