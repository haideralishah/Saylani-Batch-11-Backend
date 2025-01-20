import express from "express";
import userRoutes from './routes/user.js'
import authRoutes from './routes/authroutes.js'
import taskRoutes from './routes/task.js'
import mongoose from "mongoose";
import 'dotenv/config'
import authenticateUser from "./middlewares/authenticateUser.js";
import cors from 'cors'
import http from 'http';
import { Server } from 'socket.io';
import User from './models/User.js'
import Message from './models/Message.js'


const app = express();
app.use(express.json()); //poori app pe laga he
app.use(cors("*"))
//connect to database

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err))



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const userIds = {};

io.on("connection", async (socket) => {
  console.log(`User connected on: ${socket.id}`);


  socket.on('register_user', async (user) => {
    if (!user) return;
    // console.log(user.user._id, socket.id);
    userIds[user.user._id] = socket.id
    console.log("Connected User IDs:", userIds)


    let allUsers = await User.find({
      _id: { $ne: user.user._id }
    }).select("-password");

    socket.emit("fetch_users", { friendList: allUsers })
    // socket.emit('fetch_messages', {});

  })

  socket.on("fetch_prev_chat", async ({ receiverId, senderId }) => {
    console.log(' receiverId, senderId', receiverId, senderId)
    let prevMessages = await Message.find({
      $or: [
        {
          "receiverId": receiverId,
          "senderId": senderId
        },
        {
          "receiverId": senderId,
          "senderId": receiverId
        }
      ]
    });
    const targetSocket = userIds[senderId];

    console.log(prevMessages, 'prevMessages')
    prevMessages.forEach(({ message, senderId, receiverId }) => {
      io.to(targetSocket).emit("send_message", { message, senderId, receiverId });
    })

  })


  socket.on("new_message", async ({ message, senderId, receiverId }) => {
    console.log(message, senderId, receiverId)
    const targetSocket = userIds[receiverId];
    console.log(targetSocket);
    const newMessage = new Message({ message, senderId, receiverId });
    await newMessage.save();

    io.to(targetSocket).emit("send_message", { message, senderId, receiverId });

  })



  socket.on('disconnect', () => {
    console.log(`User disconned with socket id: ${socket.id}`);
    let [key] = Object.keys(userIds).filter((key) => userIds[key] === socket.id)
    delete userIds[key]
  })
})



app.get("/", (req, res) => {
  res.send("hello world");
});

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/task', authenticateUser, taskRoutes)


server.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`));


//route=>request=>controllers=>service=>controller=>response

//route banta he request kya lye

//controller , =>req se data lena , data ko validate krna ,
// =>service , service se jo data return hota he wo
// => response mein chala jata he

//service   //=> database se saara jo kaam wo service mein krte hen