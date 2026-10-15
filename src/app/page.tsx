import Header from "../components/Header";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import Tournaments from "../components/Tournaments";
import NewsUpdates from "../components/NewsUpdates";
import Gallery from "../components/Gallery";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="landing-page">
      <Header />
      <Hero />
      <StatsBar />
      <Tournaments />
      <CallToAction />
      <Footer />
    </main>
  );
}
