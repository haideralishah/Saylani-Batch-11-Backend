import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import mongoose, { mongo } from "mongoose";

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(morgan('short'));

const staticFolder = path.join(import.meta.dirname, "games");

mongoose
    .connect("")
    .then(() => { console.log("===========Database Connected===========") })
    .catch(() => { console.log("===========Database Connection Failed===========") })


// app.use(express.static(staticFolder));

// app.use((req, res) => {
//     console.log('File not found.');
//     res.status(400).send({ message: "file not found" });
// })

// app.get("/:fileName", (req, res) => {

//     const { fileName } = req.params;
//     const filePath = path.join(staticFolder, fileName)
//     res.sendFile(filePath);

// })



const userSchema = new mongoose.Schema({
    userName: String,
    city: { type: String, required: true, default: "Karachi" },
    email: {
        type: String,
        required: true,
        unique: true
    }
})


const user = mongoose.model("User", userSchema);




app.listen("3000", () => {
    console.log('Server started on port: 3000')
})
