const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    content: { type: String },
    image: { type: String },
    likes:[{
        user_id: { type: String },
        username: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    comments: [
      {
        user_id: { type: String },
        username: { type: String },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
        commentReplied: [
            {
                user_id: { type: String },
                username: { type: String },
                content: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ]
      },
    ],
    film_id: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    single_id: { type:String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
