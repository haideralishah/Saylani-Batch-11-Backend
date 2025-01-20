import mongoose from "mongoose";

const { Schema } = mongoose;

let messageSchema = new Schema({
    message: { required: true, type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' }
})

let Message = mongoose.model('Message', messageSchema)

export default Message;