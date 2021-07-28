const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    postCreateCampaign,
    getCampaigns,
    postUploadCampaignImgUrl,
    postDeleteCampaign
} = require('../controllers/campaign');

router.post('/api/create-campaign', auth, postCreateCampaign);
router.post('/api/upload-campaign-image', auth, postUploadCampaignImgUrl);
router.post('/api/delete-campaign', auth, postDeleteCampaign);
router.get('/api/get-campaigns', auth, getCampaigns);
    
module.exports = router;