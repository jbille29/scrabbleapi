require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // ✅ Security Middleware
const rateLimit = require('express-rate-limit'); // ✅ Prevent Abuse
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const Puzzle = require('./models/Puzzle');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// ✅ Middleware Setup
//app.use(cors({ origin: process.env.FRONTEND_URL })); // Restrict to frontend
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(helmet()); // Secure Headers
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 100 })); // 100 requests per min

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Fetch Daily Puzzle
const getDailyPuzzle = async (clientDate) => {
  const queryDate = new Date(`${clientDate}T00:00:00.000Z`);
  console.log("📅 Fetching puzzle for:", queryDate.toISOString());

  try {
    const puzzle = await Puzzle.findOne({ 
      date: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 86400000) } 
    });

    return puzzle || null;
  } catch (error) {
    console.error("❌ Error fetching daily puzzle:", error);
    return null;
  }
};

// ✅ Fake Puzzle for Testing
const getFakeDailyPuzzle = () => ({
  _id: new ObjectId(),
  date: new Date(),
  letterPool: Array.from("AUMENTOLTJ").map((letter, i) => ({
    id: i + 6,
    letter,
    isPrePlaced: false,
    _id: new ObjectId()
  })),
  starterWordObj: Array.from("CAME").map((letter, i) => ({
    id: i + 1,
    letter,
    position: (i + 1) * 5,
    isPrePlaced: true,
    _id: new ObjectId()
  })),
  maxScore: 50,
  __v: 0,
});

// ✅ Route: Fetch Puzzle (Real or Fake)
app.get('/scrabble-setup', async (req, res) => {
  try {
    console.time("⏳ Fetching puzzle");
    const clientDate = req.query.date || new Date().toISOString().split("T")[0];
    const setup = await getDailyPuzzle(clientDate) || getFakeDailyPuzzle();
    console.timeEnd("⏳ Fetching puzzle");

    if (!setup) return res.status(404).json({ error: 'Puzzle not found' });

    res.json(setup);
  } catch (error) {
    console.error('❌ Failed to fetch puzzle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Route: Serve Word List
app.get('/api/words', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'clean_words.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load word list' });
    res.json(JSON.parse(data));
  });
});

// ✅ Start Server
app.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
