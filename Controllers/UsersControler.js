const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../Models/UserModel'); // Import your User model
require('dotenv').config();

const SERCRTTWJ = process.env.SERCRTTWJ;

const UserController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide username, email, and password" });
      }

      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const existingUsername = await User.findOne({ username });

      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = generateToken(newUser._id);

      res.status(201).json({ message: "Registration successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Login user
  login : async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find a user with the provided email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      // Use bcrypt.compare to compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        // Passwords match, so you can consider the user logged in
        // Generate a JWT token for the authenticated user
        const token = generateToken(user._id);
  
        // In this example, we're just sending a success response
        return res.status(200).json({ message: "Login successful", token, user });
      } else {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Additional UserController methods can be added here, such as fetching user data by ID.
  user: async (req, res) => {
    try {
      // Assuming you have a way to identify the user, such as a user ID in the request
      const userId = req.userId; // Adjust this based on your authentication method
  
      // Fetch user data from your database
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the user data in the response
      res.status(200).json(user);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Delete a user by ID
  deleteUserById: async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the provided ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      // Find the user by ID
      const user = await User.findByIdAndRemove(id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  // GET a single user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the provided ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  // GET all users
  getAllUsers: async (req, res) => {
    try {
      // Find all users in the database
      const users = await User.find();
  
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

    // Update user by ID
    updateUserById: async (req, res) => {
      try {
        const { id } = req.params;
        const { name, email, password } = req.body;
  
        // Check if the provided ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
  
        // Find the user by ID
        const user = await User.findById(id);
  
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        // Update user properties
        if (name) user.name = name;
        if (email) user.email = email;
  
        // Check if a new password is provided and hash it
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }
  
        // Save the updated user
        const updatedUser = await user.save();
  
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  
  // Middleware to protect routes with JWT
  protectRoute: (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenValue = token.split(' ')[1]; // Get the token value after "Bearer "

    try {
      // Verify the JWT token
      const decoded = jwt.verify(tokenValue, process.env.SERCRTTWJ); // Use your JWT_SECRET from environment variables
      req.user = decoded; // Store the user object in req for further use
      next(); // User is authenticated, continue to the route
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  },
};

// Helper function to generate JWT token
const generateToken = (id) => {
  // Verify that the SECRETJWT environment variable is set consistently
  if (!process.env.SERCRTTWJ) {
    throw new Error("SERCRTTWJ is not set. Set it in your environment.");
  }

  // Generate the JWT token with the user's ID and expiration
  return jwt.sign({ id },process.env.SERCRTTWJ, {
    expiresIn: "30d",
  });
};

module.exports = UserController;
