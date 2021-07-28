const User = require('../models/user');
const Artist = require('../models/artist');
const Campaign = require('../models/campaign');
const Contact = require('../models/contact');
const Task = require('../models/task');

exports.postCreateCampaign = (req, res, next) => {
    Artist.findById(req.body.artistId)
        .then(async artist => {
            if (artist === null) {
                return res.status(400).json({
                    message: 'There are no artists. Please create one, first.'
                })
            }

            const contactObj = await Contact.find()
                .then(contacts => {
                    return contacts.map(contact => {
                        return {
                            contactId: contact._id,
                            checked: false
                        }
                    })
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err
                    })
                })
                
            const taskObj = await Task.find()
                .then(tasks => {
                    return tasks.map(task => {
                        return {
                            taskId: task._id,
                            checked: false
                        }
                    })
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err
                    })
                })
            
            
            const campaign = new Campaign({
                songName: req.body.songName,
                releaseDate: req.body.releaseDate,
                contacts: contactObj,
                tasks: taskObj,
                userId: req.user.userId,
                artistId: artist._id
            });
    
            campaign.save()
                .then(campaign => {
                    Artist.findById(req.body.artistId)
                        .then(artist => {
                            artist.campaigns.push(campaign);
                            artist.save();
                            return res.status(200).json({
                                result: campaign
                            })
                        })
                        .catch(err => {
                            return res.status(400).json({
                                message: err
                            })
                        })
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
};

exports.postUploadCampaignImgUrl = (req, res, next) => {
    const campaignId = req.body.campaignId;
    const dataUUID = req.body.fileInfo.uuid;
    const imageUrl = `https://ucarecdn.com/${dataUUID}/-/preview/`;

    Campaign.updateOne({ _id: campaignId }, {
                imageUrl: imageUrl
            })
        .then(result => {
            return res.status(200).json({
                message: 'Image Updated, Successful.',
                result: result
            })
        })
        .catch(err => {
            return res.status(400).json({
                message: err
            })
        })
}

exports.getCampaigns = (req, res, next) => {
    Campaign.find({
        artistId: req.query.artistId
    })
    .then(campaigns => {
        if (campaigns.length === 0) {
            return res.status(400).json({
                message: 'There are no campaigns. Please create one.',
                campaigns: campaigns
            })
        }

        return res.status(200).json({
            campaigns: campaigns
        })
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })    
    })
};

exports.postDeleteCampaign = (req, res, next) => {
    Campaign.findById(req.body.campaignId)
        .then(campaign => {
            if (campaign === null) {
                return res.status(400).json({
                    message: 'Campaign doesn\'t exist.'
                })
            }

            return campaign.remove((err) => {
                if (!err) {
                    Artist.findOneAndUpdate({ _id: req.body.artistId }, { $pull: { campaigns: campaign._id } }, { new: true })
                        .then(updatedArtist => {
                            return res.status(200).json({
                                result: updatedArtist,
                                message: 'Campaign successfully deleted.'
                            })
                        })
                } else {
                    return res.status(400).json({
                        message: err
                    })
                }
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}