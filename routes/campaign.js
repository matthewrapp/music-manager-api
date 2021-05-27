const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    postCreateCampaign,
    getCampaigns
} = require('../controllers/campaign');

router.post('/api/create-campaign', auth, postCreateCampaign);
router.get('/api/get-campaigns', auth, getCampaigns);
    
module.exports = router;