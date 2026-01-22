const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
    },
    contentType: {
        type: String,
        enum: ["text", "image", "audio", "video", "file"],
    },
    mediaUrl: {  // for image, audio, video, file
        type: String,
        default: null,
    },
    reactions: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User",},
        emoji: string,
    }],

    messageStatus: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent",
    },

}); {timestamps: true}

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;