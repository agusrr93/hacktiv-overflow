const Answer = require('../models/Answer')
const Question = require('../models/Question')

class Controller {

    static postAnswer(req, res) {
        let newAnswer = {
            content: req.body.content,
            user: req.decoded.id,
            question: req.params.id
        }

        Answer.create(newAnswer)
            .then(answer => {
                Question.updateOne({_id: req.params.id}, {$push: {answer: answer._id}})
                    .then(() => {
                        Answer.findById(answer._id)
                            .populate('user', '_id name email')
                            .populate('upVote', '_id name email')
                            .populate('downVote', '_id name email')
                            .then(data => {
                                res.status(201).json(data)
                        })
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message})
                    })
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static updateAnswer(req, res) {
        let update = {
            content: req.body.content
        }

        Answer.update({_id: req.params.id}, update)
            .then(() => {
                Answer.findById(req.params.id)
                    .populate('user', '_id name email')
                    .populate('upVote', '_id name email')
                    .populate('downVote', '_id name email')
                    .then(answer => {
                        res.status(200).json(answer)
                    })
            })
            .catch(err => {
                res.send(500).json({error: err.message})
            })
    }

    static upVote(req, res) {
        Answer.updateOne({_id: req.params.id}, {$pull: {downVote: req.decoded.id}})
            .then(() => {
                Answer.updateOne({_id: req.params.id}, {$push: {upVote: req.decoded.id}})
                    .then(() => {
                        res.status(201).json({message: 'You just upvote this answer!'})
                    })
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static downVote(req, res) {
        Answer.updateOne({_id: req.params.id}, {$pull: {upVote: req.decoded.id}})
            .then(() => {
                Answer.updateOne({_id: req.params.id}, {$push: {downVote: req.decoded.id}})
                    .then(() => {
                        res.status(201).json({message: 'You just down vote this answer!'})
                    })
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

}

module.exports = Controller