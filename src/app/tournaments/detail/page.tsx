import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TournamentDetails from "@/components/TournamentDetails";
import "../../tournament-details.css";

export default function TournamentPage() {
  return (
    <main className="tour-details-page">
      <Header />
      <TournamentDetails />
      <Footer />
    </main>
  );
}

