import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useHotel } from '../../services/HotelContext';
import { getUserBookings } from '../../services/api';
import { hotels } from '../../data/hotelsData';
import Navbar from '../../marketing/components/Navbar/Navbar';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Footer from '../../marketing/components/Footer/Footer';
import { RiHistoryLine, RiUserLine, RiLogoutBoxRLine, RiCalendarLine, RiHotelLine, RiInformationLine, RiPhoneLine, RiMapPinLine, RiWhatsappLine, RiArrowRightSLine, RiQrCodeLine } from 'react-icons/ri';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './ProfileDashboard.css';

const ProfileDashboard = () => {
  const { user, logout } = useAuth();
  const { hotelId } = useHotel();
  const hotelData = hotels[hotelId || 'theluxuryinn'];
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeQrBooking, setActiveQrBooking] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(`/`);
      return;
    }

    const fetchBookings = async () => {
      const data = await getUserBookings(user.phoneNumber);
      // Sort bookings by creation date (newest first)
      const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sortedData);
      setLoading(false);
    };

    fetchBookings();
  }, [user, navigate, hotelId]);

  const handleLogout = () => {
    logout();
    navigate(`/`);
  };

  // Status Helpers for consistent lifecycle UI
  const isActive = (status) => status === 'Confirmed' || status === 'Checked In' || status === 'Booked';
  const isCompleted = (status) => status === 'Completed' || status === 'Checked Out';
  const isCancelled = (status) => status === 'Cancelled';

  if (!user) return null;

  // Logic to separate active and history bookings
  const bookingsArray = Array.isArray(bookings) ? bookings : [];
  const activeBookings = bookingsArray.filter(b => isActive(b.status));
  const pastBookings = bookingsArray.filter(b => isCompleted(b.status) || isCancelled(b.status));
  const bookingsToShow = pastBookings.slice(0, 3); // Latest 3 past bookings

  const handleAction = (action, bookingIdParam) => {
    if (action === 'View Details') {
      navigate(`/profile/booking/${bookingIdParam}`);
      return;
    }
    alert(`${action} feature coming soon!`);
  };

  return (
    <div className={`profile-page-container theme-${hotelId || 'theluxuryinn'}`}>
      <Navbar forceSolid={false} />
      
      <div 
        className="profile-hero-cinematic"
        style={{ backgroundImage: `url(${hotelData?.heroImage || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop'})` }}
      >
        <div className="hero-overlay-surgical"></div>
        <div className="container profile-hero-content">
          <div className="profile-identity-surgical">
            <div className="avatar-wrapper-premium">
              <div className="user-avatar-editorial">
                {user.name ? user.name.charAt(0).toUpperCase() : <RiUserLine />}
              </div>
              <div className="verified-badge-surgical" title="Verified Guest">
                <FaCheck />
              </div>
            </div>

            <div className="user-info-editorial">
              <h1 className="user-name-premium">{user.name || 'Guest Member'}</h1>
              <div className="user-meta-strip">
                <div className="meta-item">
                  <RiPhoneLine />
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="meta-item accent-text">
                  <RiHotelLine />
                  <span>Elite Member</span>
                </div>
              </div>
            </div>

            <button className="btn-logout-surgical" onClick={handleLogout}>
              <RiLogoutBoxRLine /> <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container profile-content-grid">
        {/* ACTIVE BOOKING SECTION */}
        <div className="profile-section-surgical">
          <div className="section-header-editorial">
            <RiCalendarLine className="section-icon-accent" />
            <h2 className="editorial-section-title">Upcoming Stays</h2>
          </div>

          {loading ? (
            <LoadingSpinner text="Establishing connection..." />
          ) : activeBookings.length > 0 ? (
            <div className="active-booking-grid">
              {activeBookings.map(booking => (
                <div key={booking.id} className="active-stay-card-premium">
                  <div className="active-stay-header">
                    <span className="status-badge-premium">{booking.status || 'Confirmed'}</span>
                    <span className="id-badge-premium">REF: #{booking.id.split('-')[1]}</span>
                  </div>
                  <div className="active-stay-main">
                    <h3 className="stay-room-name">
                      {booking.type ||
                        (Array.isArray(booking.details) && booking.details.length
                          ? booking.details.map(d => `${Math.max(1, Number(d.quantity || 1))}x ${d.name}`).join(', ')
                          : booking.roomName) ||
                        'Premium Room'}
                    </h3>
                    <div className="stay-details-surgical">
                      <div className="s-detail">
                        <span className="s-label">CHECK-IN</span>
                        <span className="s-value">{booking.checkIn}</span>
                      </div>
                      <div className="s-detail">
                        <span className="s-label">CHECK-OUT</span>
                        <span className="s-value">{booking.checkOut}</span>
                      </div>
                      <div className="s-detail">
                        <span className="s-label">GUESTS</span>
                        <span className="s-value">{booking.guests ? `${booking.guests} GUESTS` : '2 ADULTS'}</span>
                      </div>
                      <div className="s-detail highlight-orange">
                        <span className="s-label">ROOM</span>
                        <span className="s-value">{booking.roomNo || 'ASSIGNING...'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="active-stay-actions">
                    <button className="btn-action-premium btn-p-primary" onClick={() => handleAction('View Details', booking.id)}>
                      <RiInformationLine /> Details
                    </button>
                    <button className="btn-action-premium btn-p-outline" onClick={() => { setActiveQrBooking(booking); setShowQrModal(true); }}>
                      <RiQrCodeLine /> Check-In QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-surgical">
              <RiCalendarLine className="empty-icon-ghost" />
              <h3>Your journey begins here</h3>
              <p>Start your next chapter at Cozy Inn.</p>
              <button
                className="btn-browse-surgical"
                onClick={() => navigate(`/app`)}
              >
                Discover Collection
              </button>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="profile-section-surgical">
          <div className="section-header-editorial">
            <RiInformationLine className="section-icon-accent" />
            <h2 className="editorial-section-title">Support & Concierge</h2>
          </div>
          <div className="concierge-cards-grid">
            <a href="tel:+1234567890" className="concierge-card-premium">
              <div className="c-icon"><RiPhoneLine /></div>
              <div className="c-info">
                <h4>Direct Line</h4>
                <p>24/7 dedicated service</p>
              </div>
            </a>
            <a href="https://maps.app.goo.gl/YabrAHJz7yqpUcWB6" target="_blank" rel="noopener noreferrer" className="concierge-card-premium">
              <div className="c-icon"><RiMapPinLine /></div>
              <div className="c-info">
                <h4>Directions</h4>
                <p>Locate the property</p>
              </div>
            </a>
            <div className="concierge-card-premium" onClick={() => handleAction('WhatsApp', null)}>
              <div className="c-icon"><RiWhatsappLine /></div>
              <div className="c-info">
                <h4>WhatsApp</h4>
                <p>Instant chat messaging</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING HISTORY */}
        <div className="profile-section-surgical full-row-surgical">
          <div className="section-header-editorial align-between-surgical">
            <div className="s-h-left">
              <RiHistoryLine className="section-icon-accent" />
              <h2 className="editorial-section-title">Stay Archive</h2>
            </div>
            {pastBookings.length > 3 && (
              <button className="btn-view-all-surgical" onClick={() => handleAction('View All', null)}>
                View Full Archive
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner text="Archiving memory..." />
          ) : pastBookings.length > 0 ? (
            <div className="archive-cards-grid">
              {bookingsToShow.map(booking => (
                <div key={booking.id} className="archive-card-premium">
                  <div className="archive-card-main">
                    <div className="archive-room-info">
                      <span className={`archive-status-tag ${isCancelled(booking.status) ? 'cancelled' : 'completed'}`}>
                        {isCompleted(booking.status) ? 'Completed' : booking.status}
                      </span>
                      <h3>
                        {booking.type ||
                          (Array.isArray(booking.details) && booking.details.length
                            ? booking.details.map(d => `${Math.max(1, Number(d.quantity || 1))}x ${d.name}`).join(', ')
                            : booking.roomName) ||
                          'Premium Room'}
                      </h3>
                      <p className="archive-date-text">{booking.checkIn} - {booking.checkOut}</p>
                    </div>
                    <div className="archive-price-surgical">
                      <span className="price-val">${booking.total || booking.totalPrice || booking.amount || '0'}</span>
                    </div>
                  </div>
                  <div className="archive-card-footer">
                    <button className="btn-archive-surgical btn-a-secondary" onClick={() => handleAction('View Details', booking.id)}>
                      Details
                    </button>
                    {!isCancelled(booking.status) && (
                      <button className="btn-archive-surgical btn-a-primary" onClick={() => handleAction('Rebook', booking.id)}>
                        Stay Again
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-archive-state">
              <p>The archive awaits your first story.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {showQrModal && activeQrBooking && (
        <div className="qr-modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => setShowQrModal(false)} aria-label="Close modal">
              <FaTimes />
            </button>
            
            <div className="qr-modal-header-premium">
              <span className="qr-modal-badge">
                <span className="indicator-dot-pulse"></span>
                Contactless Pass
              </span>
              <h3>Check-In Key</h3>
              <p className="qr-modal-tagline">Present this code at reception or scan at lobby kiosks for direct entry.</p>
            </div>

            <div className="qr-modal-pass-body">
              <div className="qr-modal-code-wrap">
                {activeQrBooking.qrCodeUrl ? (
                  <div className="qr-scanner-frame-mini">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <img src={activeQrBooking.qrCodeUrl} alt="Check-In QR" className="qr-modal-image-actual" />
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                ) : (
                  <p className="qr-unavailable">QR Code not available.</p>
                )}
                <div className="scan-instructions-badge-mini">
                  <span>SHOW AT RECEPTION</span>
                </div>
              </div>

              <div className="qr-modal-info-card">
                <div className="info-card-row">
                  <span className="card-lbl">REF NUMBER</span>
                  <strong className="card-val">#{activeQrBooking.id.split('-')[0].toUpperCase()}</strong>
                </div>
                <div className="info-card-row">
                  <span className="card-lbl">GUEST</span>
                  <span className="card-val">{activeQrBooking.guest || 'Valued Guest'}</span>
                </div>
                <div className="info-card-row">
                  <span className="card-lbl">ACCOMMODATION</span>
                  <strong className="card-val room-highlight">{activeQrBooking.roomName || 'Premium Room'}</strong>
                </div>
                {activeQrBooking.roomNo && (
                  <div className="info-card-row">
                    <span className="card-lbl">ROOM ASSIGNED</span>
                    <strong className="card-val room-num-highlight">{activeQrBooking.roomNo}</strong>
                  </div>
                )}
              </div>

              <div className="qr-modal-stay-grid">
                <div className="stay-grid-item">
                  <span className="sg-lbl">CHECK-IN</span>
                  <strong className="sg-val">{activeQrBooking.checkIn}</strong>
                  <span className="sg-sub">From 2:00 PM</span>
                </div>
                <div className="sg-divider"></div>
                <div className="stay-grid-item">
                  <span className="sg-lbl">CHECK-OUT</span>
                  <strong className="sg-val">{activeQrBooking.checkOut}</strong>
                  <span className="sg-sub">Before 11:00 AM</span>
                </div>
              </div>
            </div>

            <div className="qr-modal-footer">
              <button className="btn-modal-done" onClick={() => setShowQrModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProfileDashboard;
