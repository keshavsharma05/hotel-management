import React, { useEffect, useRef, useState } from 'react';
import { useHotel } from '../../../services/HotelContext';
import gsap from 'gsap';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const { currentHotel } = useHotel();
  const [progress, setProgress] = useState(0);
  
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const bgImageRef = useRef(null);

  const hotelName = currentHotel?.name || "The Luxury Inn";
  const hotelLocation = currentHotel?.location || "London, UK";

  // Simulate progress loading smoothly
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 4) + 2; 
      current = Math.min(100, current + increment);
      setProgress(current);

      if (current === 100) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Handle GSAP intro and continuous ambient effects
  useEffect(() => {
    // Hide components initially for a coordinated GSAP entrance
    gsap.set([".preloader-logo", ".preloader-brand", ".preloader-progress-section"], {
      opacity: 0,
      y: 20
    });
    
    gsap.set(bgImageRef.current, {
      scale: 1.0,
      opacity: 0
    });

    const introTl = gsap.timeline();
    introTl.to(bgImageRef.current, {
      opacity: 0.12,
      duration: 1.5,
      ease: "power2.out"
    })
    .to(".preloader-logo", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1.0")
    .to(".preloader-brand", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .to(".preloader-progress-section", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");

    // Ken Burns effect (slowly zooming background image)
    gsap.to(bgImageRef.current, {
      scale: 1.15,
      duration: 8,
      ease: "sine.out"
    });

  }, []);

  // Trigger the premium single panel slide-up once progress is complete
  useEffect(() => {
    if (progress === 100) {
      const exitTl = gsap.timeline({
        onComplete: onComplete
      });

      // 1. Gently fade content out and slide it up slightly
      exitTl.to(contentRef.current, {
        opacity: 0,
        y: -40,
        duration: 0.5,
        ease: "power2.inOut"
      });

      // 2. Slide the main container (#C5A998) up smoothly as a single sheet
      exitTl.to(containerRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut"
      }, "-=0.2");
    }
  }, [progress, onComplete]);

  // Helper to format the hotel name dynamically with a break if it has '&'
  const formatName = (name) => {
    if (!name.includes('&')) return name;
    const [first, ...rest] = name.split('&');
    return (
      <>
        {first.trim()} <span className="preloader-logo-break">& {rest.join('&').trim()}</span>
      </>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="preloader-container" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Background Image - Inspired by the Hero background style */}
      {currentHotel?.heroImage && (
        <div 
          ref={bgImageRef}
          className="preloader-hero-bg"
          style={{ backgroundImage: `url(${currentHotel.heroImage})` }}
        ></div>
      )}
      
      {/* Ambient luxury background glow & vignette */}
      <div className="preloader-ambient-glow"></div>
      <div className="preloader-vignette"></div>
      
      <div className="preloader-content" ref={contentRef}>
        {/* Official Brand Emblem/Logo */}
        <div className="preloader-logo-wrapper">
          <img 
            src="/images/hotel-property/logo.png" 
            alt={hotelName} 
            className="preloader-logo" 
          />
        </div>

        {/* Branding Typography */}
        <div className="preloader-brand">
          <h1 className="preloader-title">
            {formatName(hotelName.toUpperCase())}
          </h1>
          <p className="preloader-subtitle">{hotelLocation.toUpperCase()}</p>
        </div>

        {/* Progress Metrics */}
        <div className="preloader-progress-section">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-percentage">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
