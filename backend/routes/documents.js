const express = require('express');
const Document = require('../models/Document');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);


//  Create a new document
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    const document = await Document.create({
      title: title || 'Untitled Document',
      owner: req.user._id,
      content: {},
      collaborators: [],
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Create Document Error:', error);
    res.status(500).json({ message: 'Server error while creating document' });
  }
});

    // Get all documents for the logged-in user (owned or collaborating)

router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id }
      ]
    }).sort({ updatedAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error('Get Documents Error:', error);
    res.status(500).json({ message: 'Server error while fetching documents' });
  }
});


//   Get a single document by ID  
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check permissions
    if (
      document.owner.toString() !== req.user._id.toString() &&
      !document.collaborators.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this document' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get Document Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(500).json({ message: 'Server error while fetching document' });
  }
});


//  Update document title or content
 
router.patch('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check permissions
    if (
      document.owner.toString() !== req.user._id.toString() &&
      !document.collaborators.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized to update this document' });
    }

    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;

    await document.save();
    res.json(document);
  } catch (error) {
    console.error('Update Document Error:', error);
    res.status(500).json({ message: 'Server error while updating document' });
  }
});


//  Delete a document

router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can delete document
    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete Document Error:', error);
    res.status(500).json({ message: 'Server error while deleting document' });
  }
});

module.exports = router;
