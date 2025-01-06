import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Users from './model/users.js';
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('short'));

const { port, mongoDBURL, tokenSecret } = process.env;
mongoose
    .connect(mongoDBURL)
    .then(() => { console.log("===========Database Connected===========") })
    .catch(() => { console.log("===========Database Connection Failed===========") })

app.post('/signup', async (req, res) => {

    const hash_10 = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({ ...req.body, password: hash_10 });
    try {
        let saved = await newUser.save();
        res.send(saved);
    } catch (e) {
        res.send({ e });
    }
})

app.post("/login", async (req, res) => {

    const user = await Users.findOne({ email: req.body.email })

    if (!user) {
        res.send({ message: "User not found." })
        return;
    };

    const passwordMatched = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatched) {
        res.send({ message: "Incorrect password." });
        return;
    };

    delete user.password;
    const token = jwt.sign({ ...user }, tokenSecret);
    res.send({ token: token, ...user });
})


app.listen(port, () => {
    console.log(`Server Started on Port: ${port}`);
})

