import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHotel } from '../../../services/HotelContext';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { currentHotel, hotelId } = useHotel();
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (!currentHotel) return null;

  // editorial brand name
  const brandName = currentHotel.name.toUpperCase();

  return (
    <footer className={`footer-premium theme-${hotelId}`}>
      <div className="footer-top">
        <div className="footer-brand-region">
          <h2 className="footer-brand-logo">{brandName}</h2>
          <p className="footer-tagline-editorial">{currentHotel.tagline}</p>
          <div className="footer-social-minimal">
            <a href="https://www.facebook.com/TheLuxuryInn/" target="_blank" rel="noopener noreferrer" className="social-icon-link"><FaFacebook /></a>
            <a href="https://www.instagram.com/the_luxury_inn/" target="_blank" rel="noopener noreferrer" className="social-icon-link"><FaInstagram /></a>
            <a href="https://maps.app.goo.gl/YabrAHJz7yqpUcWB6" target="_blank" rel="noopener noreferrer" className="social-icon-link"><FaMapMarkerAlt /></a>
          </div>
        </div>

        <div className="footer-navigation-grid">
          <div className="footer-nav-col">
            <h4 className="nav-col-title">EXPLORE</h4>
            <ul className="nav-list-minimal">
              <li><Link to={`/`}>THE INN</Link></li>
              <li><Link to={`/app`}>ROOMS</Link></li>
              <li><Link to={`/gallery`}>CURATED SPACES</Link></li>
              <li><Link to={`/admin`}>ADMIN PORTAL</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="nav-col-title">EXPERIENCES</h4>
            <ul className="nav-list-minimal">
              {currentHotel.amenities.slice(0, 4).map((amenity, idx) => (
                <li key={idx}>{amenity.toUpperCase()}</li>
              ))}
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="nav-col-title">CONTACT</h4>
            <div className="contact-info-minimal">
              <div className="mini-contact-item">
                <FaMapMarkerAlt className="mini-icon" />
                <span>{currentHotel.location}</span>
              </div>
              <div className="mini-contact-item">
                <FaPhone className="mini-icon" />
                <span>H: 0207 6833056 | M: 07961174997</span>
              </div>
              <div className="mini-contact-item">
                <FaEnvelope className="mini-icon" />
                <span>bookings@luxuryinn.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-lower">
        <div className="footer-divider-thin"></div>
        <div className="footer-legal-bar">
          <p className="copyright-text">&copy; {new Date().getFullYear()} {brandName}. ALL RIGHTS RESERVED.</p>
          <div className="legal-links">
            <a href="#">PRIVACY POLICY</a>
            <span className="dot"></span>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>TERMS & CONDITIONS</a>
          </div>
        </div>
      </div>

      {showTermsModal && (
        <div className="terms-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="terms-modal-content" onClick={e => e.stopPropagation()}>
            <div className="terms-modal-header">
              <h3>Terms & Conditions</h3>
              <button className="terms-close-btn" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="terms-modal-body">
              <h4>Deposit & payment</h4>
              <p>Card details will be taken during the booking process and the details checked. The details need to be valid to guaranty the booking. The booking will be cancelled if they are not valid.</p>
              
              <h4>Cancellation policy</h4>
              <p>You can cancel you booking without any charge up to 7 days before the arrival day. Cancellations made after this time up to the arrival day will be charged 50% of the cost of the stay. Same day booking cancelations or no shows will be charged the cost of the booking.</p>
              
              <h4>No outside guests</h4>
              <p>It is more about being considerate of other guests than being unfriendly. No outside guests unless previously agreed.</p>
              
              <h4>Dogs</h4>
              <p>Only by prior arrangement at a cost of £5 per night.</p>
              
              <h4>Damages</h4>
              <p>Guests will be held accountable for damages including damage to the property, furniture, floors and linens. Stains to linens will incur an extra minimum cleaning forward/replacement charge of £15.</p>
              
              <h4>Check-in</h4>
              <p>Earliest bag drop and pick up keys is 12:30 pm - the room won't be ready at this time.<br/><br/>Earliest the room can be ready is 2:30 pm if you let us know your arrival time in advance, we can then prioritise the early check-in. It is not possible to wait for the room to be ready as we need the space free so the cleaning can be done.<br/><br/>Self check-in is likely after 4 pm using a smart key box. The details for this will be sent separately after you have indicated your arrival time.<br/>If you are delayed or change plans please let me know.</p>
              
              <h4>Check out</h4>
              <p>The latest check out of the room is 11 am. If you want to leave your bags and pick them up later. Make sure everything is packed up and when the housekeeper comes he will move the bags to underneath the stairs. Let me know what time you'll return and I will either send you a code for the front door key box or the housekeeper will be there to open the door so you can collect your bags.</p>
              
              <h4>Guest behaviour</h4>
              <p>Due to the Open Plan nature of the property guests are required to be respectful in the communal areas.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
