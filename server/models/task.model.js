const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String
    },
    priority: {
        type: String
    },
    ven_date: {
        type: Date
    },
    user_id: {
        type: String,
        required: true
    }
});

const Task = model('task', taskSchema);

module.exports = Task;