const Document = require('../models/Document');

const setupDocumentSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('get-document', async (documentId) => {
      // In a real app, we'd verify the user's token here as well
      // For now, we join the room and send back the document data
      socket.join(documentId);
      
      try {
        const document = await Document.findById(documentId);
        socket.emit('load-document', document ? document.content : {});
      } catch (err) {
        console.error('Socket Document Fetch Error:', err);
      }

      socket.on('send-changes', (delta) => {
        socket.to(documentId).emit('receive-changes', delta);
      });

      socket.on('save-document', async (data) => {
        try {
          await Document.findByIdAndUpdate(documentId, { content: data });
        } catch (err) {
          console.error('Socket Save Error:', err);
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = setupDocumentSocket;
