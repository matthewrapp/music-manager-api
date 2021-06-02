const User = require('../models/user');
const Artist = require('../models/artist');

const uploadcare = require('../node_modules/uploadcare/lib/main')(`${process.env.UPLOAD_CARE_PUBLIC_KEY}`, `${process.env.UPLOAD_CARE_SECRET_KEY}`);
const fs = require('fs');
const artist = require('../models/artist');

// const config = require('../config/config').get(process.env.NODE_ENV);

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const user = require('../models/user');
// const salt = 12;


exports.postCreateArtist = (req, res, next) => {
    let isPrimaryArtist = false;
            
    User.findById(req.user.userId)
        .then(user => {
            if (!user || user === null) {
                return res.status(500).json({
                    message: 'User doesn\'t exist or must have been deleted in the past. Please sign up.'
                })
            }
            
            // setting artist to primary artist if there are no artists yet
            if (user.artists.length === 0) {
                isPrimaryArtist = true;
                return user
            }

            return user
        })
        .then(user => {
            const newArtist = new Artist({
                artistName: req.body.artistName,
                artistBio: req.body.artistBio,
                socialMedia: {
                    facebook: req.body.facebook,
                    instagram: req.body.instagram,
                    soundcloud: req.body.soundcloud
                },
                primary: isPrimaryArtist,
                userId: user._id
            });

            newArtist.save()
                .then(artist => {
                    User.findById(req.user.userId)
                        .then(user => {
                            if (!user) {
                                return res.status(500).json({
                                    message: 'User doesn\'t exist,'
                                })
                            }
                            user.artists.push(artist);
                            user.save();
                            return res.status(200).json({
                                result: artist
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

exports.postUploadArtistImage = (req, res, next) => {
    const path = req.files.artistImg[0].path;
    const artistId = req.body.artistId;

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
            Artist.updateOne({ _id: artistId }, {
                imageUrl: imageUrl
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
            // this way will be depreciated
            // Artist.findByIdAndUpdate(artistId, {
            //     imageUrl: imageUrl
            // })
            //     .then(artist => {
            //         fs.unlink(path, (err) => {
            //             if (err) {
            //                 console.log(err)
            //                 return
            //             }
            //         })

            //         return res.status(200).json({
            //             result: artist
            //         })
            //     })
        })
    })
}

exports.getAllArtists = (req, res, next) => {
    Artist.find({
        userId: req.user.userId
    })
        .then(artists => {
            if (!artists) {
                return res.status(400).json({
                    message: 'No artists with this user.'
                })
            }
            return res.status(200).json({
                artists: artists
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}