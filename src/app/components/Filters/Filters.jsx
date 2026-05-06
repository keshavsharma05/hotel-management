import React, { useState, useRef, useEffect } from 'react';
import { RiSearchLine, RiCalendarLine, RiHotelLine, RiPriceTag3Line, RiArrowDownSLine } from 'react-icons/ri';
import './Filters.css';

const Filters = ({ roomTypes = [], onSearch, onTypeFilter, onPriceFilter, onDateChange }) => {
  const today = new Date().toISOString().split('T')[0];

  const [dates, setDates] = useState({
    checkIn: today,
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('All Categories');
  
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('Any Price');

  const typeRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) setIsTypeOpen(false);
      if (priceRef.current && !priceRef.current.contains(event.target)) setIsPriceOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMinCheckOut = (checkIn) => {
    const next = new Date(checkIn);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let newDates = { ...dates, [name]: value };

    // If check-in changed and checkout is now on or before it, push checkout forward
    if (name === 'checkIn' && newDates.checkOut <= value) {
      const next = new Date(value);
      next.setDate(next.getDate() + 1);
      newDates.checkOut = next.toISOString().split('T')[0];
    }

    setDates(newDates);
    if (onDateChange) onDateChange(newDates);
  };

  return (
    <div className="booking-bar-wrapper">
      <div className="container">
        <div className="booking-bar-glass">
          <div className="booking-field search-field">
            <RiSearchLine className="field-icon" />
            <div className="field-inputs">
              <label>Where to?</label>
              <input
                type="text"
                placeholder="Search rooms..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="field-divider"></div>

          <div className="booking-field date-field">
            <RiCalendarLine className="field-icon" />
            <div className="field-inputs">
              <label>Check In</label>
              <input
                type="date"
                name="checkIn"
                value={dates.checkIn}
                min={today}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="field-divider"></div>

          <div className="booking-field date-field">
            <RiCalendarLine className="field-icon" />
            <div className="field-inputs">
              <label>Check Out</label>
              <input
                type="date"
                name="checkOut"
                value={dates.checkOut}
                min={getMinCheckOut(dates.checkIn)}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="field-divider"></div>

          <div className="booking-field select-field custom-dropdown" ref={typeRef}>
            <RiHotelLine className="field-icon" />
            <div className="field-inputs" onClick={() => setIsTypeOpen(!isTypeOpen)}>
              <label>Room Type</label>
              <div className="custom-select-trigger">
                <span>{selectedType}</span>
                <RiArrowDownSLine className={`trigger-icon ${isTypeOpen ? 'open' : ''}`} />
              </div>
            </div>
            {isTypeOpen && (
              <div className="custom-dropdown-menu">
                <div className={`dropdown-item ${selectedType === 'All Categories' ? 'active' : ''}`} onClick={() => { setSelectedType('All Categories'); onTypeFilter('All'); setIsTypeOpen(false); }}>All Categories</div>
                {roomTypes.map((roomType) => (
                  <div key={roomType} className={`dropdown-item ${selectedType === roomType ? 'active' : ''}`} onClick={() => { setSelectedType(roomType); onTypeFilter(roomType); setIsTypeOpen(false); }}>{roomType}</div>
                ))}
              </div>
            )}
          </div>

          <div className="field-divider hide-mobile"></div>

          <div className="booking-field select-field custom-dropdown hide-mobile" ref={priceRef}>
            <RiPriceTag3Line className="field-icon" />
            <div className="field-inputs" onClick={() => setIsPriceOpen(!isPriceOpen)}>
              <label>Budget</label>
              <div className="custom-select-trigger">
                <span>{selectedPrice}</span>
                <RiArrowDownSLine className={`trigger-icon ${isPriceOpen ? 'open' : ''}`} />
              </div>
            </div>
            {isPriceOpen && (
              <div className="custom-dropdown-menu">
                <div className={`dropdown-item ${selectedPrice === 'Any Price' ? 'active' : ''}`} onClick={() => { setSelectedPrice('Any Price'); onPriceFilter('All'); setIsPriceOpen(false); }}>Any Price</div>
                <div className={`dropdown-item ${selectedPrice === 'Under $200' ? 'active' : ''}`} onClick={() => { setSelectedPrice('Under $200'); onPriceFilter('low'); setIsPriceOpen(false); }}>Under $200</div>
                <div className={`dropdown-item ${selectedPrice === '$200 - $400' ? 'active' : ''}`} onClick={() => { setSelectedPrice('$200 - $400'); onPriceFilter('mid'); setIsPriceOpen(false); }}>$200 - $400</div>
                <div className={`dropdown-item ${selectedPrice === 'Over $400' ? 'active' : ''}`} onClick={() => { setSelectedPrice('Over $400'); onPriceFilter('high'); setIsPriceOpen(false); }}>Over $400</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
