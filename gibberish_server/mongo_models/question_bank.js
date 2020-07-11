const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            unique: true,
            required: true
        },

        answer: {
            type: String,
            unique: true,
            required: true
        }
    }
);

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema)

module.export = QuestionBank