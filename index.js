require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Puzzle = require('./models/Puzzle'); // Import Mongoose model
const { config } = require('dotenv');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/**
 * Fetch the daily puzzle from MongoDB
 */
const getDailyPuzzle = async (clientDate) => {
    // Convert the client's local date to UTC
    const userDate = new Date(clientDate); // Use the client's date
    const todayUTC = new Date(Date.UTC(userDate.getUTCFullYear(), userDate.getUTCMonth(), userDate.getUTCDate()));

    console.log("📅 Fetching puzzle for (Client's Date in UTC):", todayUTC.toISOString());


    try {
        const puzzle = await Puzzle.findOne({ date: todayUTC });

        if (!puzzle) {
          console.log("⚠️ No puzzle found for:", todayUTC.toISOString());
          return null;
        }

        return puzzle;
    } catch (error) {
        console.error("❌ Error fetching daily puzzle:", error);
        return null;
    }
};

// Update the API to accept a date parameter
app.get('/scrabble-setup', async (req, res) => {
  try {
      const clientDate = req.query.date || new Date().toISOString().split("T")[0]; // Default to today
      const setup = await getDailyPuzzle(clientDate);

      if (!setup) {
          return res.status(404).json({ error: 'Puzzle not found for this date' });
      }

      res.json(setup);
  } catch (error) {
      console.error('Failed to fetch Scrabble puzzle:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// **Start the server**
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
