const Puzzle = require('../models/LetterpoolModels/LetterpoolPuzzles');

exports.getDailyPuzzle = async (req, res) => {
  try {
    const clientDate = req.query.date || new Date().toISOString().split("T")[0];
    const queryDate = new Date(`${clientDate}T00:00:00.000Z`);
    
    const puzzle = await Puzzle.findOne({
      date: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 86400000) }
    });

    if (!puzzle) return res.status(404).json({ error: 'Puzzle not found' });

    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch puzzle' });
  }
};

exports.getFakeDailyPuzzle = (req, res) => {
  const fakePuzzle = {
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
  };

  res.json(fakePuzzle);
};
