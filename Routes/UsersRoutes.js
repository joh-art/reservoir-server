const express = require('express');
const router = express.Router();
const UserControler = require('../Controllers/UsersControler'); // Import your user controller



// Define user registration route
router.post('/register', UserControler.register);

// Define user login route
router.post('/login', UserControler.login);

// Define user route
router.get('/user', UserControler.user);
// Define user routes
router.put('/:id', UserControler.updateUserById);
router.delete('/:id', UserControler.deleteUserById);
router.get('/getUserById', UserControler.getUserById);
router.get('/', UserControler.getAllUsers);
router.get('/protectRoute', UserControler.protectRoute);

   
module.exports = router;


