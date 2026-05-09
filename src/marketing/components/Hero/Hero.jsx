import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../../../services/HotelContext";
import gsap from "gsap";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const { currentHotel, hotelId } = useHotel();

  // Date states
  const [dates, setDates] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  // GSAP refs
  const bgRef = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const availRef = useRef(null);

  // GSAP animation
  useEffect(() => {
    if (!currentHotel) return;

    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3
      });

      // background
      tl.fromTo(
        bgRef.current,
        { scale: 1.1 },
        { scale: 1, duration: isMobile ? 1 : 2 }
      );

      // nav
      tl.from(
        navRef.current,
        {
          y: -40,
          opacity: 0,
          duration: isMobile ? 0.6 : 1,
        },
        "-=1.5"
      );

      // content (tag and title only to avoid double animating availability box)
      tl.from(
        [".hero__tag", ".hero__title"],
        {
          y: 50,
          opacity: 0,
          stagger: 0.15,
          duration: isMobile ? 0.6 : 1,
        },
        "-=1.2"
      );

      // availability box (using fromTo to ensure it ends up at opacity 1)
      tl.fromTo(
        availRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
        },
        "-=0.8"
      );

      if (!isMobile) {
        tl.from(
          scrollRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 1,
          },
          "-=0.8"
        );
      }
    });

    return () => ctx.revert();
  }, [currentHotel]);

  if (!currentHotel) return null;

  const handleAvailabilityCheck = () => {
    localStorage.setItem('selectedDates', JSON.stringify(dates));
    navigate('/app');
  };

  const formatName = (name) => {
    if (!name.includes("&")) return name;
    const [first, ...rest] = name.split("&");
    return (
      <>
        {first.trim()}{" "}
        <span className="hero__logo-break">
          & {rest.join("&").trim()}
        </span>
      </>
    );
  };

  return (
    <section className="hero">
      {/* Background */}
      <div
        ref={bgRef}
        className="hero__bg"
        style={{ backgroundImage: `url(${currentHotel.heroImage})` }}
      ></div>

      {/* Navbar */}
      <div className="hero__nav" ref={navRef}>
        <div className="hero__menu">
          <img
            src="/images/hotel-property/logo.png"
            alt="Hotel Logo"
            className="hero__logo-img"
          />
          {formatName(currentHotel.name.toUpperCase())}
        </div>

        <button
          type="button"
          className="hero__enquire"
          onClick={() => navigate(`/app`)}
        >
          BOOK NOW
        </button>
      </div>

      {/* Content */}
      <div className="hero__content" ref={contentRef}>
        <p className="hero__tag">
          WELCOME TO {currentHotel.name.toUpperCase()}
        </p>

        <h1 className="hero__title">
          Experience a New Way <br /> of Business Stay and Events
        </h1>

        {/* Availability Checker */}
        <div className="hero__availability" ref={availRef}>
          <div className="avail__dates-row">
            <div className="avail__item">
              <label>CHECK IN</label>
              <input 
                type="date" 
                value={dates.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
              />
            </div>
            <div className="avail__divider"></div>
            <div className="avail__item">
              <label>CHECK OUT</label>
              <input 
                type="date" 
                value={dates.checkOut}
                min={dates.checkIn}
                onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
              />
            </div>
          </div>
          <button className="avail__btn" onClick={handleAvailabilityCheck}>
            CHECK AVAILABILITY
          </button>
        </div>
      </div>

      {/* Scroll */}
      <div className="hero__scroll" ref={scrollRef}>
        <div className="scroll__dash"></div>
        <span className="scroll__text">SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
};


export default Hero;