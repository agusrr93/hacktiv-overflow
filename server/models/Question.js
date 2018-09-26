const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    upVote: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    downVote: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    answer: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Answer'
        }
    ],tag: [String],visit:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]
}, {timestamps: true})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question