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
        default: 'https://ucarecdn.com/8ce6f979-1eb6-49a9-ad88-b5c2220f2f5e/-/preview/'
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