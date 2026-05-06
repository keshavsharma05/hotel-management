import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../../../services/HotelContext";
import gsap from "gsap";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const { currentHotel, hotelId } = useHotel();

  // GSAP refs
  const bgRef = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);

  // GSAP animation
  useEffect(() => {
  if (!currentHotel) return;

  const isMobile = window.innerWidth <= 768;

  // small delay so mobile actually sees animation
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.3 // 👈 key fix
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

    // content
    tl.from(
      contentRef.current.children,
      {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: isMobile ? 0.6 : 1,
      },
      "-=1.2"
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
  // Now safe to return
  if (!currentHotel) return null;

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