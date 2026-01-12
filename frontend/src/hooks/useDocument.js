

import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '../services/socket';

export const useDocument = (documentId) => {
  // Document content and metadata
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('');
  
  // Active users in the document
  const [activeUsers, setActiveUsers] = useState([]);
  
  // Connection and Save states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, disconnected, reconnecting
  const [lastSaved, setLastSaved] = useState(null);

  // Join the document room when component mounts
  useEffect(() => {
    const socket = getSocket();
    
    if (!socket || !documentId) {
      setError('Socket not connected');
      setIsLoading(false);
      return;
    }

    // Request to join the document room
    socket.emit('join-document', documentId);

    // Listen for document content
    const handleLoadDocument = (data) => {
      setContent(data.content);
      setTitle(data.title);
      setIsLoading(false);
    };

    // Listen for active users list 
    const handleActiveUsers = (users) => {
      setActiveUsers(users);
    };

    // Listen for new user joining
    const handleUserJoined = ({ user }) => {
      setActiveUsers((prev) => {
        if (prev.some((u) => u.id === user.id)) return prev;
        return [...prev, user];
      });
    };

    // Listen for user leaving
    const handleUserLeft = ({ user }) => {
      setActiveUsers((prev) => prev.filter((u) => u.id !== user.id));
    };

    // Listen for errors
    const handleError = (err) => {
      // Don't overwrite main error if it's just a save error
      if (!err.message.includes('save')) {
        setError(err.message);
        setIsLoading(false);
      }
      console.error('Socket Error:', err);
    };

    // Listen for title changes from other users
    const handleTitleChanged = (newTitle) => {
      setTitle(newTitle);
    };
    
    // Listen for save confirmation
    const handleDocumentSaved = ({ savedAt }) => {
      setLastSaved(new Date(savedAt));
    };
    
    // Connection handling
    const handleDisconnect = () => setConnectionStatus('disconnected');
    const handleConnect = () => setConnectionStatus('connected');

    // Subscribe to events
    socket.on('load-document', handleLoadDocument);
    socket.on('active-users', handleActiveUsers);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('error', handleError);
    socket.on('title-changed', handleTitleChanged);
    socket.on('document-saved', handleDocumentSaved);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect', handleConnect);

    // Cleanup when component unmounts or documentId changes
    return () => {
      socket.emit('leave-document');
      socket.off('load-document', handleLoadDocument);
      socket.off('active-users', handleActiveUsers);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('error', handleError);
      socket.off('title-changed', handleTitleChanged);
      socket.off('document-saved', handleDocumentSaved);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect', handleConnect);
    };
  }, [documentId]);

  // Send changes to other users
  const sendChanges = useCallback((delta) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('send-changes', delta);
    }
  }, []);

  // Save document to database
  const saveDocument = useCallback((data) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('save-document', data);
    } else {
      console.warn('Cannot save - socket disconnected');
    }
  }, []);

  return {
    content,
    setContent,
    title,
    setTitle,
    activeUsers,
    isLoading,
    error,
    connectionStatus,
    lastSaved,
    sendChanges,
    saveDocument
  };
};

export default useDocument;
