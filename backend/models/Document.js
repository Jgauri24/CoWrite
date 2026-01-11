const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Untitled Document',
      trim: true,
    },
    content: {
      type: Object, 
      default: {},
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
