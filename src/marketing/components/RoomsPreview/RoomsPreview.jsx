import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../../../services/HotelContext';
import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowRightLine ,RiUserLine, RiCheckboxBlankLine, RiDropLine} from 'react-icons/ri';
import './RoomsPreview.css';

const RoomsPreview = () => {
  const { hotelId, currentHotel } = useHotel();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const roomCategories = currentHotel?.roomCategories || [];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    if (index !== activeIndex && index >= 0 && index < roomCategories.length) {
      setActiveIndex(index);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollWidth : scrollWidth,
        behavior: 'smooth'
      });
    }
  };

  if (!roomCategories || roomCategories.length === 0) {
    return null;
  }

  return (
    <section className="rooms-story-slider">
      <div className="story-nav-layer">
        <div className="story-controls">
          <button className="story-nav-btn" onClick={() => scroll('left')}><RiArrowLeftSLine /></button>
          <button className="story-nav-btn" onClick={() => scroll('right')}><RiArrowRightSLine /></button>
        </div>
      </div>

      <div className="story-scroll-track" ref={scrollRef} onScroll={handleScroll}>
        {roomCategories.map((room, index) => (
          <div key={room.id} className="story-slide">
            <div className="story-container">
              {/* LEFT: TEXT DETAILS */}
              <div className="story-text-side">
                <span className="story-label">BOUTIQUE COLLECTION</span>
                <div className="story-content-box">
                  <h2 className="story-room-name">{room.name}</h2>
                  <div className="story-divider"></div>

                  <div className="story-specs">
                    <div className="spec-item">
                      <RiCheckboxBlankLine className="spec-icon" />
                      <span>{room.size}</span>
                    </div>

                    <div className="spec-item">
                      <RiUserLine className="spec-icon" />
                      <span>{room.capacity} Guests</span>
                    </div>

                    <div className="spec-item">
                      <RiDropLine className="spec-icon" />
                      <span>{room.bathroom}</span>
                    </div>
                  </div>

                  <ul className="story-features-list">
                    {room.features.map((feature, idx) => (
                      <li key={idx} className="feature-item">{feature}</li>
                    ))}
                  </ul>

                  <button className="story-explore-btn" onClick={() => navigate(`/app`)}>
                    RESERVE NOW <RiArrowRightLine className="btn-arrow" />
                  </button>
                </div>
                <div className="story-footer-meta">
                  <div className="story-progress-lines">
                    {roomCategories.map((_, i) => (
                      <div key={i} className={`progress-line ${i === activeIndex ? 'active' : ''}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: BENTO IMAGE GRID */}
              <div className="story-image-side" onClick={() => navigate(`/app`)}>
                <div className="story-bento-grid">
                  <div className="bento-main-img">
                    {room.images && room.images.length > 0 && <img src={room.images[0]} alt={room.name} />}
                  </div>
                  <div className="bento-sub-imgs">
                    <div className="bento-sub-img">
                      {room.images && room.images.length > 1 && <img src={room.images[1]} alt={room.name} />}
                    </div>
                    <div className="bento-sub-img">
                      {room.images && room.images.length > 2 && <img src={room.images[2]} alt={room.name} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomsPreview;