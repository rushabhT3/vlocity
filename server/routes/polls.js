const express = require('express');
const router = express.Router();

const pollController = require('../controllers/pollController');
const auth = require('../middleware/auth');

router.post('/create', auth, pollController.createPoll);
router.post('/vote', auth, pollController.votePoll);
router.get('/:id', pollController.getPoll);
router.get('/', pollController.getAllPolls);

module.exports = router;
