import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useHotel } from '../../services/HotelContext';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
import { 
  RiCheckboxCircleFill, 
  RiCalendarCheckLine, 
  RiTimeLine, 
  RiQrCodeLine, 
  RiHotelBedLine, 
  RiPrinterLine, 
  RiArrowRightLine, 
  RiHashtag, 
  RiUser3Line, 
  RiMoneyDollarCircleLine, 
  RiMapPin2Line, 
  RiFileCopyLine,
  RiCheckLine
} from 'react-icons/ri';
import './Success.css';

const Success = () => {
  const { hotelId, currentHotel } = useHotel();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Try to load booking from router state or fallback to localStorage
  const stateBooking = location.state?.booking;
  const stateRoomName = location.state?.roomName;
  const stateBookingId = location.state?.bookingId;

  let booking = stateBooking;
  let roomName = stateRoomName;
  let bookingId = stateBookingId;

  if (!booking) {
    const saved = localStorage.getItem('latestBooking');
    if (saved) {
      try {
        booking = JSON.parse(saved);
        bookingId = booking.id;
        roomName = booking.roomName;
      } catch (e) {
        console.error('Error parsing latest booking from localStorage:', e);
      }
    }
  }

  // Final fallbacks for display stability
  bookingId = bookingId || 'BK-SAMPLE';
  roomName = roomName || 'Superior Double Room';
  const checkInDate = booking?.checkIn || new Date().toISOString().split('T')[0];
  const checkOutDate = booking?.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guestsCount = booking?.guests || 2;
  const totalBill = booking?.total || '370';
  const qrCodeUrl = booking?.qrCodeUrl;

  const handleCopyId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`success-page-container theme-${hotelId || 'theluxuryinn'}`}>
      <Navbar forceSolid={true} />
      
      <section className="section success-content">
        <div className="container success-inner">
          
          {/* Header & Status Section */}
          <div className="success-header text-center">
            <div className="status-badge-container">
              <span className="success-completed-badge">
                <RiCheckboxCircleFill /> REGISTRATION COMPLETED
              </span>
            </div>
            <h1 className="success-title">Your Stay is Confirmed</h1>
            <p className="success-subtitle">
              We look forward to welcoming you at <strong>{currentHotel?.name || 'Cozy Inn'}</strong>. 
              A digital receipt and key details have been sent to your email.
            </p>
          </div>

          {/* Cinematic Layout Grid */}
          <div className="success-grid">
            
            {/* COLUMN 1: Booking & Reservation details */}
            <div className="success-card details-column">
              <div className="card-header-premium">
                <h3>Reservation Details</h3>
                <span className="stay-badge-pill">Confirmed</span>
              </div>
              
              <div className="details-list-premium">
                
                {/* Booking ID */}
                <div className="detail-row-premium booking-id-row">
                  <div className="row-label">
                    <RiHashtag className="row-icon" />
                    <span>Booking ID</span>
                  </div>
                  <div className="row-value-wrapper">
                    <strong className="booking-id-text">#{bookingId}</strong>
                    <button 
                      className={`copy-btn-action ${copied ? 'copied' : ''}`} 
                      onClick={handleCopyId}
                      title="Copy Booking ID"
                    >
                      {copied ? <RiCheckLine style={{ color: '#10B981' }} /> : <RiFileCopyLine />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Hotel Location */}
                <div className="detail-row-premium">
                  <div className="row-label">
                    <RiMapPin2Line className="row-icon" />
                    <span>Destination</span>
                  </div>
                  <div className="row-value">
                    <span>{currentHotel?.location || 'New York, USA'}</span>
                  </div>
                </div>

                {/* Room Name */}
                <div className="detail-row-premium">
                  <div className="row-label">
                    <RiHotelBedLine className="row-icon" />
                    <span>Selected Room</span>
                  </div>
                  <div className="row-value">
                    <strong>{roomName}</strong>
                  </div>
                </div>

                {/* Guest Capacity */}
                <div className="detail-row-premium">
                  <div className="row-label">
                    <RiUser3Line className="row-icon" />
                    <span>Guests</span>
                  </div>
                  <div className="row-value">
                    <span>{guestsCount} {guestsCount > 1 ? 'Guests' : 'Guest'}</span>
                  </div>
                </div>

                {/* Total Paid */}
                <div className="detail-row-premium">
                  <div className="row-label">
                    <RiMoneyDollarCircleLine className="row-icon" />
                    <span>Amount Paid</span>
                  </div>
                  <div className="row-value total-paid-val">
                    <strong>${totalBill}</strong>
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="stay-timeline-card">
                  <div className="timeline-point">
                    <div className="timeline-icon-wrap checkin">
                      <RiCalendarCheckLine />
                    </div>
                    <div className="timeline-details">
                      <span className="timeline-label">CHECK-IN</span>
                      <strong className="timeline-date">{formatDate(checkInDate)}</strong>
                      <span className="timeline-time"><RiTimeLine /> From 2:00 PM</span>
                    </div>
                  </div>

                  <div className="timeline-connector"></div>

                  <div className="timeline-point">
                    <div className="timeline-icon-wrap checkout">
                      <RiCalendarCheckLine />
                    </div>
                    <div className="timeline-details">
                      <span className="timeline-label">CHECK-OUT</span>
                      <strong className="timeline-date">{formatDate(checkOutDate)}</strong>
                      <span className="timeline-time"><RiTimeLine /> Before 11:00 AM</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMN 2: Contactless Pass / QR Code */}
            <div className="success-card qr-column text-center">
              <div className="card-header-premium justify-center">
                <RiQrCodeLine className="qr-title-icon" />
                <h3>Contactless Check-In</h3>
              </div>
              
              <p className="qr-description">
                Skip the front desk queue! Use this digital pass to directly check in using our contactless lobby terminals or smart locks.
              </p>

              <div className="qr-code-wrapper-premium">
                {qrCodeUrl ? (
                  <div className="qr-scanner-frame">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <img src={qrCodeUrl} alt="Check-In QR Code" className="qr-image-actual" />
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                ) : (
                  <div className="qr-placeholder-luxury">
                    <RiQrCodeLine size={64} className="spinning-placeholder" />
                    <span>Generating check-in pass...</span>
                  </div>
                )}
                <div className="scan-instructions-badge">
                  <span>SHOW AT RECEPTION</span>
                </div>
              </div>

              <div className="qr-expiry-info">
                <span className="indicator-dot-pulse"></span>
                <span>Active until Checkout: <strong>{formatDate(checkOutDate)}</strong></span>
              </div>
            </div>

          </div>

          {/* Action Navigation Controls */}
          <div className="success-navigation text-center">
            <div className="action-buttons-wrap">
              <Link to="/profile" className="btn-primary-action btn-manage-bookings">
                <span>Manage Bookings</span>
                <RiArrowRightLine />
              </Link>
              <button className="btn-secondary-action btn-print-receipt" onClick={() => window.print()}>
                <RiPrinterLine />
                <span>Print Confirmation</span>
              </button>
            </div>
            
            <div className="back-link-wrapper">
              <Link to="/" className="btn-link-back">Return to Homepage</Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Success;


