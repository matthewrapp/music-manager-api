const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    imageUrl: {
        type: String,
        require: true,
        default: 'https://ucarecdn.com/c63defb0-b5b6-4d0f-b8e7-5e497ce19c95/-/preview/'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    artists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        default: null
    }]
});

module.exports = mongoose.model('User', userSchema);