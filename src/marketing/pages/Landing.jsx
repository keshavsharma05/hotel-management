import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import RoomsPreview from '../components/RoomsPreview/RoomsPreview';
import Gallery from '../components/Gallery/Gallery';
import History from '../components/History/History';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';
import Preloader from '../../app/components/Preloader/Preloader';

const Landing = () => {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="landing-page">
      {showIntro && (
        <Preloader
          onComplete={() => {
            setShowIntro(false);
          }}
        />
      )}
      <Hero />
      <RoomsPreview />
      <Features />
      <Gallery />
      <History />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
