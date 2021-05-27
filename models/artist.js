const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    artistName: {
        type: String,
        required: true,
        default: 'Artist Name',
        maxlength: 100
    },
    bio: {
        type: String,
        required: true,
        default: 'Artist Bio',
        maxlength: 1000
    },
    date: {
        type: Date,
        default: Date.now()
    },
    socialMedia: {
        facebook: {
            type: String,
            default: null
        },
        instagram: {
            type: String,
            default: null
        },
        soundcloud: {
            type: String,
            default: null
        }
    },
    primary: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Artist', artistSchema);