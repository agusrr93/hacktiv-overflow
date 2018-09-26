const Question = require('../models/Question')
const Answer = require('../models/Answer')

module.exports = {
    alreadyVoteQuestion(req, res, next) {
        Question.findOne({_id: req.params.id, upVote: req.decoded.id})
            .then(question => {
                if (question) {
                    res.status(401).json({error: 'You are not allowed to vote this question!'})
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    },
    alreadyDownVoteQuestion(req, res, next) {
        Question.findOne({_id: req.params.id, downVote: req.decoded.id})
            .then(question => {
                if (question) {
                    res.status(401).json({error: 'You are not allowed to down vote this question!'})
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    },
    alreadyVoteAnswer(req, res, next) {
        Answer.findOne({_id: req.params.id, upVote: req.decoded.id})
            .then(question => {
                if (question) {
                    res.status(401).json({error: 'You are not allowed to vote this answer!'})
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    },
    alreadyDownVoteAnswer(req, res, next) {
        Answer.findOne({_id: req.params.id, downVote: req.decoded.id})
            .then(question => {
                if (question) {
                    res.status(401).json({error: 'You are not allowed to vote this answer!'})
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }
}