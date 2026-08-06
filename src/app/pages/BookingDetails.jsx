import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHotel } from '../../services/HotelContext';
import { getBookingById, getRooms } from '../../services/api';
import { hotels } from '../../data/hotelsData';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiUserLine,
  RiHotelLine,
  RiPhoneLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiInformationLine,
  RiWhatsappLine
} from 'react-icons/ri';
import './BookingDetails.css';

const BookingDetails = () => {
  const { hotelId } = useHotel();
  const hotelData = hotels[hotelId || 'theluxuryinn'];
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [roomImage, setRoomImage] = useState(null);

  const handleCopyId = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
        
        if (data) {
          // 1. Try to find the image in booking details first
          let imageFound = data.details?.[0]?.image || null;

          if (!imageFound) {
            // Determine the clean room name/category
            const cleanRoomName = data.details?.[0]?.name || data.roomName || data.type;
            
            if (cleanRoomName) {
              // 2. Local Fallback Search in hotelsData
              const matchedRoom = hotelData?.rooms?.find(
                r => r.name.toLowerCase() === cleanRoomName.toLowerCase() ||
                     cleanRoomName.toLowerCase().includes(r.name.toLowerCase())
              );
              if (matchedRoom?.image) {
                imageFound = matchedRoom.image;
              } else {
                const matchedCat = hotelData?.roomCategories?.find(
                  c => c.name.toLowerCase() === cleanRoomName.toLowerCase() ||
                       cleanRoomName.toLowerCase().includes(c.name.toLowerCase())
                );
                if (matchedCat?.images?.[0]) {
                  imageFound = matchedCat.images[0];
                }
              }
              
              // 3. Remote/API Fallback Search (handles dynamic/custom database rooms)
              try {
                const rooms = await getRooms();
                if (Array.isArray(rooms)) {
                  const matchedDbRoom = rooms.find(
                    r => r.name.toLowerCase() === cleanRoomName.toLowerCase() ||
                         cleanRoomName.toLowerCase().includes(r.name.toLowerCase())
                  );
                  if (matchedDbRoom?.image) {
                    imageFound = matchedDbRoom.image;
                  }
                }
              } catch (apiErr) {
                console.error('Error fetching rooms for image matching:', apiErr);
              }
            }
          }
          
          setRoomImage(imageFound);
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, hotelData]);

  const calculateNights = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  // Status Helpers for consistent lifecycle UI
  const isCompleted = (status) => status === 'Completed' || status === 'Checked Out';
  const isCancelled = (status) => status === 'Cancelled';

  const handleAction = (action) => {
    alert(`${action} feature coming soon!`);
  };

  if (loading) {
    return (
      <div className="booking-details-page">
        <Navbar />
        <div className="container loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching your booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-page">
        <Navbar />
        <div className="container error-container">
          <div className="error-card">
            <h1>Booking Not Found</h1>
            <p>We couldn't find the booking with ID: <strong>{bookingId}</strong></p>
            <Link to="/profile" className="btn-primary">Back to Profile</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const isUpcoming = new Date(booking.checkIn) > new Date() && booking.status !== 'Cancelled';

  return (
    <div className={`booking-details-page theme-${hotelId || 'theluxuryinn'}`}>
      <Navbar forceSolid={false} />

      <div 
        className="booking-details-header"
        style={{ 
          backgroundImage: `url(${hotelData?.heroImage || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop'})`
        }}
      >
        <div className="hero-overlay-cinematic"></div>
        <div className="container header-container-surgical">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <RiArrowLeftLine /> Back to Profile
          </button>
          <div className="header-meta-details">
            <span className="details-badge-pill">Reservation Details</span>
            <h1 className="details-title-serif">Your Reservation #{booking.id.split('-')[0].toUpperCase()}</h1>
          </div>
        </div>
      </div>

      <div className="container booking-details-content">
        <div className="details-grid">
          {/* Main Info Column */}
          <div className="details-main">
            {/* SUMMARY CARD */}
            <div className="details-card summary-card">
              <div className="status-banner">
                <span className={`status-tag ${isCancelled(booking.status) ? 'cancelled' : isCompleted(booking.status) ? 'completed' : 'confirmed'}`}>
                  {isCompleted(booking.status) ? 'Completed' : booking.status || 'Confirmed'}
                </span>
                <span className="booking-id-label">ID: {booking.id}</span>
              </div>
              <div className="summary-header">
                <div className="room-image-preview">
                  {roomImage ? (
                    <img src={roomImage} alt="Room" />
                  ) : (
                    <div className="image-placeholder"><RiHotelLine /></div>
                  )}
                </div>
                <div className="summary-title">
                  <h2>
                    {booking.type ||
                      (Array.isArray(booking.details) && booking.details.length
                        ? booking.details.map(d => `${Math.max(1, Number(d.quantity || 1))}x ${d.name}`).join(', ')
                        : booking.roomName) ||
                      'Premium Room'}
                  </h2>
                  <div className="summary-meta">
                    <span className="hotel-name">Cozy Inn</span>
                    <span className="separator"></span>
                    <span className="booking-status-text">
                      {isCompleted(booking.status) ? 'Completed Stay' : 'Active Reservation'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="summary-footer">
                <div className="booking-pin">
                  <span className="pin-label">CONFIRMATION NUMBER</span>
                  <div className="pin-value-container">
                    <span className="pin-value">{booking.id.split('-')[0].toUpperCase()}</span>
                    <button 
                      className={`copy-btn-action-mini ${copied ? 'copied' : ''}`}
                      onClick={handleCopyId}
                      title="Copy Confirmation Number"
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STAY DETAILS CARD */}
            <div className="details-card">
              <div className="card-header">
                <RiCalendarLine />
                <h3>Stay Details</h3>
              </div>
              <div className="card-body stay-grid">
                <div className="stay-item">
                  <span className="label">Check-in</span>
                  <span className="value">{booking.checkIn}</span>
                  <span className="sub-label">From 2:00 PM</span>
                </div>
                <div className="stay-divider">
                  <span className="nights-tag">{nights} {nights > 1 ? 'Nights' : 'Night'}</span>
                </div>
                <div className="stay-item">
                  <span className="label">Check-out</span>
                  <span className="value">{booking.checkOut}</span>
                  <span className="sub-label">Before 11:00 AM</span>
                </div>
              </div>
            </div>

            {/* ROOM INFORMATION CARD */}
            <div className="details-card">
              <div className="card-header">
                <RiHotelLine />
                <h3>Room Information</h3>
              </div>
              <div className="card-body info-list">
                <div className="info-item room-info-highlight">
                  <div className="info-icon primary-icon"><RiHotelLine /></div>
                  <div className="info-text">
                    <div className="label-with-status">
                      <span className="label">Room Assignment</span>
                      {booking.roomNo ? (
                        <span className="status-badge-mini assigned">SECURE</span>
                      ) : (
                        <span className="status-badge-mini pending">PENDING</span>
                      )}
                    </div>
                    <div className="value-with-icon">
                      {booking.roomNo ? (
                        <span className="room-assigned-value">{booking.roomNo}</span>
                      ) : (
                        <span className="room-not-assigned-value">Not assigned yet</span>
                      )}
                    </div>
                    {!booking.roomNo && <p className="help-text-mini">Your premium room is being prepared for your arrival.</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* GUEST DETAILS CARD */}
            <div className="details-card">
              <div className="card-header">
                <RiUserLine />
                <h3>Guest Information</h3>
              </div>
              <div className="card-body info-list">
                <div className="info-item">
                  <div className="info-icon"><RiUserLine /></div>
                  <div className="info-text">
                    <span className="label">Guest Name</span>
                    <span className="value">{booking.guest || 'Valued Guest'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><RiPhoneLine /></div>
                  <div className="info-text">
                    <span className="label">Phone Number</span>
                    <span className="value">{booking.phone}</span>
                  </div>
                </div>
                {booking.email && (
                  <div className="info-item">
                    <div className="info-icon"><RiMailLine /></div>
                    <div className="info-text">
                      <span className="label">Email Address</span>
                      <span className="value">{booking.email}</span>
                    </div>
                  </div>
                )}
                <div className="info-item">
                  <div className="info-icon"><RiUserLine /></div>
                  <div className="info-text">
                    <span className="label">Total Guests</span>
                    <span className="value">{booking.guests ? `${booking.guests} Adults` : '2 Adults'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="details-sidebar">
            {/* PAYMENT SUMMARY */}
            <div className="details-card payment-card">
              <div className="card-header">
                <RiMoneyDollarCircleLine />
                <h3>Payment Summary</h3>
              </div>
              <div className="card-body">
                <div className="payment-items-list">
                  {booking.details && booking.details.map((item, idx) => (
                    <div key={idx} className="price-row item-breakdown">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty-nights">
                          {item.quantity} {item.quantity > 1 ? 'Rooms' : 'Room'} × {nights} {nights > 1 ? 'Nights' : 'Night'}
                        </span>
                      </div>
                      <div className="price-calculation-end">
                        <span className="calculation-text">
                          {item.quantity} × ${item.price} × {nights} {nights > 1 ? 'nights' : 'night'}
                        </span>
                        <span className="item-row-price-total">
                          ${item.price * item.quantity * nights}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="price-row">
                    <span>Service Fee & Taxes</span>
                    <span>$50</span>
                  </div>
                </div>

                <div className="price-row total-row">
                  <div className="total-label-group">
                    <span>Total Amount</span>
                    <span className="payment-method">Paid via Online Payment</span>
                  </div>
                  <span className="total-amount-value">${booking.total || booking.totalPrice || '0'}</span>
                </div>

                <div className="payment-badge-container">
                  <div className="payment-status-pill">
                    <span className="indicator paid"></span>
                    <span>SUCCESSFULLY PAID</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="booking-actions-vertical">
              {!isCompleted(booking.status) && (
                <a href="tel:+1234567890" className="btn-action-large btn-call">
                  <RiPhoneLine /> Call Reception
                </a>
              )}
              <button className="btn-action-large btn-whatsapp" onClick={() => handleAction('WhatsApp')}>
                <RiWhatsappLine /> WhatsApp Support
              </button>
              {isUpcoming && !isCompleted(booking.status) && (
                <button className="btn-action-large btn-cancel-detail" onClick={() => handleAction('Cancel')}>
                  Cancel Booking
                </button>
              )}
              {(isCompleted(booking.status) || booking.status === 'Completed') && (
                <button className="btn-action-large btn-rebook" onClick={() => handleAction('Rebook')}>
                  Book Again
                </button>
              )}
            </div>

            <div className="help-box">
              <RiInformationLine />
              <p>Need to make changes to your stay? Please contact our reception desk directly.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetails;
