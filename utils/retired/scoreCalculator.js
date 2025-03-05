const wordList = require('word-list-json');
const wordSet = new Set(wordList.map(word => word.toUpperCase())); // Convert all words to uppercase for case-insensitive checking

// Now you can define your isValidWord function to use this set
async function isValidWord(word) {
  return wordSet.has(word.toUpperCase());
}

// Example usage
async function checkWords() {
  const words = ['zet', 'hello', 'qwerty', 'apple', 'EXAMPLE'];
  for (let word of words) {
    const isValid = await isValidWord(word);
    console.log(`Is "${word}" a valid word? ${isValid}`);
  }
}

checkWords();
