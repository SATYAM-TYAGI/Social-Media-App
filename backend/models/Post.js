const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: '',
    },
    tags: [{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    }],
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema); 