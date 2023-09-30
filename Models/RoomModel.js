const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  imgurls: {
    type: [String], // Specify that it's an array of strings
    default: [],    // Set an empty array as the default value
  },
  currentbookings: [
    {
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
      checkIn: Date,
      checkOut: Date,
      userid: String,
      status: String,
    },
  ],
  type: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Enable timestamps for created and updated fields
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
