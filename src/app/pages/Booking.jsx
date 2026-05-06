import React, { useState, useEffect } from 'react';
// OLD CODE
// import { useNavigate, Link } from 'react-router-dom';
// NEW CODE
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useHotel } from '../../services/HotelContext';
import { useAuth } from '../../services/AuthContext';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
import BookingForm from '../components/BookingForm/BookingForm';
import AuthModal from '../components/AuthModal/AuthModal';
// OLD CODE
// import { getCart, createBooking, removeFromCart, updateCartQuantity, getAvailableRoomsByCategory } from '../../services/api';
// NEW CODE
import { getCart, createBooking, removeFromCart, updateCartQuantity, getAvailableRoomsByCategory, getRoomById, getRooms, addToCart, clearCart } from '../../services/api';
import { RiArrowLeftLine, RiDeleteBin6Line, RiAddLine, RiSubtractLine, RiInformationLine, RiHistoryLine } from 'react-icons/ri';
import './Booking.css';

const Booking = () => {
  const { hotelId, currentHotel } = useHotel();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingDates, setBookingDates] = useState(() => {
    const saved = localStorage.getItem('selectedDates');
    if (saved) return JSON.parse(saved);
    return { checkIn: '', checkOut: '' };
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchCartAndAvailability = async () => {
      const allCart = getCart();
      // Cart items already have hotelId: HOTEL_ID stamped by addToCart
      setCart(allCart);
      
      const checkIn = bookingDates.checkIn || new Date().toISOString().split('T')[0];
      const checkOut = bookingDates.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const avails = await getAvailableRoomsByCategory(checkIn, checkOut);
      const availMap = {};
      avails.forEach(a => { availMap[a.id || a._id] = a.isAvailable ? 1 : 0; });
      setAvailability(availMap);

      const fetchedRooms = await getRooms();
      setAllRooms(fetchedRooms);
      
      setLoading(false);
    };
    
    fetchCartAndAvailability();
    window.addEventListener('cart-updated', fetchCartAndAvailability);
    return () => window.removeEventListener('cart-updated', fetchCartAndAvailability);
  }, [bookingDates.checkIn, bookingDates.checkOut]);

  // Check auth requirement
  useEffect(() => {
    if (!loading && !user && cart.length > 0) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, loading, cart.length]);

  const calculateNights = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = calculateNights(bookingDates.checkIn, bookingDates.checkOut);

  const handleIncrement = (item) => {
    const max = availability[item.id] !== undefined ? availability[item.id] : 1;
    if (item.quantity < max) {
      updateCartQuantity(item.id, item.quantity + 1);
    }
  };

  const handleBookingSubmit = async (formData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    const dailySubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPrice = (dailySubtotal * nights) + 50;
    const roomBreakdown = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    try {
      // Book the whole cart as a single reservation using category breakdown.
      // Backend will allocate available room units per category/quantity.
      const details = cart.map(item => ({
        id: item._id || item.id,
        name: item.name,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      }));
      const res = await createBooking({ 
        guest: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        guests: Number(formData.guests),
        details,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut
      });

      if (res.success) {
        // After a successful booking, clear cart so navbar badge + booking page reset.
        clearCart();
        setCart([]);
        navigate(`/app/success`, { state: { bookingId: res.booking.id, roomName: roomBreakdown } });
      } else {
        setError(res.message || 'Failed to create booking. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('A system error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading Selection...</div>;

  if (cart.length === 0) {
    return (
      <div className={`booking-page-container theme-${hotelId}`}>
        <Navbar forceSolid={false} />
        
        <div className="booking-header-hero" style={{ 
          backgroundImage: `url(${currentHotel?.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh'
        }}>
          <div className="hero-overlay-cinematic" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))' }}></div>
          <div className="container hero-content-surgical" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            paddingTop: '60px',
            textAlign: 'center'
          }}>
            <h2 className="editorial-title-hero" style={{ fontSize: '48px', marginBottom: '20px' }}>Your Cart is Empty</h2>
            <p className="editorial-subtitle-hero" style={{ fontSize: '14px', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.8' }}>
              You haven't selected any rooms yet. Discover our curated collection and reserve your stay at {currentHotel?.name}.
            </p>
            <Link to={`/app`} className="btn-primary" style={{ padding: '16px 40px', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              BROWSE ROOMS
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * nights;

  return (
    <div className={`booking-page-container theme-${hotelId}`}>
      <Navbar forceSolid={false} />
      
      <div className="booking-header-hero" style={{ 
        backgroundImage: `url(${currentHotel?.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="hero-overlay-cinematic"></div>
        <div className="container hero-content-surgical">
          <h1 className="editorial-title-hero">Complete Your Reservation</h1>
          <p className="editorial-subtitle-hero">
            AT {currentHotel.name.split(' ')[0]} <span>{currentHotel.name.split(' ').slice(1).join(' ')}</span> — {currentHotel?.location}
          </p>
        </div>
      </div>

      <section className="section booking-content">
        <div className="container booking-grid">
          <div className="booking-form-section">
            {error && <div className="error-banner mb-20">{error}</div>}
            <BookingForm 
              cart={cart} 
              bookingDates={bookingDates}
              onDateChange={setBookingDates}
              onSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          
          <div className="booking-info-section">
            <div className="selection-summary-card">
              <h3>Your Selection {nights > 1 && `(${nights} Nights)`}</h3>
              <div className="selection-list">
                {cart.map(item => {
                  const max = availability[item.id] !== undefined ? availability[item.id] : 1;
                  const isMax = item.quantity >= max;
                  return (
                    <div key={item.id} className="selection-item-premium">
                      <div className="item-img-wrapper">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details-premium">
                        <h4>{item.name}</h4>
                        <div className="price-calc-row">
                          <span className="unit-calc">{item.quantity} × ${item.price}{nights > 1 ? ` × ${nights}` : ''}</span>
                          <span className="calc-divider"></span>
                          <span className="row-total">${item.price * item.quantity * nights}</span>
                        </div>
                        <div className="item-controls-v2">
                          <span className="added-badge-v2" style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>✓ ADDED</span>
                          <button className="item-remove-v2" onClick={() => removeFromCart(item.id)} title="Remove Selection" style={{ marginLeft: 'auto' }}>
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="selection-footer">
                <div className="subtotal">
                  <span>Subtotal {nights > 1 && `(${nights} Nights)`}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="fees">
                  <span>Service Fee</span>
                  <span>$50</span>
                </div>
                <div className="total-grand">
                  <span>Total Bill</span>
                  <span>${subtotal + 50}</span>
                </div>
              </div>
              
              {allRooms.length > cart.length && (
                <div className="suggested-rooms-container">
                  <h4 className="suggested-rooms-title">Available to Add</h4>
                  <div className="suggested-rooms-list">
                    {allRooms
                      .filter(room => !cart.some(c => c.id === room.id || c._id === room._id || c.name === room.name))
                      .slice(0, 3)
                      .map(room => (
                        <div key={room.id || room._id} className="suggested-room-mini">
                          <img src={room.image} alt={room.name} />
                          <div className="srm-details">
                            <span className="srm-name">{room.name}</span>
                            <span className="srm-price">+${room.price}/night</span>
                          </div>
                          <button className="srm-add-btn" onClick={() => addToCart(room)}>
                            <RiAddLine /> Add
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Booking;
