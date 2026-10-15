import { galleryData } from "../data/dummyData";
import Link from "next/link";

export default function Gallery() {
  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header space-between">
          <h2 className="heading-primary section-title">COMMUNITY GALLERY</h2>
          <Link href="#all-gallery" className="view-all-link">VIEW ALL</Link>
        </div>
        
        <div className="gallery-grid">
          {galleryData.map((img, index) => (
            <div key={index} className={`gallery-item ${index === 0 ? 'large-item' : ''}`}>
              <img src={img} alt={`Community Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
