import React from 'react';
import { 
  PiBedLight, 
  PiBellLight, 
  PiHouseLineLight, 
  PiShieldCheckLight, 
  PiPawPrintLight,
  PiWifiHighLight,
  PiUsersThreeLight,
  PiThermometerHotLight,
  PiProhibitLight,
  PiQrCode,
  PiSuitcaseLight,
  PiCoatHangerLight,
  PiReceiptLight,
  PiForkKnifeLight,
  PiTelevisionLight,
  PiFlowerLight,
  PiSparkleLight,
  PiDropLight,
  PiIdentificationBadgeLight,
  PiMonitorLight,
  PiArrowRightLight
} from 'react-icons/pi';
import './Features.css';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const Features = () => {
  const categoryData = [
    {
      id: "comfort",
      title: "COMFORT",
      description: "Everything you need to feel at home.",
      icon: <PiBedLight />,
      amenities: [
        { name: "Free Wi-Fi", icon: <PiWifiHighLight /> },
        { name: "Family Rooms", icon: <PiUsersThreeLight /> },
        { name: "Heating", icon: <PiThermometerHotLight /> },
        { name: "Non-Smoking Rooms", icon: <PiProhibitLight /> }
      ]
    },
    {
      id: "services",
      title: "SERVICES",
      description: "Convenience at every step of your stay.",
      icon: <PiBellLight />,
      amenities: [
        { name: "Contactless Check-in/out", icon: <PiQrCode /> },
        { name: "Luggage Storage", icon: <PiSuitcaseLight /> },
        { name: "Laundry", icon: <PiCoatHangerLight /> },
        { name: "Invoice Provided", icon: <PiReceiptLight /> }
      ]
    },
    {
      id: "spaces",
      title: "SPACES",
      description: "Relax and connect in our shared spaces.",
      icon: <PiHouseLineLight />,
      amenities: [
        { name: "Shared Kitchen", icon: <PiForkKnifeLight /> },
        { name: "Shared Lounge / TV Area", icon: <PiTelevisionLight /> },
        { name: "Garden", icon: <PiFlowerLight /> }
      ]
    },
    {
      id: "safety",
      title: "SAFETY & HYGIENE",
      description: "Your well-being is our priority.",
      icon: <PiShieldCheckLight />,
      amenities: [
        { name: "Sanitized Rooms", icon: <PiSparkleLight /> },
        { name: "Hand Sanitizer", icon: <PiDropLight /> },
        { name: "Staff Safety Protocols", icon: <PiIdentificationBadgeLight /> },
        { name: "CCTV & 24h Security", icon: <PiMonitorLight /> }
      ]
    },
    {
      id: "pets",
      title: "PETS & ACCESS",
      description: "We welcome your furry companions.",
      icon: <PiPawPrintLight />,
      amenities: [
        { name: "Pets Allowed", icon: <PiPawPrintLight /> }
      ]
    }
  ];
const sectionRef = useRef(null);
const blocksRef = useRef([]);
useEffect(() => {
  const ctx = gsap.context(() => {

    blocksRef.current.forEach((el, i) => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // 📱 MOBILE (slide)
        gsap.fromTo(
          el,
          { x: 120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reset",
              invalidateOnRefresh: true,
            },
          }
        );
      } else {
        // 💻 DESKTOP (subtle but visible)
gsap.set(blocksRef.current, { opacity: 0, y: 80 });

gsap.to(blocksRef.current, {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power3.out",
  stagger: 0.2, // 👈 THIS is the magic
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top 80%",
    toggleActions: "play none none reverse",
    invalidateOnRefresh: true,
  },
});
      }
    });

    // refresh after layout settles
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

  });

  return () => ctx.revert();
}, []);
  return (
    <section className="features-section" ref={sectionRef} id="features">
      <div className="features-container">
        
        <header className="features-header">
          <span className="features-tag">AMENITIES & FACILITIES</span>
          <h2 className="features-main-title">Comfort. Convenience. Care.</h2>
          <p className="features-main-desc">
            Thoughtfully designed amenities and facilities to ensure<br />
            a seamless and memorable stay.
          </p>
        </header>

        <div className="features-grid">
          {categoryData.map((category, index) => (
            <div
              key={category.id}
              className="feature-category-column"
              ref={(el) => (blocksRef.current[index] = el)}
            >
              <div className="category-header">
                <div className="category-icon-circle">
                  {category.icon}
                </div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-subtitle">{category.description}</p>
              </div>
              
              <ul className="category-amenities-list">
                {category.amenities.map((amenity, i) => (
                  <li key={i} className="amenity-item">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-name">{amenity.name}</span>
                  </li>
                ))}
              </ul>
              
              {index < categoryData.length - 1 && <div className="column-divider"></div>}
            </div>
          ))}
        </div>



      </div>
    </section>
  );
};

export default Features;
