import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Users from './model/users.js';
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('short'));

const {
    port,
    mongoDBURL,
    tokenSecret,
    senderEmail,
    senderPassword
} = process.env;
mongoose
    .connect(mongoDBURL)
    .then(() => { console.log("===========Database Connected===========") })
    .catch(() => { console.log("===========Database Connection Failed===========") })

function sendEmail(recepientEmail, token) {
    console.log(recepientEmail, token);
    const mailOption = {
        from: senderEmail,
        to: recepientEmail,
        html: `<p>Please verify your email and click on the link below: 
                    <a href="http://ourfrontend.com/${token}" target="_blank">
                       Click here
                    </a>
        </p>`,
        subject: "Verification Email"
    }
    transporter.sendMail(mailOption, (error, succes) => {
        if (error) return res.send(err);

        console.log('Successfully sent.')
    })
}


app.post('/signup', async (req, res) => {

    const hash_10 = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({ ...req.body, password: hash_10 });

    try {
        let saved = await newUser.save();
        delete saved.password;
        const verificationToken = jwt.sign({ ...saved }, tokenSecret, { expiresIn: "1h" });

        sendEmail(req.body.email, verificationToken);
        res.send(saved);
    } catch (e) {
        res.send({ e });
    }
})

app.post('/verifyemail', async (req, res) => {
    const { token } = req.headers;
    const verified = jwt.verify(token, tokenSecret);
    console.log(verified._doc._id);

    const update = await Users.findByIdAndUpdate(verified._doc._id, { verifiedEmail: true });
    console.log(update, 'Email Verified');
    res.end();
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

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: senderEmail,
        pass: senderPassword
    }
})
app.post('/sendEmail', (req, res) => {
    const { recepientEmail, emailBody, subject } = req.body;
    const mailOption = {
        from: senderEmail,
        to: recepientEmail,
        html: "<h1 style='color:green'>Hello World</h1>",
        subject
    }

    transporter.sendMail(mailOption, (err, emailSent) => {
        if (err) return res.send(err);

        console.log(emailSent);
        res.send({ "message": "email sent successfully" });

    });
})


app.listen(port, () => {
    console.log(`Server Started on Port: ${port}`);
})

