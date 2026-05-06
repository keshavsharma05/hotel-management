import React, { useState, useEffect } from 'react';
import { useHotel } from '../../services/HotelContext';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
import RoomCard from '../components/RoomCard/RoomCard';
import Filters from '../components/Filters/Filters';
import { getAvailableRoomsByCategory } from '../../services/api';
import './Rooms.css';

const Rooms = () => {
  const { currentHotel, hotelId } = useHotel();
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [dates, setDates] = useState(() => {
    const saved = localStorage.getItem('selectedDates');
    if (saved) return JSON.parse(saved);
    return {
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    localStorage.setItem('selectedDates', JSON.stringify(dates));
  }, [dates]);

  const roomCategories = currentHotel?.roomCategories || [];
  const roomCategoriesByName = roomCategories.reduce((categoriesMap, category, index) => {
    categoriesMap[category.name] = {
      ...category,
      id: category.id || index + 1
    };
    return categoriesMap;
  }, {});

  const fetchAvailability = (dateParams) => {
    getAvailableRoomsByCategory(dateParams.checkIn, dateParams.checkOut).then(data => {
      const enrichedRooms = data.map((room, index) => {
        const roomCategory = roomCategoriesByName[room.name] || {};

        return {
          ...roomCategory,
          ...room,
          id: room.id || room._id || roomCategory.id || index,
          image: room.image || roomCategory.image,
          description: room.description || roomCategory.description,
          capacity: room.capacity || roomCategory.capacity
        };
      });

      setAllRooms(enrichedRooms);
      setFilteredRooms(enrichedRooms);
    }).catch(err => console.error('[Rooms] fetchAvailability:', err));
  };

  useEffect(() => {
    if (currentHotel) {
      fetchAvailability(dates);
    }
  }, [currentHotel]);

  useEffect(() => {
    let result = allRooms;

    if (searchQuery) {
      result = result.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== 'All') {
      result = result.filter(room => room.name === typeFilter);
    }

    if (priceFilter !== 'All') {
      if (priceFilter === 'low') result = result.filter(room => room.price < 200);
      else if (priceFilter === 'mid') result = result.filter(room => room.price >= 200 && room.price <= 400);
      else if (priceFilter === 'high') result = result.filter(room => room.price > 400);
    }

    setFilteredRooms(result);
  }, [searchQuery, typeFilter, priceFilter, allRooms]);

  const handleDateChange = (newDates) => {
    setDates(newDates);
    fetchAvailability(newDates);
  };

  if (!currentHotel) return null;

  return (
    <div className="rooms-listing-page">
      <Navbar />
      <div className="rooms-hero-premium">
        <div className="rooms-hero-image" style={{ backgroundImage: `url(${currentHotel.heroImage})` }}></div>
        <div className="hero-gradient-overlay"></div>
        <div className="hero-content-wrapper">
          <div className="container">
            <div className="hero-text-premium">
              <span className="hero-label">CURATED COLLECTION</span>
              <h1>Refined Luxury <br /><span>at {currentHotel.name}</span></h1>
              <p>Discover an unparalleled boutique stay experience in the heart of {currentHotel.location}.</p>
            </div>
          </div>
        </div>
      </div>

      <Filters
        roomTypes={roomCategories.map((roomCategory) => roomCategory.name)}
        onSearch={setSearchQuery}
        onTypeFilter={setTypeFilter}
        onPriceFilter={setPriceFilter}
        onDateChange={handleDateChange}
      />

      <section className="section rooms-results">
        <div className="container">
          <div className="results-header">
            <p>Showing {filteredRooms.length} room categories</p>
          </div>

          {filteredRooms.length > 0 ? (
            <div className="rooms-grid-app">
              {filteredRooms.map((room, index) => (
                <RoomCard key={room.id || room._id || index} room={room} hotelId={hotelId} />
              ))}
            </div>
          ) : (
            <div className="no-results text-center">
              <h3>No rooms found matching your criteria.</h3>
              <button
                className="btn-link"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All');
                  setPriceFilter('All');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
