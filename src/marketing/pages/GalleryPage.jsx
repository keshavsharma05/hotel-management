import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Gallery from '../components/Gallery/Gallery';
import Footer from '../components/Footer/Footer';

const GalleryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gallery-page" style={{ backgroundColor: '#f5f0eb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar forceSolid={true} />
      <div style={{ flex: 1, paddingTop: '80px' }}>
        <Gallery />
      </div>
      <Footer />
    </div>
  );
};

export default GalleryPage;
