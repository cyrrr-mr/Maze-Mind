const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    niveau: {
      type: String,
      enum: ["Facile", "Intermédiaire", "Difficile"],
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    steps: {
      type: Number,
      default: 0,
    },
    optimalSteps: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
    timeLimit: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Performance", performanceSchema);;