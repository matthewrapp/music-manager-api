const User = require('../models/user');
const Artist = require('../models/artist');

// const uploadcare = require('../node_modules/uploadcare/lib/main')(`${process.env.UPLOAD_CARE_PUBLIC_KEY}`, `${process.env.UPLOAD_CARE_SECRET_KEY}`);
// const fs = require('fs');
// const artist = require('../models/artist');
// const user = require('../models/user');
// const { update } = require('../models/user');


exports.postCreateArtist = (req, res, next) => {
    let isPrimaryArtist = false;
            
    User.findById(req.user.userId)
        .then(async user => {
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

exports.postUploadArtistImgUrl = (req, res, next) => {
    const artistId = req.body.artistId;
    const dataUUID = req.body.fileInfo.uuid
    const imageUrl = `https://ucarecdn.com/${dataUUID}/-/preview/`;
    
    Artist.updateOne({ _id: artistId }, {
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

// exports.postUploadArtistImage = (req, res, next) => {
//     const path = req.files.artistImg[0].path;
//     const artistId = req.body.artistId;

//     uploadcare.file.upload(fs.createReadStream(path), (err, response) => {
//         if (err) {
//             return res.status(400).json({
//                 message: err
//             })
//         }

//         uploadcare.files.info(response.file, (err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     message: err
//                 })
//             }

//             const imageUrl = `https://ucarecdn.com/${data.uuid}/-/preview/`;
//             Artist.updateOne({ _id: artistId }, {
//                 imageUrl: imageUrl
//             })
//                 .then(result => {
//                     fs.unlink(path, (err) => {
//                         if (err) {
//                             console.log(err)
//                             return
//                         }
//                     })

//                     return res.status(200).json({
//                         message: 'Image Updated, Successful.'
//                     })
//                 })
//                 .catch(err => {
//                     return res.status(400).json({
//                         message: err
//                     })
//                 })
//             // this way will be depreciated
//             // Artist.findByIdAndUpdate(artistId, {
//             //     imageUrl: imageUrl
//             // })
//             //     .then(artist => {
//             //         fs.unlink(path, (err) => {
//             //             if (err) {
//             //                 console.log(err)
//             //                 return
//             //             }
//             //         })

//             //         return res.status(200).json({
//             //             result: artist
//             //         })
//             //     })
//         })
//     })
// }

exports.postUpdateArtist = (req, res, next) => {
    Artist.findById(req.body.artistId)
        .then(artist => {
            if (!user) {
                return res.status(400).json({
                    message: 'Artist doesn\'t exist. Please create an artist.'
                })
            }
            artist.artistName = req.body.artistName;
            artist.artistBio = req.body.artistBio;
            artist.socialMedia.facebook = req.body.facebook;
            artist.socialMedia.instagram = req.body.instagram;
            artist.socialMedia.soundcloud = req.body.instagram;
            return artist.save()
        })
        .then(savedArtist => {
            return res.status(200).json({
                result: savedArtist,
                message: 'User Updated.'
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}

exports.postDeleteArtist = async (req, res, next) => {
    Artist.findById(req.body.artistId)
        .then(artist => {
            if (artist.primary) {
                return res.status(400).json({
                    artist: artist,
                    message: 'Can\'t delete a primary artist. Please change your primary artist, then delete this artist.'
                })
            }
            return artist.remove((err) => {
                if (!err) {
                    console.log('no error')
                    User.findOneAndUpdate({ _id: req.user.userId }, { $pull: { artists: artist._id } }, { new: true })
                        .then(updatedUser => {
                            return res.status(200).json({
                                result: updatedUser,
                                message: 'Aritst successfully deleted.'
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
            console.log(err)
            return res.status(500).json({
                message: err
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