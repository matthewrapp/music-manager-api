const User = require('../models/user');
const Artist = require('../models/artist');

const config = require('../config/config').get(process.env.NODE_ENV);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const artist = require('../models/artist');
const salt = 12;


exports.postCreateArtist = (req, res, next) => {
    const artistName = req.body.artistName;
    const artistBio = req.body.artistBio;
    console.log(req.body);

    const newArtist = new Artist({
        artistName: artistName,
        artistBio: artistBio,
        socialMedia: {
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            soundcloud: req.body.soundcloud
        },
        userId: req.user.userId
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
                    user.artist.push(artist);
                    user.save()
                    return res.status(200).json({
                        result: user
                    })
                })
        });
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
}