import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './styles/global.css';

// Marketing Pages
import Landing from './marketing/pages/Landing';
import GalleryPage from './marketing/pages/GalleryPage';

// App Pages
import Rooms from './app/pages/Rooms';
import Booking from './app/pages/Booking';
import Success from './app/pages/Success';
import ProfileDashboard from './app/pages/ProfileDashboard';
import BookingDetails from './app/pages/BookingDetails';

// Admin Pages
import Dashboard from './app/admin/Dashboard';
import ManageRooms from './app/admin/ManageRooms';
import ManageBookings from './app/admin/ManageBookings';
import QRScanner from './app/admin/QRScanner';
import AdminLayout from './app/admin/AdminLayout';
import AdminLogin from './app/admin/AdminLogin';

// Auth components
import { AuthProvider } from './services/AuthContext';
import { HotelProvider } from './services/HotelContext';
import ProtectedRoute from './app/components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip simple app loader on landing page so the premium preloader is shown immediately
    if (window.location.pathname === '/') {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
  const images = Array.from(document.images);

  let loaded = 0;
  const total = images.length;

  if (total === 0) {
    setIsLoading(false);
    return;
  }

  const handleDone = () => {
    loaded++;
    if (loaded === total) {
      setIsLoading(false);
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      handleDone();
    } else {
      img.addEventListener("load", handleDone);
      img.addEventListener("error", handleDone);
    }
  });

  // safety fallback (because internet is unreliable, like group projects)
  const timeout = setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  return () => clearTimeout(timeout);
}, []);

  if (isLoading) {
  return (
    <div className="loader">
      <div className="loader__spinner"></div>
      <p>Loading experience...</p>
    </div>
  );
}
  return (
    <AuthProvider>
      <HotelProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/gallery" element={<GalleryPage />} />

            <Route path="/app" element={<Rooms />} />
            <Route path="/app/booking" element={<Booking />} />
            <Route path="/app/success" element={<Success />} />

            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/profile/booking/:bookingId" element={<BookingDetails />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="scan-qr" element={<QRScanner />} />
            </Route>

          </Routes>
        </Router>
      </HotelProvider>
    </AuthProvider>
  );
}

export default App;

