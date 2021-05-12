const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const salt = 12;

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
    date: {
        type: Date,
        default: Date.now()
    },
    artist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        default: null
    }]
});

module.exports = mongoose.model('User', userSchema);