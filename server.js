const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();
const usersRoutes = require("./Routes/UsersRoutes");
const Room = require("./Models/RoomModel");
const Roomsroute = require("./Routes/Roomsroute");
const User = require("./Models/UserModel");
const Booking = require("../reservoir-server/Models/Booking"); // Import your Booking
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51Nuc3DIW3dHV2cj5jUqd53aIJs0FBtpaXKCNeOjFBbvtuoOsJPpf41zYiTkArab3mr1tLPd3mNPO2kCjWY9dhvUm00UpW0oL6P"
);
const PORT = process.env.PORT || 9090;
require("dotenv").config();
const { isValid, parseISO, format } = require("date-fns");
mongoDBURL =
  "mongodb+srv://ohaokey09:DrKIXjjHbtnLGtln@remindercluster.xwt3idy.mongodb.net/Reservation?retryWrites=true&w=majority";
const bookingRoutes = require("./Routes/BookingRoute"); // Import your booking routes file
const { id } = require("date-fns/locale");
const SERCRTTWJ = process.env.SERCRTTWJ;

// Use the booking routes

// Connect to MongoDB Atlas
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Check for successful connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
  // listen for connections
  app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
  });
});

// THE MIDDLEWARES

// Enable CORS for specific origins and allow credentials
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

app.use(express.json());

// Mount the bookingRoutes middleware under the /bookings path
// app.use('/bookings', bookingRoutes);

// Include routes
app.use("/users", usersRoutes);
app.use("/protectRoute", usersRoutes);
app.use("/rooms", Roomsroute);
// Use route files
// Define a route to get bookings by user ID

app.post("/booking", async (req, res) => {
  try {
    const {
      room,
      roomId,
      userId,
      checkIn,
      checkOut,
      totalAmount,
      totalDays,
      token,
    } = req.body;

    // Check if checkIn and checkOut dates are provided
    if (!checkIn || !checkOut) {
      throw new Error("checkIn and checkOut dates are required.");
    }

    // Validate and parse the date strings into Date objects
    const parseDate = (dateString) => {
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
      }
      return parsedDate;
    };

    const parsedCheckIn = parseDate(checkIn);
    const parsedCheckOut = parseDate(checkOut);

    // Create a new booking document
    const newBooking = new Booking({
      room: room,
      roomId: roomId,
      userId: userId,
      checkIn: parsedCheckIn,
      checkOut: parsedCheckOut,
      totalAmount: totalAmount,
      totalDays: totalDays,
      transactionId: uuidv4(), // Generate a unique transaction ID
    });

    // Save the booking to the database
    const booking = await newBooking.save();

    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Charge the customer using the Stripe API
    await stripe.charges.create({
      amount: totalAmount * 100, // Amount in cents
      currency: "NGN",
      customer: customer.id,
      receipt_email: token.email,
    });

    // Update room data using the $push operator
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: {
          currentbookings: {
            booking: booking._id,
            checkIn: parsedCheckIn,
            checkOut: parsedCheckOut,
            userId,
            status: booking.status,
          },
        },
      },
      { new: true } // Return the updated room document
    );

    // Respond with the saved booking data
    res.status(201).json({
      message: "Booking created successfully",
      booking: booking,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(400)
      .json({ message: "Invalid input data", error: error.message });
  }
});

app.get("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a booking by ID
app.put("/bookings/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params; // Get the bookingId from the URL
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      req.body,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/:bookingId", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndRemove(
      req.params.bookingId
    );
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(deletedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/getbookingbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    // Use await to wait for the database query to complete
    const bookings = await Booking.find({ userid: userid });

    // Send the bookings as a response
    res.send(bookings);
  } catch (error) {
    // Handle errors and send an error response
    return res.status(500).json({ error: "Internal server error" });
  }
});
