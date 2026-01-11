const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

dotenv.config();


const app = express();

connectDB();

app.use(cors());

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);


app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CoWrite API is running',
    timestamp: new Date().toISOString()
  });
});



app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler - catches all errors thrown in routes
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
