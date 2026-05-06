const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const rooms = await Room.find({ hotelId });
    console.log(`[DEBUG] getRooms requested for hotelId: "${hotelId}" - Found: ${rooms.length} rooms`);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const roomData = req.body;
    
    if (roomData._id || roomData.id) {
      const updated = await Room.findOneAndUpdate(
        { _id: roomData._id || roomData.id }, 
        roomData, 
        { new: true }
      );
      return res.json(updated);
    }
    
    const newRoom = new Room({ ...roomData, hotelId });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
