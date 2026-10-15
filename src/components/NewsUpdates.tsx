import { newsData } from "../data/dummyData";
import Link from "next/link";

export default function NewsUpdates() {
  return (
    <section className="news-section" id="news">
      <div className="container">
        <div className="section-header space-between">
          <h2 className="heading-primary section-title">LATEST NEWS & UPDATES</h2>
          <Link href="#all-news" className="view-all-link">VIEW ALL</Link>
        </div>
        
        <div className="news-grid">
          {newsData.map((news) => (
            <div key={news.id} className="news-card">
              <div className="news-image">
                <img src={news.image} alt={news.title} />
              </div>
              <div className="news-content">
                <span className="news-date">{news.date}</span>
                <h4 className="news-title">{news.title}</h4>
                <p className="news-desc">{news.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
