import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../../../services/HotelContext';
import { FaArrowRight } from 'react-icons/fa';
import './CTA.css';

const CTA = () => {
  const navigate = useNavigate();
  const { hotelId, currentHotel } = useHotel();

  if (!currentHotel) return null;

  // Use the principal hotel image for the CTA background
  const bgImage = currentHotel.gallery && currentHotel.gallery.length > 0 
    ? currentHotel.gallery[0].url 
    : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80';

  return (
    <section className={`cta-cinematic theme-${hotelId}`}>
      <div className="cta-backdrop">
        <img src={bgImage} alt="Hotel Background" className="cta-bg-img" />
        <div className="cta-overlay"></div>
      </div>
      
      <div className="cta-wrapper">
        <div className="cta-editorial">
          <span className="cta-tagline">EXPERIENCE THE EXTRAORDINARY</span>
          <h2 className="cta-headline">
            Begin Your Journey at <br />
            <span className="highlight">{currentHotel.name}</span>
          </h2>
          <p className="cta-description">
            Discover a world where curated luxury meets bespoke service. <br />
            Your sanctuary in {currentHotel.location} awaits.
          </p>
          
          <div className="cta-actions-cinematic">
            <button className="book-btn-premium" onClick={() => navigate(`/app`)}>
              RESERVE YOUR STAY <FaArrowRight />
            </button>
            <button className="contact-btn-link">CONTACT CONCIERGE</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
