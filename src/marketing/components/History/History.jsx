import React from 'react';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './History.css';

gsap.registerPlugin(ScrollTrigger);

const History = () => {
  const sectionRef = useRef(null);
const imageRef = useRef(null);
const contentRef = useRef(null);
  useEffect(() => {
  const isMobile = window.innerWidth <= 768;

  const ctx = gsap.context(() => {

    // 👇 set initial state (IMPORTANT)
    gsap.set(imageRef.current, { scale: 1.1, opacity: 0 });
    gsap.set(contentRef.current.children, { y: 40, opacity: 0 });

    // 👇 timeline (clean sequencing)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      }
    });

    // IMAGE animation
    tl.to(imageRef.current, {
      scale: 1,
      opacity: 1,
      duration: isMobile ? 0.8 : 1.4,
      ease: "power3.out",
    });

    // TEXT animation (staggered)
    tl.to(
      contentRef.current.children,
      {
        y: 0,
        opacity: 1,
        duration: isMobile ? 0.6 : 1,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.8" // overlap slightly with image
    );

  });

  return () => ctx.revert();
}, []);
  return (
    <section className="history-section" id="history" ref={sectionRef}>
      <div className="history-container">
        <div className="history-layout">
          <div className="history-visuals">
            <div className="image-main-wrapper">
              <img 
                  ref={imageRef}
                  src="/images/hotel-property/history.jpg" 
                  alt="Industrial Heritage" 
                  className="history-main-img" 
                />
            </div>
          </div>
          
          <div className="history-content" ref={contentRef}>
            <span className="history-label">THE STORY</span>
            <h2 className="history-headline">Industrial Soul, <br/>Modern Spirit</h2>
            <div className="history-copy">
              <p className="history-p1">
                Situated along the serene Lake View Road in the vibrant heart of Jaipur, Rajasthan.
              </p>
              <div className="history-body">
                <p>
                  The rich heritage of the Pink City perfectly complements the warm, welcoming atmosphere of our property.
                </p>
                <p>
                  Thoughtfully furnished with unique design details, 
                  Cozy Inn retains an air of traditional charm blended with modern comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;
