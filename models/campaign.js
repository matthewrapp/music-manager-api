const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    songName: {
        type: String,
        required: true,
        default: 'Song Name',
        maxlength: 100
    },
    releaseDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    artworkUrl: {
        type: String,
        required: true,
        default: 'https://ucarecdn.com/c63defb0-b5b6-4d0f-b8e7-5e497ce19c95/-/preview/'
    },
    campaignStatus: {
        type: String,
        required: true,
        default: 'Active'
    },
    createCampaignDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    }
});

module.exports = mongoose.model('Campaign', campaignSchema);