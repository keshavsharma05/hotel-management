import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../../../services/HotelContext';
import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowRightLine ,RiUserLine, RiCheckboxBlankLine, RiDropLine} from 'react-icons/ri';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RoomsPreview.css';

gsap.registerPlugin(ScrollTrigger);

const RoomsPreview = () => {
  const { hotelId, currentHotel } = useHotel();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);

  const roomCategories = currentHotel?.roomCategories || [];

  const [activeIndex, setActiveIndex] = useState(0);

  // Section Entrance Animation (runs when data is loaded)
  useEffect(() => {
    if (!roomCategories || roomCategories.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        defaults: { ease: "power2.out", duration: 0.5 }
      });

      tl.from(".story-label", {
        y: 20,
        opacity: 0,
      })
      .fromTo(".story-nav-btn", 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          clearProps: "all" 
        }, 
        "-=0.3"
      )
      .fromTo(".story-slide:first-child .story-room-name", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, clearProps: "all" },
        "-=0.3"
      )
      .fromTo(".story-slide:first-child .story-divider", 
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, clearProps: "all" },
        "-=0.3"
      )
      .fromTo(".story-slide:first-child .spec-item", 
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, clearProps: "all" },
        "-=0.2"
      )
      .fromTo(".story-slide:first-child .feature-item", 
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, clearProps: "all" },
        "-=0.2"
      )
      .fromTo(".story-slide:first-child .story-explore-btn", 
        { y: 15, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          clearProps: "all" 
        }, 
        "-=0.2"
      )
      .fromTo(".story-slide:first-child .story-bento-grid", 
        { scale: 0.95, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          clearProps: "all"
        }, 
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [currentHotel, roomCategories.length]);

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
    <section className="rooms-story-slider" ref={sectionRef}>
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

                {/* DESKTOP ONLY PROGRESS LINES */}
                <div className="story-footer-meta desktop-progress">
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

      <div className="story-nav-layer">
        <div className="story-controls">
          <button className="story-nav-btn" onClick={() => scroll('left')}><RiArrowLeftSLine /></button>
          
          <div className="story-progress-lines global-progress">
            {roomCategories.map((_, i) => (
              <div key={i} className={`progress-line ${i === activeIndex ? 'active' : ''}`}></div>
            ))}
          </div>

          <button className="story-nav-btn" onClick={() => scroll('right')}><RiArrowRightSLine /></button>
        </div>
      </div>
    </section>
  );
};

export default RoomsPreview;