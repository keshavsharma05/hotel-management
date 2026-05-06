import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHotel } from '../../services/HotelContext';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
// OLD CODE
// import { getRoomById, addToCart, getCart, getAvailableRoomsByCategory } from '../../services/api';
// NEW CODE
import { getRoomById, getAvailableRoomsByCategory } from '../../services/api';
import { FaCheck, FaArrowLeft, FaStar } from 'react-icons/fa';
import './RoomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const { hotelId, currentHotel } = useHotel();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);

  // OLD CODE
  /*
  useEffect(() => {
    if (hotelId && id) {
      setLoading(true);
      
      // Get today's dates for availability check (mock)
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      Promise.all([
        getRoomById(hotelId, id),
        getAvailableRoomsByCategory(hotelId, today, tomorrow)
      ]).then(([roomData, allAvailable]) => {
        setRoom(roomData);
        
        // Find availability for this specific category
        const availInfo = allAvailable.find(a => String(a.id) === String(id));
        if (availInfo) setAvailableQty(availInfo.availableQty);

        // Sync quantity with cart
        const cart = getCart();
        const item = cart.find(i => String(i.id) === String(id) && i.hotelId === hotelId);
        if (item) setQuantity(item.quantity);
        
        setLoading(false);
      });
    }
  }, [id, hotelId]);

  const handleAddToCart = () => {
    if (room && hotelId && quantity < availableQty) {
      addToCart(room, hotelId);
      setQuantity(prev => prev + 1);
    }
  };
  */

  // NEW CODE
  const [isUnavailable, setIsUnavailable] = useState(false);

  // NEW CODE
  useEffect(() => {
    if (id) {
      setLoading(true);

      const storedDates = localStorage.getItem('bookingDates');
      let checkIn = new Date().toISOString().split('T')[0];
      let checkOut = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      if (storedDates) {
        try {
          const parsed = JSON.parse(storedDates);
          if (parsed.checkIn && parsed.checkOut) {
            checkIn = parsed.checkIn;
            checkOut = parsed.checkOut;
          }
          } catch (e) {
            console.warn('[RoomDetails] Failed to parse bookingDates');
          }
      }

      Promise.all([
        getRoomById(id),
        getAvailableRoomsByCategory(checkIn, checkOut)
      ]).then(([roomData, availableRoomsArray]) => {
        setRoom(roomData);
        if (availableRoomsArray && Array.isArray(availableRoomsArray)) {
          const availRoom = availableRoomsArray.find(r => String(r._id) === String(id) || String(r.id) === String(id));
          if (availRoom && availRoom.isAvailable === false) {
            setIsUnavailable(true);
          } else {
            setIsUnavailable(false);
          }
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBookNow = () => {
    navigate(`/app/booking`, { state: { roomId: id } });
  };

  if (loading) return <div className="loading">Loading room details...</div>;
  if (!room || !currentHotel) return <div className="error">Room not found.</div>;

  // OLD CODE
  // const isLimitReached = quantity >= availableQty;

  return (
    <div className={`room-details-page theme-${hotelId}`}>
      <Navbar forceSolid={true} />
      
      <div className="room-details-header">
        <div className="container">
          <button className="btn-back-minimal" onClick={() => navigate(`/app`)}>
            <FaArrowLeft className="icon-left" /> Back to Rooms
          </button>
        </div>
      </div>

      <section className="section room-showcase">
        <div className="container showcase-container">
          <div className="showcase-images">
            <div className="main-image">
              <img src={room.image} alt={room.name} />
            </div>
            <div className="thumb-images">
              {(currentHotel.gallery || [])
                .filter(img => {
                  const nameLower = room.name.toLowerCase();
                  if (nameLower.includes('double')) return ['Double Room', 'Cozy Corner', 'Room Features'].includes(img.category);
                  if (nameLower.includes('balcony')) return ['Balcony View', 'Terrace Life', 'Breathtaking Views'].includes(img.category);
                  if (nameLower.includes('king')) return ['King Suite', 'Suite Details', 'Modern Living'].includes(img.category);
                  return true;
                })
                .slice(0, 3)
                .map((img, i) => (
                  <img key={i} src={img.url} alt={`${room.name} detail ${i + 1}`} />
                ))}
            </div>
          </div>
          
          <div className="showcase-content">
            <div className="showcase-header">
              <span className="room-type-tag">{room.capacity} Guests</span>
              <div className="room-rating">
                <FaStar /> {room.rating || '4.8'}
              </div>
            </div>
            <h1 className="room-title">{room.name}</h1>
            <p className="room-price-detail">${room.price} <span>/ night</span></p>
            
            <div className="room-specs-minimal">
              <span className="spec-val-big">{currentHotel.roomTypeFeatures?.[room.name]?.size || '11 m²'}</span>
              <span className="spec-divider"></span>
              <span className="spec-label-big">Living Space</span>
            </div>

            <p className="room-description-full">{room.description}</p>
            
            <div className="amenities-section">
              <h3>Room Amenities</h3>
              <div className="amenities-list">
                {(currentHotel.roomTypeFeatures?.[room.name]?.fullDetails || []).map((amenity, i) => (
                  <div key={i} className="amenity-detail">
                    <FaCheck className="check-icon" /> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* OLD CODE
            <div className="booking-cta-box">
              <div className="cta-actions">
                <button 
                  className={`btn-primary ${isLimitReached ? 'btn-disabled' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isLimitReached}
                >
                  {isLimitReached ? 'Limit Reached' : quantity > 0 ? `Add More (${quantity})` : 'Add to Selection'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate(`/app/booking`)}
                >
                  Checkout Now
                </button>
              </div>
              <p className="cta-note">
                {isLimitReached 
                  ? 'Maximum capacity reaching for these dates.' 
                  : 'Flexible cancellation • No hidden fees'}
              </p>
            </div>
            */}

            {/* NEW CODE */}
            <div className="booking-cta-premium">
              {isUnavailable ? (
                <button 
                  className="btn-unavailable"
                  onClick={() => alert('You will be notified when this room becomes available.')}
                >
                  NOTIFY ME WHEN AVAILABLE
                </button>
              ) : (
                <button 
                  className="btn-book-premium"
                  onClick={handleBookNow}
                >
                  RESERVE THIS ROOM
                </button>
              )}
              <p className="cta-note-premium">
                {isUnavailable ? 'Currently unavailable for selected dates' : 'Flexible cancellation • No hidden fees'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoomDetails;
