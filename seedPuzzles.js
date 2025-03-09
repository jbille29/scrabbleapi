//require('dotenv').config();
const mongoose = require('mongoose');
const { generateScrabbleSetup } = require('./utils/scrabbleSetup'); // Import your puzzle generator function
const Puzzle = require('./models/Puzzle'); // Your Mongoose model

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://jbille29:192917aW$@cluster0.xbxegqm.mongodb.net/';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const starterWords = [
    "sun", "mist", "flame", "brim", "clap", 
    "grit", "vault", "spine", "drum", "quill",
    "shade", "charm", "pluck", "brisk", "frost", 
    "creek", "swift", "gleam", "flint", "zap"
];
// Function to seed puzzles
const seedPuzzles = async (startDate, numDays) => {
    let currentDate = new Date(startDate);

    for (let i = 0; i < numDays; i++) {
        try {
            const puzzleData = await generateScrabbleSetup(starterWords[1]);

            const newPuzzle = new Puzzle({
                date: new Date(currentDate), // Store date in UTC
                letterPool: puzzleData.letterPool,
                starterWordObj: puzzleData.starterWordObj
            });

            await newPuzzle.save();
            console.log(`✅ Puzzle for ${currentDate.toISOString().split('T')[0]} saved.`);

        } catch (error) {
            console.error(`❌ Error generating puzzle for ${currentDate}:`, error);
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("🎉 Seeding complete!");
    mongoose.disconnect();
};

// Run script with command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error("Usage: node seedPuzzles.js <start-date> <num-days>");
    process.exit(1);
}

const [startDate, numDays] = args;
seedPuzzles(startDate, parseInt(numDays, 10));
// node seedPuzzles.js 2025-03-09 10
