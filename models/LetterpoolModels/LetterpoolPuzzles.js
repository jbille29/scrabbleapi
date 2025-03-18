const mongoose = require('mongoose');

const LetterpoolPuzzleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  letterPool: [{ id: Number, letter: String, isPrePlaced: Boolean }],
  starterWordObj: [{ id: Number, letter: String, position: Number, isPrePlaced: Boolean }],
  maxScore: { type: Number, required: true },
});

module.exports = mongoose.model('LetterpoolPuzzle', LetterpoolPuzzleSchema);
