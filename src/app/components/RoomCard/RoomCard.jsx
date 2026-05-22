import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, updateCartQuantity, getCart } from '../../../services/api';
import { useHotel } from '../../../services/HotelContext';
import { RiStarFill } from 'react-icons/ri';
import { BiArea } from 'react-icons/bi';
import { FaUserFriends, FaBed } from 'react-icons/fa';
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
import { RiSubtractLine, RiAddLine } from 'react-icons/ri';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className={`room-card-premium theme-${hotelId} ${isExpanded ? 'expanded' : ''} ${isUnavailable ? 'unavailable' : ''}`}>
      <div className="room-card-media" onClick={() => navigate(`/app/room/${room.id || room._id}`)}>
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
        <h3 className="room-name-title" onClick={() => navigate(`/app/room/${room.id || room._id}`)}>
          {room.name}
        </h3>

        <div className="room-mini-specs">
          <div className="mini-spec-item">
            <BiArea /> <span>{roomSize}</span>
          </div>
          <div className="mini-spec-icons">
            {roomMeta.icons?.slice(1, 5).map((iconKey, idx) => (
              <span key={idx} className="spec-icon-hit">{ICON_MAP[iconKey]}</span>
            ))}
          </div>
        </div>

        <button
          className="btn-toggle-details"
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        >
          {isExpanded ? 'Hide details' : 'View more details'}
          {isExpanded ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
        </button>

        <div className={`room-expanded-details ${isExpanded ? 'show' : ''}`}>
          <div className="details-divider"></div>
          <ul className="full-amenities-list">
            {roomDetails.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>

        <div className="room-card-actions-premium">
          <div className="action-divider"></div>
          <div className="card-actions-grid">
            <button className="view-details-action-btn" onClick={() => navigate(`/app/room/${room.id || room._id}`)}>
              VIEW DETAILS
            </button>

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
    </div>
  );
};

export default RoomCard;
