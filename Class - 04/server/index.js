/*
    1. create channel
    2. subscribe on("channel_name")
    3. broadcaster to(socketId).emit("channel_name")
*/

import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
const app = express();
app.use(cors("*"));
app.use(morgan("dev"));

const appServer = http.createServer(app);
const io = new Server(appServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const messageSchema = new mongoose.Schema({
//   message: String,
// });
// const Message = mongoose.model("message", messageSchema);

// io.to().on()
const usersSocketId = {};
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("registeruser", (uid) => {
    usersSocketId[uid] = socket.id;
  });

  socket.on("new_chat", async (data) => {
    console.log("New Message:", data);
    // let newMessage = new Message({ message: data.message });
    // const savedMessage = await newMessage.save();
    io.emit("new_chat", { ...data });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

appServer.listen(3000, () => {
  console.log("=====Server Connected on Port: 3000=====");
});
