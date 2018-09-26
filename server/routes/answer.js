const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth')
const {answer} = require('../middleware/isHim')
const {notHisAnswer} = require('../middleware/notHIm')
const {alreadyVoteAnswer, alreadyDownVoteAnswer} = require('../middleware/already')

const answerController = require('../controllers/answer')

/* GET users listing. */

router.post('/:id', auth, answerController.postAnswer)

router.put('/:id', auth, answer, answerController.updateAnswer)

router.patch('/upvote/:id', auth, notHisAnswer, alreadyVoteAnswer, answerController.upVote)
router.patch('/downvote/:id', auth, notHisAnswer, alreadyDownVoteAnswer, answerController.downVote)

module.exports = router;
