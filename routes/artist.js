const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  postCreateArtist,
  getAllArtists,
  postUploadArtistImgUrl,
  postDeleteArtist,
  postUpdateArtist
} = require('../controllers/artist');

router.post('/api/create-artist', auth, postCreateArtist);
router.post('/api/delete-artist', auth, postDeleteArtist);
router.post('/api/edit-artist', auth, postUpdateArtist);
router.get('/api/artists', auth, getAllArtists);
router.post('/api/upload-artist-img', auth, postUploadArtistImgUrl);
router.get('/api/check-token', auth, function(req, res) {
  res.sendStatus(200);
});

module.exports = router;