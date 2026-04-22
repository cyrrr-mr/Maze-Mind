const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    medals: {
      debutant: { type: Boolean, default: false },
      avance: { type: Boolean, default: false },
      pro: { type: Boolean, default: false },
    },
    progress: {
      Facile: { type: Number, default: 1 },
      Intermédiaire: { type: Number, default: 0 },
      Difficile: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);