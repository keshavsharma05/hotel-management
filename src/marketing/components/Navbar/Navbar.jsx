import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotel } from '../../../services/HotelContext';
import { useAuth } from '../../../services/AuthContext';
import { getCart } from '../../../services/api';
import { RiUserLine } from 'react-icons/ri';
import AuthModal from '../../../app/components/AuthModal/AuthModal';
import './Navbar.css';

const Navbar = ({ forceSolid = false }) => {
  const { currentHotel, hotelId } = useHotel();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50 || forceSolid);
    };

    // Initial check
    if (forceSolid) setScrolled(true);

    window.addEventListener('scroll', handleScroll);

    const updateCount = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cart-updated', updateCount);
    updateCount();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (!currentHotel) return null;

  const formatName = (name) => {
    if (!name.includes('&')) return name;
    const [first, ...rest] = name.split('&');
    return (
      <>
        {first.trim()} <span className="nav-logo-break">& {rest.join('&').trim()}</span>
      </>
    );
  };

  return (
    <>
      <nav className={`navbar ${scrolled || forceSolid ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link 
            to="/" 
            className="logo"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img src="/images/hotel-property/logo.png" alt="Hotel Logo" className="nav-logo-img" />
            {formatName(currentHotel.name.toUpperCase())}
          </Link>
          <div className="nav-links">
            <Link 
              to="/" 
              className="nav-link"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >Home</Link>
            <Link to="/app" className="nav-link">Rooms</Link>
            <Link to="/gallery" className="nav-link">
              Gallery
            </Link>
          </div>

          <div className="nav-actions">
            <button
              className={`profile-icon-btn ${user ? 'logged-in' : ''}`}
              onClick={handleProfileClick}
              title={user ? `Profile (${user.phoneNumber})` : 'Login'}
            >
              <RiUserLine />
              {user && <span className="online-dot"></span>}
            </button>
            <Link to={`/app/booking`} className="btn-primary nav-btn">
              Book Now {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;

