

import mongoose from "mongoose";
const { Schema } = mongoose;
const taskSchema = new Schema({
    task: String,
    completed: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task

const data = await Task.find().populate("User")



