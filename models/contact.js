const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: 'First Name',
        maxlength: 100
    },
    lastName: {
        type: String,
        default: 'Last Name',
        maxlength: 100
    },
    channelName: {
        type: String,
        maxlength: 100
    },
    date: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true,
        enum: ['spotify', 'applemusic', 'youtube', 'blog', 'label', 'fan']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Contact', contactSchema);