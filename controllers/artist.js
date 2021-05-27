const User = require('../models/user');
const Artist = require('../models/artist');

// const config = require('../config/config').get(process.env.NODE_ENV);

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const user = require('../models/user');
// const salt = 12;


exports.postCreateArtist = (req, res, next) => {
    const artistName = req.body.artistName;
    const artistBio = req.body.artistBio;
    let isPrimaryArtist = false;

    User.findById(req.user.userId)
        .then(user => {
            if (user.artists.length == 0) {
                isPrimaryArtist = true;
                return user
            }

            return user
        })
        .then(user => {
            const newArtist = new Artist({
                artistName: artistName,
                artistBio: artistBio,
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
                            user.save()
                            return res.status(200).json({
                                result: user
                            })
                        })
                });
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
};

exports.getAllArtists = async (req, res, next) => {
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