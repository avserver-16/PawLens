const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

router.post('/', feedbackController.createFeedback);
router.get('/top', feedbackController.getTopFeedback);

module.exports = router;
