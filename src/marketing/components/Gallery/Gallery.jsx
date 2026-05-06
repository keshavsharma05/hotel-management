import React, { useRef, useState } from "react";
import { useHotel } from "../../../services/HotelContext";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import "./Gallery.css";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const Gallery = () => {
  const itemsRef = useRef([]);
  const sectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const { currentHotel } = useHotel();
  const [mobilePage, setMobilePage] = useState(0);

  // ✅ SAFE DATA
  const galleryItems = currentHotel?.gallery?.slice(0, 13) || [];

  // ✅ HELPERS
  const getImg = (i) =>
    galleryItems[i]?.url || `https://placehold.co/600x400?text=Image+${i + 1}`;

  const getAlt = (i) =>
    galleryItems[i]?.category || "Gallery Image";

  const getCategory = (i) =>
    galleryItems[i]?.category || "Property";

  // ✅ TOUCH HANDLERS
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) {
      setMobilePage((prev) => Math.min(1, prev + 1));
    } else if (diff < -50) {
      setMobilePage((prev) => Math.max(0, prev - 1));
    }
  };

  // ✅ GSAP
  useEffect(() => {
    if (!currentHotel || !currentHotel.gallery) return;

    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {

      if (isMobile) {
        itemsRef.current.forEach((el) => {
          if (!el) return;

          gsap.fromTo(
            el,
            { x: 100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      } else {
        gsap.set(itemsRef.current, { opacity: 0, y: 60 });

        gsap.to(itemsRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      }

      setTimeout(() => ScrollTrigger.refresh(), 300);
    });

    return () => ctx.revert();
  }, [currentHotel]);

  // ✅ SAFE RENDER GUARD
  if (!currentHotel || !currentHotel.gallery) return null;
  return (
    <section className="gallery-section" id="gallery" ref={sectionRef}>
      <div className="gallery-header">
        <span className="gallery-label">GALLERY</span>
        <h2 className="gallery-title">A glimpse into your stay</h2>
        <p className="gallery-subtitle">
          Spaces designed for comfort. Details that make it<br />
          memorable. Moments that stay with you.
        </p>
      </div>

      <div 
        className="gallery-mobile-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="gallery-grid" style={{ "--mobile-page": mobilePage }}>
          {[...Array(13)].map((_, i) => (
            <div
  key={i}
  ref={(el) => (itemsRef.current[i] = el)}
  className={`gallery-item row${Math.floor(i < 4 ? 1 : i < 8 ? 2 : 3)}-col${(i < 4 ? i + 1 : i < 8 ? i - 3 : i - 7)}`}
> 
              <img src={getImg(i)} alt={getAlt(i)} />
              <div className="gallery-overlay">
                <span className="category-tag">{getCategory(i)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="gallery-mobile-nav">
        <button 
          className="gallery-nav-btn" 
          onClick={() => setMobilePage(Math.max(0, mobilePage - 1))}
          disabled={mobilePage === 0}
        >
          <RiArrowLeftSLine />
        </button>
        <span className="gallery-nav-dots">
          <span className={`dot ${mobilePage === 0 ? 'active' : ''}`} onClick={() => setMobilePage(0)}></span>
          <span className={`dot ${mobilePage === 1 ? 'active' : ''}`} onClick={() => setMobilePage(1)}></span>
        </span>
        <button 
          className="gallery-nav-btn" 
          onClick={() => setMobilePage(Math.min(1, mobilePage + 1))}
          disabled={mobilePage === 1}
        >
          <RiArrowRightSLine />
        </button>
      </div>
    </section>
  );
};

export default Gallery;