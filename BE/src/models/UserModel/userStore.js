const mongoose = require("mongoose");

const userStoreSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    NFTs:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NFTs",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userStore", userStoreSchema);
