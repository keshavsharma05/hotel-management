import React, { useRef } from 'react';
import { useHotel } from '../../../services/HotelContext';
import { FaQuoteLeft } from 'react-icons/fa';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import './Testimonials.css';

const Testimonials = () => {
  const { currentHotel } = useHotel();
  const scrollRef = useRef(null);

  if (!currentHotel) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - (clientWidth * 0.8) 
        : scrollLeft + (clientWidth * 0.8);
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header-centered">
          <span className="testimonials-label">GUEST STORIES</span>
          <h2 className="testimonials-title">The words that stay</h2>
          <p className="testimonials-subtitle">
            Unforgettable moments shared by our community.
          </p>
        </div>

        <div className="testimonials-scroll-container">
          <div className="testimonials-track" ref={scrollRef}>
            {currentHotel.testimonials.map((t) => (
              <div key={t.id} className="testimonial-slide">
                <div className="testimonial-card-premium">
                  <div className="card-top">
                    <FaQuoteLeft className="premium-quote-icon" />
                    <div className="premium-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (t.rating || 5) ? 'dot active' : 'dot'}></span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="premium-content">{t.content}</p>
                  
                  <div className="premium-author">
                    <img 
                      src={t.avatar || `https://i.pravatar.cc/150?u=${t.name}`} 
                      alt={t.name} 
                      className="premium-avatar" 
                    />
                    <div className="premium-info">
                      <h4 className="premium-name">{t.name}</h4>
                      <p className="premium-role">{t.role || 'Guest'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-controls">
            <button className="control-btn prev" onClick={() => scroll('left')} aria-label="Previous">
          <RiArrowLeftSLine />
            </button>
            <button className="control-btn next" onClick={() => scroll('right')} aria-label="Next">
          <RiArrowRightSLine />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
