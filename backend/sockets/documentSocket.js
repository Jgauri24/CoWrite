
const Document = require('../models/Document');
const socketAuth = require('../middleware/socketAuth');


const documentUsers = new Map();

const setupDocumentSocket = (io) => {

  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.id})`);

    /**
     * JOIN DOCUMENT ROOM
     * 
     * When a user opens a document, they join its "room".
     * This allows us to broadcast changes only to users in the same document.
     */
    socket.on('join-document', async (documentId) => {
      try {
        // Verify user has access to this document
        const document = await Document.findById(documentId);

        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        // Check if user is owner or collaborator
        const isOwner = document.owner.toString() === socket.user.id;
        const isCollaborator = document.collaborators.some(
          (collab) => collab.toString() === socket.user.id
        );

        if (!isOwner && !isCollaborator) {
          socket.emit('error', { message: 'Access denied to this document' });
          return;
        }

        // Leave any previous document room (user can only be in one doc at a time)
        const previousRoom = socket.currentDocumentId;
        if (previousRoom) {
          await leaveDocumentRoom(socket, previousRoom, io);
        }

        // Join the new document room
        socket.join(documentId);
        socket.currentDocumentId = documentId;

        // Add user to document's active users
        if (!documentUsers.has(documentId)) {
          documentUsers.set(documentId, new Map());
        }

        const usersInDoc = documentUsers.get(documentId);
        usersInDoc.set(socket.user.id, {
          id: socket.user.id,
          name: socket.user.name,
          email: socket.user.email,
          socketId: socket.id,
          joinedAt: new Date()
        });

        // Send document content to the joining user
        socket.emit('load-document', {
          content: document.content,
          title: document.title
        });

        // Notify others in the room that a new user joined
        socket.to(documentId).emit('user-joined', {
          user: {
            id: socket.user.id,
            name: socket.user.name
          }
        });

        // Send list of all active users to the joining user
        const activeUsers = Array.from(usersInDoc.values()).map((u) => ({
          id: u.id,
          name: u.name
        }));
        socket.emit('active-users', activeUsers);

        console.log(`📄 ${socket.user.name} joined document: ${documentId}`);
      } catch (error) {
        console.error('Join Document Error:', error);
        socket.emit('error', { message: 'Failed to join document' });
      }
    });

   
    socket.on('leave-document', async () => {
      const documentId = socket.currentDocumentId;
      if (documentId) {
        await leaveDocumentRoom(socket, documentId, io);
      }
    });

    socket.on('send-changes', (delta) => {
      const documentId = socket.currentDocumentId;
      if (documentId) {
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(documentId).emit('receive-changes', delta);
      }
    });

   
    socket.on('save-document', async (data) => {
      const documentId = socket.currentDocumentId;
      if (!documentId) return;

      try {
        await Document.findByIdAndUpdate(documentId, { 
          content: data.content,
          title: data.title || undefined 
        });
        
        // Confirm save to the user
        socket.emit('document-saved', { savedAt: new Date() });
      } catch (error) {
        console.error('Save Document Error:', error);
        socket.emit('error', { message: 'Failed to save document' });
      }
    });


    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.user.name}`);
      
      const documentId = socket.currentDocumentId;
      if (documentId) {
        await leaveDocumentRoom(socket, documentId, io);
      }
    });
  });
};


//  Helper function to handle leaving a document room

async function leaveDocumentRoom(socket, documentId, io) {
  // Remove from socket room
  socket.leave(documentId);
  socket.currentDocumentId = null;

  // Remove from active users tracking
  const usersInDoc = documentUsers.get(documentId);
  if (usersInDoc) {
    usersInDoc.delete(socket.user.id);

    // If no users left, clean up the Map entry
    if (usersInDoc.size === 0) {
      documentUsers.delete(documentId);
    } else {
      // Notify remaining users that someone left
      io.to(documentId).emit('user-left', {
        user: {
          id: socket.user.id,
          name: socket.user.name
        }
      });
    }
  }

  console.log(`👋 ${socket.user.name} left document: ${documentId}`);
}

module.exports = setupDocumentSocket;
