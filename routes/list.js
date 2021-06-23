const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    postCreateContact,
    postCreateTask,
    postDeleteContact,
    postDeleteTask,
    postUpdateTask,
    postUpdateContact,
    getAllContacts,
    getAllTasks
} = require('../controllers/list');

router.post('/api/create-contact', auth, postCreateContact);
router.post('/api/create-task', auth, postCreateTask);
router.post('/api/delete-contact', auth, postDeleteContact);
router.post('/api/delete-task', auth, postDeleteTask);
router.post('/api/update-contact', auth, postUpdateContact);
router.post('/api/update-task', auth, postUpdateTask);
router.get('/api/get-contacts', auth, getAllContacts);
router.get('/api/get-tasks', auth, getAllTasks);
    
module.exports = router;