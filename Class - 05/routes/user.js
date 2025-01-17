import express from "express";
const router = express.Router()
import User from "../models/User.js";
import authenticateUser from "../middlewares/authenticateUser.js";

router.post('/', async (req, res) => {
    const { fullname, email } = req.body
    let newUser = new User({
        fullname,
        email
    })
    newUser = await newUser.save()
    res.status(201).json({
        msg: "User added successfully",
        error: false,
        data: newUser
    })
})

router.get('/', async (req, res) => {
    const users = await User.find()
    res.status(200).json({
        msg: "User fetched successfully",
        error: false,
        data: users
    })
})

router.get('/myInfo', authenticateUser, async (req, res) => {
    try {
        res.status(200).json({
            msg: 'User Found Successfully',
            error: false,
            data: req.user
        })
    }
    catch (err) {
        res.status(500).json({
            error: true,
            msg: "Something went wrong",
            data: null
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // const user = await User.findOne({_id : req.params.id})
        if (!user) return res.status(404).json({
            error: true,
            msg: "User not found",
            data: null
        })

        res.status(200).json({
            msg: "User found successfully",
            error: false,
            data: user
        })
    }
    catch (err) {
        res.status(500).json({
            error: true,
            msg: "Something went wrong",
            data: null
        })
    }

})

router.put('/:id', async (req, res) => {
    const { fullname, email } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({
        error: true,
        msg: "User not found",
        data: null
    })
    if (fullname) user.fullname = fullname
    if (email) user.email = email

    await user.save()

    res.status(200).json({
        msg: "User updated successfully",
        error: false,
        data: user
    })
})

export default router