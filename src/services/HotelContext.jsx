import React, { createContext, useContext, useState, useEffect } from 'react';
import { hotels } from '../data/hotelsData';

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [currentHotel, setCurrentHotel] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const hotel = hotels["theluxuryinn"]; // 👈 CHANGE if needed

  if (hotel) {
    setCurrentHotel(hotel);
  } else {
    console.warn("Hotel not found");
  }

  setLoading(false);
}, []);
  return (
    <HotelContext.Provider value={{ currentHotel, hotelId: "theluxuryinn", loading }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
