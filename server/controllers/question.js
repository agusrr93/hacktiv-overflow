const Question = require('../models/Question')

class Controller {

    static getQuestion(req, res) {
        Question.find()
            .sort({ createdAt: 'desc' })
            .populate('user', '_id name email')
            .populate('upVote', '_id name email')
            .populate('downVote', '_id name email')
            .populate({
                path: 'answer',
                select: '_id content user upVote downVote',
                populate: {
                    path: 'user',
                    select: '_id name email'
                }
            })
            .then(questions => {
                res.status(200).json(questions)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

     static getMyQuestion(req, res) {
        Question.find(
            {user:req.params.id}
        )
            .sort({ createdAt: 'desc' })
            .populate('user', '_id name email')
            .populate('upVote', '_id name email')
            .populate('downVote', '_id name email')
            .populate({
                path: 'answer',
                select: '_id content user upVote downVote',
                populate: {
                    path: 'user',
                    select: '_id name email'
                }
            })
            .then(questions => {
                res.status(200).json(questions)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static postQuestion(req, res) {
        let newQuestion = {
            title: req.body.title,
            description: req.body.description,
            user: req.decoded.id
        }

        Question.create(newQuestion)
            .then(() => {
                res.status(201).json({message: 'Question created!'})
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static updateQuestion(req, res) {
        let update = {
            title: req.body.title,
            description: req.body.description
        }

        Question.updateOne({_id: req.params.id}, update)
            .then(() => {
                res.status(200).json({message: 'Question updated!'})
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static deleteQuestion(req, res) {
        Question.deleteOne({_id: req.params.id})
            .then(() => {
                res.status(200).json({message: 'Question deleted!'})
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static upVote(req, res) {
        Question.updateOne({_id: req.params.id}, {$pull: {downVote: req.decoded.id}})
            .then(() => {
                Question.updateOne({_id: req.params.id}, {$push: {upVote: req.decoded.id}})
                    .then(() => {
                        res.status(201).json({message: 'You just upvote this question!'})
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message})
                    })
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static downVote(req, res) {
        Question.updateOne({_id: req.params.id}, {$pull: {upVote: req.decoded.id}})
            .then(() => {
                Question.updateOne({_id: req.params.id}, {$push: {downVote: req.decoded.id}})
                    .then(() => {
                        res.status(201).json({message: 'You just down vote this question!'})
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message})
                    })
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static getSpesificQuestion(req, res) {
        Question.findById(req.params.id)
            .populate('user', '_id name email')
            .populate('upVote', '_id name email')
            .populate('downVote', '_id name email')
            .populate({
                path: 'answer',
                select: '_id content user upVote downVote',
                populate: {
                    path: 'user',
                    select: '_id name email'
                }
            })
            .then(question => {
                res.status(200).json(question)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

}

module.exports = Controller