import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TournamentsList from "@/components/TournamentsList";
import "../tournaments.css"; // Ensure this matches the correct path (app/tournaments.css)

export default function TournamentsPage() {
  return (
    <main className="tournaments-page">
      <Header />
      <TournamentsList />
      <Footer />
    </main>
  );
}
