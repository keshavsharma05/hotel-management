import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useHotel } from '../../services/HotelContext';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
import { FaCheckCircle, FaCalendarCheck, FaPrint } from 'react-icons/fa';
import './Success.css';

const Success = () => {
  const { hotelId, currentHotel } = useHotel();
  const location = useLocation();
  const { bookingId, roomName } = location.state || { bookingId: 'BK-SAMPLE', roomName: 'Rooms' };

  return (
    <div className="success-page-container">
      <Navbar />
      
      <section className="section success-content">
        <div className="container text-center">
          <div className="success-card">
            <FaCheckCircle className="success-icon" />
            <h1>Reservation Confirmed!</h1>
            <p className="success-msg">Thank you for choosing <strong>{currentHotel?.name}</strong>. Your booking for <strong>{roomName}</strong> has been successfully processed.</p>
            
            <div className="booking-details-box">
              <div className="detail-item">
                <span>Booking ID:</span>
                <strong>#{bookingId}</strong>
              </div>
              <div className="detail-item">
                <span>Status:</span>
                <span className="status-badge">Confirmed</span>
              </div>
              <div className="detail-item">
                <span>Location:</span>
                <span className="">{currentHotel?.location}</span>
              </div>
            </div>

            <p className="email-note">A confirmation email has been sent to your registered address.</p>
            
            <div className="success-actions">
              <Link to={`/app`} className="btn-primary">Manage Bookings</Link>
              <button className="btn-outline-dark" onClick={() => window.print()}>
                <FaPrint /> Print Receipt
              </button>
            </div>
            
            <Link to={`/`} className="back-home">Return to Home</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Success;

