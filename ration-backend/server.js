const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 8080;

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Sync DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
