// models/performance.model.js
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maze: { type: mongoose.Schema.Types.ObjectId, ref: 'Maze', required: true }, // <- c’est ici
  score: { type: Number, required: true },
  time: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);