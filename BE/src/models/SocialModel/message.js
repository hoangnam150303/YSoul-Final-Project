const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    participant1: { type: String },
    participant1Name: { type: String },
    participant1Avatar: { type: String },
    participant2: { type: String },
    participant2Name: { type: String },
    participant2Avatar: { type: String },
    messages: [
      {
        user_id: { type: String },
        username: { type: String },
        avatar: { type: String },
        content: { type: String },
        image:{type:String},
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
