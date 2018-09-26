const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth')
const {question} = require('../middleware/isHim')
const {notHisQuestion} = require('../middleware/notHIm')
const {alreadyVoteQuestion, alreadyDownVoteQuestion} = require('../middleware/already')

const questionController = require('../controllers/question')

/* GET users listing. */
router.get('/', questionController.getQuestion)

router.post('/', auth, questionController.postQuestion)

router.put('/:id', auth, question, questionController.updateQuestion)

router.delete('/:id', auth, question, questionController.deleteQuestion)

router.patch('/upvote/:id', auth, notHisQuestion, alreadyVoteQuestion, questionController.upVote)
router.patch('/downvote/:id', auth, notHisQuestion, alreadyDownVoteQuestion, questionController.downVote)

router.get('/:id', questionController.getSpesificQuestion)

module.exports = router;
