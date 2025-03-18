const express = require('express');

const { getDailyPuzzle } = require('../controllers/letterPoolController');

const router = express.Router();

router.get('/daily', getDailyPuzzle);
//router.get('/fake', getFakeDailyPuzzle);


router.get('/words', (req, res) => {
    fs.readFile(path.join(__dirname, '../data/clean_words.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to load word list' });
        res.json(JSON.parse(data));
    });
});


module.exports = router;
