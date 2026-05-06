import React, { useState, useEffect } from 'react';
import { useHotel } from '../../services/HotelContext';
import AdminSidebar from './AdminSidebar';
import { FaDollarSign, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import { getBookings, getRooms, updateBooking } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { hotelId, currentHotel } = useHotel();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBookings(),
      getRooms()
    ]).then(([bookingsData, roomsData]) => {
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setLoading(false);
    });
  }, []);

  const activeBookings = Array.isArray(bookings) ? bookings.filter(b => b.status !== 'Cancelled' && b.status !== 'Completed') : [];
  const roomsOccupied = activeBookings.reduce((sum, b) => sum + (b.numRooms || 1), 0);

  const stats = [
    { label: "Total Revenue", value: `$${bookings.reduce((sum, b) => sum + parseInt(String(b.total).replace('$', '') || 0), 0).toLocaleString()}`, icon: <FaDollarSign />, trend: "+12.5%", color: "#10b981" },
    { label: "Total Rooms", value: rooms.length.toString(), icon: <FaCalendarCheck />, trend: "Physical", color: "#3b82f6" },
    { label: "Available Today", value: Math.max(0, rooms.length - roomsOccupied).toString(), icon: <FaUsers />, trend: "Real-time", color: "#f59e0b" },
  ];

  const handleRoomAssignment = (id, newRoomNo) => {
    updateBooking(id, { roomNo: newRoomNo }).then(() => {
      Promise.all([
        getBookings(),
        getRooms()
      ]).then(([bookingsData, roomsData]) => {
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      });
    });
  };

  return (
    <div className="dashboard-view">
      <header className="admin-header">
          <h1>{currentHotel?.name} Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, <strong>{currentHotel?.name} Manager</strong></span>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <h2 className="stat-value">{stat.value}</h2>
                <span className="stat-trend" style={{ color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                  {stat.trend} from last month
                </span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </section>

        <section className="recent-activity">
          <div className="card-header">
            <h3>Recent Bookings</h3>
            <button className="btn-link">View All</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Room Type</th>
                <th>Qty</th>
                <th>Room No.</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
              ) : !Array.isArray(bookings) || bookings.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No recent bookings for {currentHotel?.name}.</td></tr>
              ) : (
                bookings.map(bk => (
                  <tr key={bk.id}>
                    <td><strong>#{bk.id}</strong></td>
                    <td>{bk.guest}</td>
                    <td style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={bk.type}>
                      {bk.type}
                    </td>
                    <td><strong>{bk.numRooms || 1}</strong></td>
                    <td>
                      <input 
                        type="text" 
                        className="room-assign-input"
                        value={bk.roomNo} 
                        onChange={(e) => handleRoomAssignment(bk.id, e.target.value)}
                      />
                    </td>
                    <td>{bk.checkIn}</td>
                    <td><span className={`badge ${bk.status.toLowerCase().replace(' ', '')}`}>{bk.status}</span></td>
                    <td>{String(bk.total).startsWith('$') ? bk.total : `$${bk.total}`}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
    </div>
  );
};

export default Dashboard;

