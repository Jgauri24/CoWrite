/**
 * Socket Service
 * 
 * Centralized socket connection management.
 * Why a service? So we have one socket instance that all components can use,
 * rather than creating multiple connections.
 */

import { io } from 'socket.io-client';

// Will hold our single socket instance
let socket = null;

// Backend URL - in production, this would come from .env
const SOCKET_URL = 'http://localhost:5000';

/**
 * Connect to the socket server
 * Called when user logs in or app initializes with a valid token
 */
export const connectSocket = (token) => {
  // Don't create multiple connections
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token // Send JWT for authentication
    },
    // Reconnection settings
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  return socket;
};

/**
 * Disconnect from socket server
 * Called when user logs out
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually');
  }
};

/**
 * Get the current socket instance
 * Components use this to emit events or listen for updates
 */
export const getSocket = () => {
  return socket;
};

/**
 * Check if socket is connected
 */
export const isConnected = () => {
  return socket?.connected || false;
};

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  isConnected
};
