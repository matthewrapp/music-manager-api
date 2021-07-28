const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        require: true,
        maxlength: 1000
    },
    date: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String,
        require: true,
        enum: ['socialmedia', 'submissions', 'creative/content', 'other']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Task', taskSchema);