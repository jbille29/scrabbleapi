const fs = require('fs');

// Load the word list
const wordList = JSON.parse(fs.readFileSync('./data/words.json', 'utf8'));

// Convert to a Set for fast lookups
const wordSet = new Set(wordList);

const testWords = [ "he","oe",
  "able", "aces", "acid", "acts", "adds", "aged", "aims", "also", "amps", "arts", "axes",
  "bake", "bald", "band", "bats", "beam", "been", "belt", "best", "bias", "bits", "blue",
  "cafe", "cage", "calm", "caps", "cars", "cats", "chip", "clan", "clip", "code", "cool",
  "dame", "dark", "data", "deep", "deny", "dial", "dies", "dish", "does", "dose", "duty",
  "each", "echo", "edit", "emit", "ends", "envy", "epic", "exam", "exit", "eyes", "extra",
  "fact", "fade", "fair", "fake", "fate", "feed", "film", "find", "fire", "five", "flood",
  "gale", "game", "gear", "gems", "gets", "girl", "glad", "glue", "goal", "goes", "grab",
  "half", "hand", "head", "heal", "hero", "hint", "hire", "hold", "hope", "huge", "humor"
];

// Check which words exist in the Scrabble dictionary
const results = testWords.map(word => ({
  word,
  isValid: wordSet.has(word)
}));

// Display results
console.table(results);
