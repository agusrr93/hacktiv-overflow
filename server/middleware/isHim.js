const Article = require('../models/Question')
const Comment = require('../models/Answer')

module.exports = {
  question: (req, res, next) => {
    Article.findById(req.params.id)
      .then(article => {
        if (article.user == req.decoded.id) {
          next()
        } else {
          res.status(401).json({error: 'You are not allowed to access this question!'})
        }
      })
      .catch(err => {
        res.status(500).json({error: err.message})
      })
  },
  answer: (req, res, next) => {
    Comment.findById(req.params.id)
      .then(comment => {
        if (comment.user == req.decoded.id) {
          next()
        } else {
          res.status(401).json({error: 'You are not allowed to access this answer!'})
        }
      })
      .catch(err => {
        res.status(500).json({error: err.message})
      })
  }
}