import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    verifiedEmail: { type: Boolean, required: true, default: false },
})

const Users = mongoose.model('Users', usersSchema);

export default Users;