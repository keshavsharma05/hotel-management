import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import RoomsPreview from '../components/RoomsPreview/RoomsPreview';
import Gallery from '../components/Gallery/Gallery';
import History from '../components/History/History';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

const Landing = () => {
  const location = useLocation();

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
