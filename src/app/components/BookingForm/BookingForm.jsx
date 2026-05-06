import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../services/AuthContext';
import './BookingForm.css';

const BookingForm = ({ cart, bookingDates, onDateChange, onSubmit, isSubmitting }) => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    guests: 1,
  });

  // Sync form with user data when user state changes (e.g. after login)
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phoneNumber || prev.phone
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'checkIn' || name === 'checkOut') {
      onDateChange({ ...bookingDates, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateNights = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = calculateNights(bookingDates.checkIn, bookingDates.checkOut);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * nights;
  const totalBill = subtotal + 50;
  
  const maxCapacity = cart.reduce((sum, item) => {
    const roomCap = item.capacity || item.maxAdults || 0;
    return sum + (roomCap * item.quantity);
  }, 0);
  
  const isOverCapacity = Number(formData.guests) > maxCapacity;

  const todayStr = new Date().toISOString().split('T')[0];
  const minCheckOut = bookingDates.checkIn ? new Date(new Date(bookingDates.checkIn).getTime() + 86400000).toISOString().split('T')[0] : todayStr;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(bookingDates.checkOut) <= new Date(bookingDates.checkIn)) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    // Sync back name if it changed or was empty
    if (user && formData.fullName && (!user.name || user.name !== formData.fullName)) {
      updateUserProfile({ name: formData.fullName });
    }

    onSubmit({ ...formData, ...bookingDates });
  };

  return (
    <div className="booking-form-card">
      <h3 className="form-title">Guest Information</h3>
      <form onSubmit={handleSubmit} className="booking-form-surgical">
        <div className="form-group">
          <label className="editorial-label">Full Name</label>
          <input 
            type="text" 
            name="fullName" 
            placeholder="John Doe" 
            value={formData.fullName}
            onChange={handleChange}
            className="premium-input"
            required 
          />
        </div>
        
        <div className="form-row-2col">
          <div className="form-group">
            <label className="editorial-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={handleChange}
              className="premium-input"
              required 
            />
          </div>
          <div className="form-group">
            <label className="editorial-label">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              placeholder="+1 (555) 000-0000" 
              value={formData.phone}
              onChange={handleChange}
              readOnly={!!user}
              className={`premium-input ${user ? 'readonly' : ''}`}
              required 
            />
          </div>
        </div>
        
        <div className="form-row-2col">
          <div className="form-group">
            <label className="editorial-label">Arrival Date</label>
            <input 
              type="date" 
              name="checkIn" 
              min={todayStr}
              value={bookingDates.checkIn}
              onChange={handleChange}
              className="premium-input"
              required 
            />
          </div>
          <div className="form-group">
            <label className="editorial-label">Departure Date</label>
            <input 
              type="date" 
              name="checkOut" 
              min={minCheckOut}
              value={bookingDates.checkOut}
              onChange={handleChange}
              className="premium-input"
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="editorial-label">Number of Guests (Capacity: {maxCapacity})</label>
          <input 
            type="number" 
            name="guests" 
            min="1" 
            value={formData.guests} 
            onChange={handleChange}
            className={`premium-input ${isOverCapacity ? 'input-error' : ''}`}
            required 
          />
          {isOverCapacity && (
            <p className="error-text-surgical">Capacity exceeded (Max {maxCapacity})</p>
          )}
        </div>
        
        <div className="action-footer">
          <button 
            type="submit" 
            className={`btn-confirm-surgical ${(isOverCapacity || isSubmitting) ? 'btn-disabled' : ''}`}
            disabled={isOverCapacity || isSubmitting}
          >
            {isOverCapacity ? 'Over Capacity' : isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
          </button>
          <p className="secure-note">Guaranteed Best Rate • Secure Checkout</p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
