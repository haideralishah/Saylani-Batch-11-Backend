import express from "express";
import Task from "../models/Task.js";
import sendResponse from "../helpers/sendResponse.js";
const router = express.Router()

router.post('/', async (req, res) => {
    const { task } = req.body
    let newTask = new Task({
        task: task,
        createdBy: req.user._id
    })
    newTask = await newTask.save()
    sendResponse(res, 201, newTask, false, "Task Added Successfully")
})

router.get('/', async (req, res) => {
    const tasks = await Task.find({ createdBy: req.user._id })
    sendResponse(res, 200, tasks, false, "Task Added Successfully")
})
export default router