const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../Models/RoomModel');

// Create a new room
router.post('/rooms', async (req, res, next) => {
  try {
    const {
      name,
      price,
      phonenumber,
      imgurls,
      currentbookings,
      type,
      capacity,
      description,
    } = req.body;

    if (!name || !price || !phonenumber || !type || !capacity || !description) {
      return res.status(400).json({
        error: 'Please provide name, price, phonenumber, type, capacity, and description',
      });
    }

    const newRoom = new Room({
      name,
      price,
      phonenumber,
      imgurls,
      currentbookings,
      type,
      capacity,
      description,
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    next(err);
  }
});

// Update a room by ID
router.put('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: 'Invalid roomId' });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const {
      name,
      price,
      phonenumber,
      imgurls,
      currentbookings,
      type,
      capacity,
      description,
    } = req.body;
    room.name = name || room.name;
    room.price = price || room.price;
    room.phonenumber = phonenumber || room.phonenumber;
    room.imgurls = imgurls || room.imgurls;
    room.currentbookings = currentbookings || room.currentbookings;
    room.type = type || room.type;
    room.capacity = capacity || room.capacity;
    room.description = description || room.description;
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a room by ID
router.delete('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: 'Invalid roomId' });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    await room.remove();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a room by ID
router.get('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: 'Invalid roomId' });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
