const User = require('../models/Users');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, sex } = req.body;

   
    const existing = await User.findOne({
      where: { firstName, lastName },
    });
    if (existing) {
      return res.status(400).json({
        error: 'A user with that name already exists.',
      });
    }

    // 2) If not found, proceed with creation
    const newUser = await User.create({ firstName, lastName, phone, sex });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, sex } = req.body;

    const [updated] = await User.update(
      { firstName, lastName, phone, sex },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    // Return updated user
    const updatedUser = await User.findByPk(id);
    return res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
