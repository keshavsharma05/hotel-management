import React, { useState, useEffect } from 'react';
import { useHotel } from '../../services/HotelContext';
import AdminSidebar from './AdminSidebar';
import { getRooms, saveRoom, deleteRoom } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import './ManageRooms.css';

const ManageRooms = () => {
  const { hotelId, currentHotel } = useHotel();
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    type: 'Standard',
    price: 0,
    description: '',
    image: ''
  });

  useEffect(() => {
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  const fetchRooms = () => {
    getRooms().then(setRooms);
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData(room);
    } else {
      setEditingRoom(null);
      // Use the first room category as default
      const defaultCat = currentHotel?.rooms?.[0]?.name || '';
      const defaultPrice = currentHotel?.rooms?.[0]?.price || 0;
      const defaultImg = currentHotel?.rooms?.[0]?.image || '';
      const defaultDesc = currentHotel?.rooms?.[0]?.description || '';
      
      setFormData({
        roomNumber: '',
        name: defaultCat,
        type: 'Standard',
        price: defaultPrice,
        description: defaultDesc,
        image: defaultImg
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveRoom(formData).then(() => {
      fetchRooms();
      setShowModal(false);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id).then(() => {
        fetchRooms();
      });
    }
  };

  return (
    <div className="manage-rooms-view">
      <header className="admin-header">
          <h1>{currentHotel?.name} Rooms</h1>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <FaPlus /> Add New Room
          </button>
        </header>

        <section className="rooms-management">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Room Number</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td>
                      <img src={room.image} alt={room.name} className="admin-room-thumb" />
                    </td>
                    <td><strong>{room.roomNumber}</strong></td>
                    <td>{room.name}</td>
                    <td>${room.price}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon edit" onClick={() => handleOpenModal(room)}><FaEdit /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(room.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Room Number</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 101"
                  value={formData.roomNumber} 
                  onChange={e => setFormData({...formData, roomNumber: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Category Name</label>
                <select required value={formData.name} onChange={e => {
                  const cat = currentHotel.rooms.find(r => r.name === e.target.value);
                  setFormData({
                    ...formData, 
                    name: e.target.value, 
                    image: cat?.image || formData.image,
                    price: cat?.price || formData.price,
                    description: cat?.description || formData.description
                  });
                }}>
                  <option value="">Select Category</option>
                  {/* Aggregated categories from original setup */}
                  {[...new Set(currentHotel?.rooms?.map(r => r.name))].map(catName => (
                    <option key={catName} value={catName}>{catName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price per Night ($)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
              </div>
              <div className="form-group full-width">
                <label>Description (Category Features)</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save-modal">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;

