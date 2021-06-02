const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    artistName: {
        type: String,
        required: true,
        default: 'Artist Name',
        maxlength: 100
    },
    artistBio: {
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
    imageUrl: {
        type: String,
        require: true,
        default: 'https://ucarecdn.com/8ce6f979-1eb6-49a9-ad88-b5c2220f2f5e/-/preview/'
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