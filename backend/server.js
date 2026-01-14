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

// Configure Socket.io with robust CORS for production
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

// Serve static files from the frontend
const distPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(distPath));

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

// Catch-all route for SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API Route not found' });
  }
  
  const indexPath = path.resolve(distPath, 'index.html');
  console.log(`[Server] Serving index.html for path: ${req.path}`);
  res.sendFile(indexPath);
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
