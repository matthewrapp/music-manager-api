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
        default: 'https://ucarecdn.com/8ce6f979-1eb6-49a9-ad88-b5c2220f2f5e/-/preview/'
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
    contacts: [
        {
            contactId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Contact',
                required: true
            },
            checked: {
                type: Boolean,
                default: false
            }

        }
    ],
    tasks: [
        {
            taskId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task',
                required: true
            },
            checked: {
                type: Boolean,
                default: false
            }

        }
    ],
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