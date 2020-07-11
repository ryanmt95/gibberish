const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionBankSchema = new Schema(
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
    },
    { collection: 'questionbank' }
);

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema)

module.exports = QuestionBank