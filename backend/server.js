const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const setupDocumentSocket = require('./sockets/documentSocket');

dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {}});

connectDB();

app.use(cors());

app.use(express.json());


// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);


app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CoWrite API is running',
    timestamp: new Date().toISOString()
  });
});

// Setup socket logic
setupDocumentSocket(io);


app.get('*', (req, res) => {

  if (req.path.startsWith('/api')) {
     return res.status(404).json({ message: 'API Route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
