import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, updateCartQuantity, getCart } from '../../../services/api';
import { useHotel } from '../../../services/HotelContext';
import { RiStarFill, RiSubtractLine, RiAddLine, RiCloseLine } from 'react-icons/ri';
import { BiArea } from 'react-icons/bi';
import { FaUserFriends, FaBed, FaCheck } from 'react-icons/fa';
import {
  MdOutlineBathtub,
  MdOutlineAir,
  MdOutlineShower,
  MdOutlineWhatshot,
  MdOutlineWindow,
  MdOutlineLayers,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineMeetingRoom
} from 'react-icons/md';
import './RoomCard.css';

const ICON_MAP = {
  Area: <BiArea />,
  Users: <FaUserFriends />,
  Bed: <FaBed />,
  Bath: <MdOutlineBathtub />,
  Wind: <MdOutlineAir />,
  Shower: <MdOutlineShower />,
  Fire: <MdOutlineWhatshot />,
  Window: <MdOutlineWindow />,
  Layers: <MdOutlineLayers />,
  Closet: <MdOutlineMeetingRoom />
};

const RoomCard = ({ room, hotelId }) => {
  const navigate = useNavigate();
  const { currentHotel } = useHotel();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const roomMeta = currentHotel?.roomTypeFeatures?.[room.name] || {};
  const roomSize = roomMeta.size || room.size || '11 m²';
  const roomDetails = roomMeta.fullDetails || room.features || [];
  const isUnavailable = room.isAvailable === false;
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const updateCartState = () => {
      const cart = getCart();
      const item = cart.find(i => (i._id === (room.id || room._id) || i.id === (room.id || room._id)) && i.hotelId === hotelId);
      setCartItem(item || null);
    };
    updateCartState();
    window.addEventListener('cart-updated', updateCartState);
    return () => window.removeEventListener('cart-updated', updateCartState);
  }, [room, hotelId]);

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/app/booking`);
  };

  return (
    <div className={`room-card-premium theme-${hotelId} ${isUnavailable ? 'unavailable' : ''}`}>
      <div className="room-card-media">
        <img src={room.image} alt={room.name} className="room-main-img" />
        <div className="room-card-overlay"></div>

        <div className="room-card-floating-price">
          <span className="price-val">${room.price}</span>
          <span className="per-night">/ night</span>
        </div>

        <div className="room-card-rating-float">
          <RiStarFill />
          <span>{room.rating || '4.8'}</span>
        </div>
      </div>

      <div className="room-card-info">
        <div className="room-category-label">LUXURY COLLECTION</div>
        <h3 className="room-name-title">
          {room.name}
        </h3>

        <div className="room-capsule-specs">
          <span className="spec-capsule">
            <BiArea /> {roomSize}
          </span>
          <span className="spec-capsule">
            <FaUserFriends /> {room.capacity || 2} Guests
          </span>
          {roomMeta.icons?.includes('Bed') && (
            <span className="spec-capsule">
              <FaBed /> {room.name.includes('Twin') ? '2 Beds' : '1 Bed'}
            </span>
          )}
          {roomMeta.icons?.includes('Bath') && (
            <span className="spec-capsule">
              <MdOutlineBathtub /> Bath
            </span>
          )}
          {!roomMeta.icons?.includes('Bath') && roomMeta.icons?.includes('Shower') && (
            <span className="spec-capsule">
              <MdOutlineShower /> Shower
            </span>
          )}
          {roomMeta.icons?.includes('Wind') && (
            <span className="spec-capsule">
              <MdOutlineAir /> AC
            </span>
          )}
        </div>

        <button
          className="btn-toggle-details"
          onClick={(e) => { e.stopPropagation(); setIsOverlayOpen(true); }}
        >
          View more details
          <MdOutlineKeyboardArrowDown />
        </button>

        <div className="room-card-actions-premium">
          <div className="action-divider"></div>
          <div className="card-actions-grid">
            {isUnavailable ? (
              <button className="add-room-action-btn notify-btn" onClick={(e) => { e.stopPropagation(); alert('You will be notified when this room becomes available.'); }}>
                NOTIFY ME
              </button>
            ) : cartItem ? (
              <button 
                className="add-room-action-btn selected-btn" 
                onClick={(e) => { e.stopPropagation(); updateCartQuantity(room.id || room._id, 0); }}
                style={{ background: '#4CAF50', color: 'white', borderColor: '#4CAF50' }}
              >
                SELECTED ✓
              </button>
            ) : (
              <button className="add-room-action-btn" onClick={(e) => { e.stopPropagation(); addToCart(room, hotelId); }}>
                BOOK NOW
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slide-up Details Overlay */}
      <div className={`room-card-details-overlay ${isOverlayOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn-close-details-overlay" 
          onClick={(e) => { e.stopPropagation(); setIsOverlayOpen(false); }}
          aria-label="Close details"
        >
          <RiCloseLine />
        </button>
        
        <div className="overlay-header">
          <div className="room-category-label">LUXURY DETAILS</div>
          <h3 className="overlay-room-name">{room.name}</h3>
          
          <div className="overlay-mini-specs">
            <div className="overlay-spec-item">
              <BiArea /> <span>{roomSize}</span>
            </div>
            <div className="overlay-spec-item">
              <FaUserFriends /> <span>{room.capacity || 2} Guests</span>
            </div>
            {roomMeta.icons?.includes('Bed') && (
              <div className="overlay-spec-item">
                <FaBed /> <span>{room.name.includes('Twin') ? '2 Beds' : '1 Bed'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="overlay-body">
          <div className="overlay-section">
            <h4>Description</h4>
            <p className="overlay-description-text">
              {room.description || 'Enjoy a premium, curated stay experience with state-of-the-art facilities and luxury comfort design.'}
            </p>
          </div>
          
          <div className="overlay-section">
            <h4>Amenities</h4>
            <ul className="overlay-amenities-list">
              {roomDetails.map((detail, idx) => (
                <li key={idx}>
                  <FaCheck className="overlay-check-icon" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overlay-footer">
          <div className="overlay-action-divider"></div>
          <div className="overlay-actions-grid">
            {isUnavailable ? (
              <button 
                className="overlay-add-room-btn notify-btn" 
                onClick={(e) => { e.stopPropagation(); alert('You will be notified when this room becomes available.'); }}
              >
                NOTIFY ME
              </button>
            ) : cartItem ? (
              <button 
                className="overlay-add-room-btn selected-btn" 
                onClick={(e) => { e.stopPropagation(); updateCartQuantity(room.id || room._id, 0); }}
                style={{ background: '#4CAF50', color: 'white', borderColor: '#4CAF50' }}
              >
                SELECTED ✓
              </button>
            ) : (
              <button 
                className="overlay-add-room-btn" 
                onClick={(e) => { e.stopPropagation(); addToCart(room, hotelId); }}
              >
                BOOK NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
