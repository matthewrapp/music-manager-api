const User = require('../models/user');
const Artist = require('../models/artist');
const Campaign = require('../models/campaign');

const uploadcare = require('../node_modules/uploadcare/lib/main')(`${process.env.UPLOAD_CARE_PUBLIC_KEY}`, `${process.env.UPLOAD_CARE_SECRET_KEY}`);
const fs = require('fs');

exports.postCreateCampaign = (req, res, next) => {
    
    Artist.findById(req.body.artistId)
        .then(artist => {
            if (artist === null) {
                return res.status(400).json({
                    message: 'There are no artists. Please create one, first.'
                })
            }

            const campaign = new Campaign({
                songName: req.body.songName,
                releaseDate: req.body.releaseDate,
                userId: req.user.userId,
                artistId: artist._id
            });
    
            campaign.save()
                .then(campaign => {
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
            return res.status(500).json({
                message: err
            })
        })
};

exports.postUploadCampaignImage = (req, res, next) => {
    const path = req.files.campaignImg[0].path;
    const campaignId = req.body.campaignId;

    uploadcare.file.upload(fs.createReadStream(path), (err, response) => {
        if (err) {
            return res.status(400).json({
                message: err
            })
        }
        
        uploadcare.files.info(response.file, (err, data) => {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }

            const imageUrl = `https://ucarecdn.com/${data.uuid}/-/preview/`;
            Campaign.updateOne({ _id: campaignId }, {
                artworkUrl: imageUrl
            })
                .then(result => {
                    fs.unlink(path, (err) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                    })

                    return res.status(200).json({
                        message: 'Image Updated, Successful.'
                    })
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err
                    })
                })
        })
    })
}

exports.getCampaigns = (req, res, next) => {
    const userId = req.user.userId;

    Campaign.find({
        userId: req.user.userId
    })
    .then(campaigns => {
        if (campaigns.length === 0) {
            return res.status(400).json({
                message: 'There are no artists. Please create one.'
            })
        }

        return res.status(200).json({
            campaigns: campaigns
        })
    })
    
};