const Question = require('../models/Question')
const Answer = require('../models/Answer')

module.exports = {
    notHisQuestion(req, res, next) {
        Question.findById(req.params.id)
            .then(question => {
                if (question.user == req.decoded.id) {
                    res.status(401).json({message: 'You are not allowed to access this question!'})
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    },
    notHisAnswer(req, res, next) {
        Answer.findById(req.params.id)
            .then(question => {
                if (question.user == req.decoded.id) {
                    res.status(401).json({message: 'You are not allowed to access this answer!'})
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }
}