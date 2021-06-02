const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    postSignup,
    postLogin,
    postLogout,
    postDeleteUser,
    getUserProfile,
    postUploadUserImage
} = require('../controllers/auth');

router.post('/api/register', postSignup);
router.post('/api/upload-user-image', auth, postUploadUserImage);
router.post('/api/login', postLogin);
router.post('/api/logout', auth, postLogout);
router.post('/api/delete-user', auth, postDeleteUser);
router.get('/api/user-profile', auth, getUserProfile);
    
module.exports = router;