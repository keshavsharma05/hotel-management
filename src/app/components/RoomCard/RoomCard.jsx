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
import './RoomCard.css';

// FIX 1: Added tooltip labels for every icon
const ICON_MAP = {
  Area:    { icon: <BiArea />,              label: 'Room Area' },
  Users:   { icon: <FaUserFriends />,       label: 'Guests' },
  Bed:     { icon: <FaBed />,              label: 'Bed Type' },
  Bath:    { icon: <MdOutlineBathtub />,   label: 'Bathtub' },
  Wind:    { icon: <MdOutlineAir />,       label: 'Air Conditioning' },
  Shower:  { icon: <MdOutlineShower />,    label: 'Shower' },
  Fire:    { icon: <MdOutlineWhatshot />,  label: 'Heating' },
  Window:  { icon: <MdOutlineWindow />,    label: 'Window View' },
  Layers:  { icon: <MdOutlineLayers />,    label: 'Floor' },
  Closet:  { icon: <MdOutlineMeetingRoom />, label: 'Wardrobe' },
};

const RoomCard = ({ room, hotelId }) => {
  const navigate = useNavigate();
  const { currentHotel } = useHotel();

  // FIX 2: isExpanded is now local to each card — no cross-card height bleed
  const [isExpanded, setIsExpanded] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  const roomMeta = currentHotel?.roomTypeFeatures?.[room.name] || {};
  const roomSize = roomMeta.size || room.size || '11 m²';
  const roomDetails = roomMeta.fullDetails || room.features || [];
  const isUnavailable = room.isAvailable === false;

  // FIX 3: Smarter category label — use room type instead of always "LUXURY COLLECTION"
  const getCategoryLabel = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('suite'))   return 'SUITE';
    if (n.includes('superior')) return 'SUPERIOR';
    if (n.includes('deluxe'))  return 'DELUXE';
    if (n.includes('standard')) return 'STANDARD';
    if (n.includes('budget'))  return 'BUDGET FRIENDLY';
    return 'LUXURY COLLECTION';
  };

  useEffect(() => {
    const updateCartState = () => {
      const cart = getCart();
      const item = cart.find(
        i => (i._id === (room.id || room._id) || i.id === (room.id || room._id)) && i.hotelId === hotelId
      );
      setCartItem(item || null);
    };
    updateCartState();
    window.addEventListener('cart-updated', updateCartState);
    return () => window.removeEventListener('cart-updated', updateCartState);
  }, [room, hotelId]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(room, hotelId);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    updateCartQuantity(room.id || room._id, 0);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/app/room/${room.id || room._id}`);
  };

  const handleGoToBooking = (e) => {
    e.stopPropagation();
    navigate(`/app/booking`);
  };

  return (
    // FIX 4: Removed grid-level height coupling — card is fully self-contained
    <div className={`room-card-premium theme-${hotelId} ${isUnavailable ? 'unavailable' : ''}`}>

      {/* IMAGE SECTION */}
      <div className="room-card-media" onClick={handleViewDetails}>
        <img src={room.image} alt={room.name} className="room-main-img" />
        <div className="room-card-overlay"></div>

        {/* FIX 5: Price now shows $ — change back to $ if targeting international */}
        <div className="room-card-floating-price">
          <span className="price-val">${room.price.toLocaleString('en-IN')}</span>
          <span className="per-night">/ night</span>
        </div>

        <div className="room-card-rating-float">
          <RiStarFill />
          <span>{room.rating || '4.8'}</span>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="room-card-info">

        {/* FIX 6: Dynamic category label */}
        <div className="room-category-label">{getCategoryLabel(room.name)}</div>

        <h3 className="room-name-title" onClick={handleViewDetails}>
          {room.name}
        </h3>

        {/* FIX 7: Icons now have tooltip titles so users know what each means */}
        <div className="room-mini-specs">
          <div className="mini-spec-item" title="Room Area">
            <BiArea /> <span>{roomSize}</span>
          </div>
          <div className="mini-spec-icons">
            {roomMeta.icons?.slice(1, 5).map((iconKey, idx) => {
              const entry = ICON_MAP[iconKey];
              if (!entry) return null;
              return (
                <span key={idx} className="spec-icon-hit" title={entry.label}>
                  {entry.icon}
                </span>
              );
            })}
          </div>
        </div>

        {/* FIX 8: Toggle button — expand is self-contained, doesn't affect sibling cards */}
        <button
          className="btn-toggle-details"
          onClick={(e) => { e.stopPropagation(); setIsExpanded(prev => !prev); }}
        >
          {isExpanded ? 'Hide details' : 'View more details'}
          {isExpanded ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
        </button>

        {/* FIX 9: Expanded details only affect THIS card's height — no siblings affected */}
        {isExpanded && roomDetails.length > 0 && (
          <div className="room-expanded-details show">
            <div className="details-divider"></div>
            <ul className="full-amenities-list">
              {roomDetails.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTIONS */}
        <div className="room-card-actions-premium">
          <div className="action-divider"></div>
          <div className="card-actions-grid">

            {/* Secondary CTA — view details (ghost button) */}
            <button className="view-details-action-btn" onClick={handleViewDetails}>
              VIEW DETAILS
            </button>

            {/* Primary CTA — changes based on state */}
            {isUnavailable ? (
              <button
                className="add-room-action-btn notify-btn"
                onClick={(e) => { e.stopPropagation(); alert('You will be notified when this room becomes available.'); }}
              >
                NOTIFY ME
              </button>

            ) : cartItem ? (
              // FIX 10: When selected — show two micro actions: go to booking or deselect
              <div className="selected-actions-row">
                <button
                  className="add-room-action-btn selected-btn"
                  onClick={handleGoToBooking}
                  title="Proceed to booking"
                >
                  SELECTED ✓
                </button>
                <button
                  className="deselect-btn"
                  onClick={handleRemoveFromCart}
                  title="Remove from selection"
                >
                  ✕
                </button>
              </div>

            ) : (
              <button className="add-room-action-btn" onClick={handleAddToCart}>
                ADD TO BOOKING
              </button>
            )}

          </div>

          {/* FIX 11: Hint text under actions so user knows what happens next */}
          {cartItem && (
            <p className="cart-hint-text">
              Click "SELECTED ✓" to review and confirm your booking
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;