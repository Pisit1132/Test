const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// CREATE a user
router.post('/', userController.createUser);

// READ all users
router.get('/', userController.getAllUsers);

// READ a single user by ID
router.get('/:id', userController.getUserById);

// UPDATE a user by ID
router.put('/:id', userController.updateUser);

// DELETE a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
