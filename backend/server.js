require('dotenv').config(); // Ensure .env is loaded if not done already
const express = require('express');
const cors = require('cors'); // If you need CORS from different domains
const sequelize = require('./db'); 
const userRoutes = require('./routes/UserRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routes
app.use('/api/users', userRoutes);

// Test Route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Sync DB and start server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }) 
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync DB:', err);
  });
