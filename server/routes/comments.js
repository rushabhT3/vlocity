const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/', auth, commentController.createComment);
router.get('/poll/:pollId', commentController.getCommentsForPoll);

module.exports = router;
