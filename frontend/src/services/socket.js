
import { io } from 'socket.io-client';


let socket = null;


const SOCKET_URL = 'https://cowrite-rx0h.onrender.com';


export const connectSocket = (token) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });


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

//  Disconnect from socket server

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually');
  }
};

//  Get the current socket instance

export const getSocket = () => {
  return socket;
};

// Check if socket is connected

export const isConnected = () => {
  return socket?.connected || false;
};

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  isConnected
};
