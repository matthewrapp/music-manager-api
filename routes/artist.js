const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
   postCreateArtist,
   getAllArtists
} = require('../controllers/artist');

router.post('/api/create-artist', auth, postCreateArtist);
router.get('/api/artists', auth, getAllArtists);

router.get('/check-token', auth, function(req, res) {
  res.sendStatus(200);
});

module.exports = router;