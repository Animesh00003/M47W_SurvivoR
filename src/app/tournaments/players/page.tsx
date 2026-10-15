import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TournamentPlayers from "@/components/TournamentPlayers";
import "../../tournament-details.css";

export default function TournamentPlayersPage() {
  return (
    <main className="tour-details-page">
      <Header />
      <TournamentPlayers />
      <Footer />
    </main>
  );
}
