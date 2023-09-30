const mongoose = require('mongoose');

// Define a Booking Schema
const bookingSchema = new mongoose.Schema({
    room: { 
      type: String, 
      required: true },
    roomId: {
      type:String,  
      required: true },
     checkIn: { type: Date},
  checkOut: { type: Date},
    totalAmount: { 
      type: Number, 
      required: true },
    totalDays: { 
      type: Number,
       required: true },
    transactionId: {
       type: String, 
       required: true },
    status: {
       type: String,
        required: true, default: 'Booked' },
  }, {
    timestamps: true, // Adds createdAt and updatedAt fields
  });
  
// Create a Booking Model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
