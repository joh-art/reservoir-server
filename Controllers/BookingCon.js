// const express = require('express');
// const router = express.Router();
// const Booking = require('../Models/RoomModel'); // Import your Booking model

// // Define booking routes here







// // Route for creating a new booking
// const validateBookingData = (req, res, next) => {
//     const { roomId, totalAmount } = req.body;
  
//     if (!roomId || !totalAmount) {
//       return res.status(400).json({ message: 'roomId and totalAmount are required fields' });
//     }
  
//     // Additional validation logic can be added here
  
//     next(); // Proceed to the route handler if validation passes
//   };
  
//   // Apply the validation middleware to the booking creation route
//   router.post('/book', validateBookingData, async (req, res) => {
//   try {
//     const { roomId,userid, checkInDate, checkOutDate, totalAmount, totalDays, transactionId } = req.body;

//     // Create a new booking document
//     const newBooking = new Booking({
//       roomId: roomId,
//       userid,
//       checkInDate,
//       checkOutDate,
//       totalAmount,
//       totalDays,
//       transactionId,
//     });

//     // Save the booking to the database
//     const Booking = await newBooking.save();

//     // Respond with the saved booking data
//     res.send({ message: 'Booking created successfully' });
// } catch (error) {
//   // Handle errors and provide an error response
//   console.error('Error:', error);
//   res.status(500).json({ message: 'An error occurred while creating the booking' });
// }
// });

  
//   router.get('/book', async (req, res) => {
//     try {
//       const bookings = await Booking.find();
//       res.json(bookings);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

//   router.get('/:bookingId', async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.bookingId);
//       if (!booking) {
//         return res.status(404).json({ error: 'Booking not found' });
//       }
//       res.json(booking);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

//   // Update a booking by ID
// router.put('/:bookingId', async (req, res) => {
//     try {
//       const updatedBooking = await Booking.findByIdAndUpdate(
//         req.params.bookingId,
//         req.body,
//         { new: true }
//       );
//       if (!updatedBooking) {
//         return res.status(404).json({ error: 'Booking not found' });
//       }
//       res.json(updatedBooking);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  

//   router.delete('/:bookingId', async (req, res) => {
//     try {
//       const deletedBooking = await Booking.findByIdAndRemove(req.params.bookingId);
//       if (!deletedBooking) {
//         return res.status(404).json({ error: 'Booking not found' });
//       }
//       res.json(deletedBooking);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
  
// module.exports = router;