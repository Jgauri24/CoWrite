
//  Why a hook? React components can use this to manage document state
//  without worrying about socket event setup/cleanup.


import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '../services/socket';

export const useDocument = (documentId) => {
  // Document content and metadata
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('');
  
  // Active users in the document
  const [activeUsers, setActiveUsers] = useState([]);
  

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Listen for active users list (sent when we join)
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
      setError(err.message);
      setIsLoading(false);
    };

    // Subscribe to events
    socket.on('load-document', handleLoadDocument);
    socket.on('active-users', handleActiveUsers);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('error', handleError);

    // Cleanup when component unmounts or documentId changes
    return () => {
      socket.emit('leave-document');
      socket.off('load-document', handleLoadDocument);
      socket.off('active-users', handleActiveUsers);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('error', handleError);
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
    if (socket) {
      socket.emit('save-document', data);
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
    sendChanges,
    saveDocument
  };
};

export default useDocument;
