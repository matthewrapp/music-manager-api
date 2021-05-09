const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
    postSignup,
    postLogin,
    postLogout,
    postDeleteUser,
    getUserProfile
} = require('../controllers/auth');

router.post('/api/register', postSignup);
router.post('/api/login', postLogin);
router.post('/api/logout', auth, postLogout);
router.post('/api/delete-user', auth, postDeleteUser)
router.get('/api/user-profile', auth, getUserProfile)

module.exports = router;