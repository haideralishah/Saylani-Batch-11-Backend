import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'
import cors from 'cors'
import multer from 'multer';

// const upload = multer({
//     dest: 'uploads/'
// })

// const storage = multer.diskStorage({
//     destination: 'uploads/',
//     filename: function (req, file, callback) {
//         // dsafwercv.abcd.png
//         console.log(callback, 'callbackcallback')
//         let fileNameSplit = file.originalname.split(".");
//         let fileExtension = fileNameSplit[fileNameSplit.length - 1];
//         let fileName = fileNameSplit.slice(0, fileNameSplit.length - 1) + Math.random() + "." + fileExtension
//         callback(null, fileName);
//     }
// });

// const upload = multer({ storage })


const storage = multer.memoryStorage();
const upload = multer({ storage })

const app = express();
app.use(express.json());
app.use(cors("*"))
//connect to database

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err))

const fileSchema = new mongoose.Schema({
    fileName: String,
    buffer: Buffer
})

const FileUpload = mongoose.model("FileUpload", fileSchema);

app.post('/profile-upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    console.log(file);
    console.log(file.buffer);
    const newFile = new FileUpload({
        fileName: file.originalname,
        buffer: file.buffer
    })
    await newFile.save();
    res.end();
})



app.get('/profile-download/:picId', async (req, res) => {
    const file = req.params.picId;

    const fileFound = await FileUpload.findMany({
        fileName: file
    })
    console.log(fileFound);
    res.end();
})

app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`));


//route=>request=>controllers=>service=>controller=>response

//route banta he request kya lye

//controller , =>req se data lena , data ko validate krna ,
// =>service , service se jo data return hota he wo
// => response mein chala jata he

//service   //=> database se saara jo kaam wo service mein krte hen