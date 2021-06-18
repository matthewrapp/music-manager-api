const User = require('../models/user');
const Artist = require('../models/artist');
const Campaign = require('../models/campaign');

const uploadcare = require('../node_modules/uploadcare/lib/main')(`${process.env.UPLOAD_CARE_PUBLIC_KEY}`, `${process.env.UPLOAD_CARE_SECRET_KEY}`);
const fs = require('fs');

const config = require('../config/config').get(process.env.NODE_ENV);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const campaign = require('../models/campaign');
const e = require('express');
const salt = 12;

exports.postSignup = (req, res, next) => {
    
    // check if passwords match
    if (req.body.password != req.body.confirmPassword) {
        return res.status(400).json({
            message: 'Passwords do not match.',
        });
    }
    // check to see if email exists
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    message: 'User already exists.'
                })
            }

            // hash password and create user
            bcrypt.hash(req.body.password, salt)
                .then(hashedPassword => {
                    const newUser = User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hashedPassword
                    });
                    // save user to db
                    return newUser.save();
                })
                .then(result => {
                    return res.status(200).json({
                        result: result
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        message: err
                    })
                })
        })
        .catch(err => {
             return res.status(500).json({
                message: err
            })
        })
    
}

exports.postUploadUserImgUrl = (req, res, next) => {
    const userId = req.user.userId;
    const dataUUID = req.body.fileInfo.uuid
    const imageUrl = `https://ucarecdn.com/${dataUUID}/-/preview/`;
    
    User.updateOne({ _id: userId }, {
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

// exports.postUploadUserImage = (req, res, next) => {
//     const path = req.files.profileImg[0].path;
//     const userId = req.user.userId;

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
//             User.updateOne({ _id: userId }, {
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
//             // User.findByIdAndUpdate(userId, {
//             //     imageUrl: imageUrl
//             // })
//             //     .then(user => {
//             //         fs.unlink(path, (err) => {
//             //             if (err) {
//             //                 console.log(err)
//             //                 return
//             //             }
//             //         })

//             //         return res.status(200).json({
//             //             result: user
//             //         })
//             //     })


//         })
//     })
// }

exports.postUpdateUserInfo = (req, res, next) => {
    // this updates user email, first & last name
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    User.findById(req.user.userId)
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'User doesn\'t exist. Please sign up.'
                })
            }
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email
            return user.save()
        })
        .then(savedUser => {
            return res.status(200).json({
                result: savedUser,
                message: 'User Updated.'
            })
        })
    
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let token = req.cookies.auth;

    // check to  see if user is already logged in
    if (token) {
        return res.status(200).json({
            message: 'You are already logged in'
        })
    }

    User.findOne({
        email: email
    })
    .then(user => {
        if (!user) {
            return res.status(400).json({
                message: 'User doesn\'t exist. Please sign up.'
            })
        }
        
        bcrypt.compare(password, user.password)
            .then(doMatch => {
                if (!doMatch) {
                    return res.status(400).json({
                        message: 'Password does not match. Try again.'
                    })
                }
                
                // sending back the token
                const payload = {
                    userId: user._id,
                    email: user.email
                }

                const token = jwt.sign(payload, config.SECRET);
                res.cookie('auth', token, {
                    httpOnly: true
                }).json({
                    isAuth: true,
                    token: token,
                    id: user._id,
                    email: user.email,
                    allUserArtists: user.artists,
                    selectedArtist: user.artists[0]
                })
            })
    })
}

exports.postLogout = (req, res, next) => {
    return res.status(200).json({
        message: 'You are logged out.'
    })
}

exports.postDeleteUser = async (req, res, next) => {

    Campaign.deleteMany({
        userId: req.user.userId
    })
        .then(() => {
            return Artist.deleteMany({
                userId: req.user.userId
            })
        })
        .then(() => {
            return User.deleteOne({
                _id: req.user.userId
            })
        })
        .then(result => {
            return res.status(200).json({
                result: result,
                message: 'User successfully deleted.'
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}

exports.getUserProfile = async (req, res, next) => {

    User.findById(req.user.userId)
        .then(user => {
            if (!user) {
                return res.status(400).json({
                        message: 'User not found. Please login or signup.'
                    })
            }

            return res.status(200).json({
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                imageUrl: user.imageUrl,
                date: user.date,
                artistIds: user.artists,
                primaryArtistId: user.artists[0]
            })
        })
}