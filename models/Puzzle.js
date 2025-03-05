const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
    date: { type: Date, unique: true, required: true },
    letterPool: [{ id: Number, letter: String, isPrePlaced: Boolean }],
    starterWordObj: [{ id: Number, letter: String, position: Number, isPrePlaced: Boolean }],
    validWords: [String]
});

module.exports = mongoose.model('Puzzle', puzzleSchema);
