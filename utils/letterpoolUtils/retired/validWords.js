const wordList = require('word-list-json');
const wordSet = new Set(wordList.map(word => word.toUpperCase())); // Load and convert all words to uppercase for case-insensitive checking

// Helper function to extract letters from tile objects
function extractLetters(tiles) {
  return tiles.map(tile => tile.letter);
}

// Function to remove duplicates from an array of words
function removeDuplicates(words) {
  return Array.from(new Set(words));
}

// Function to generate all permutations of a set of letters
function generatePermutations(letters) {
  let results = [];

  function permute(arr, m = []) {
    if (m.length > 0 && m.length <= letters.length) {
      results.push(m.join(''));
    }
    if (m.length === letters.length) return;
    for (let i = 0; i < arr.length; i++) {
      let curr = arr.slice();
      let next = curr.splice(i, 1);
      permute(curr, m.concat(next));
    }
  }

  permute(letters);
  return results;
}

// Function to generate all permutations for subsets of different lengths
function generateAllSubsetPermutations(letters) {
  let allPermutations = [];

  for (let i = 2; i <= letters.length; i++) {
    const combinations = getCombinations(letters, i);
    combinations.forEach(combination => {
      const perms = generatePermutations(combination);
      allPermutations = allPermutations.concat(perms);
    });
  }

  return allPermutations;
}

// Function to get all combinations of letters of a specific length
function getCombinations(chars, length) {
  let result = [];
  function f(prefix, chars) {
    for (let i = 0; i < chars.length; i++) {
      let newPrefix = prefix + chars[i];
      if (newPrefix.length === length) {
        result.push(newPrefix.split(''));
      } else {
        f(newPrefix, chars.slice(i + 1));
      }
    }
  }
  f('', chars);
  return result;
}

// Function to check if a word is in the dictionary
function isValidWord(word) {
  return wordSet.has(word.toUpperCase());
}

// Main function to find all valid words
async function findAllValidWords(prePlacedTiles, letterPool) {
  const prePlacedLetters = extractLetters(prePlacedTiles);
  const poolLetters = extractLetters(letterPool);
  const allLetters = [...prePlacedLetters, ...poolLetters];
  const allSubsetPermutations = generateAllSubsetPermutations(allLetters);
  let validWords = allSubsetPermutations.filter(permutation => isValidWord(permutation));
  validWords = removeDuplicates(validWords);
  return validWords;
}

// Filters valid words by basic English rules and then by dictionary
async function filterValidWords(words) {
  const wordsFilteredByRules = filterByBasicEnglishRules(words);
  const finalValidWords = filterByDictionary(wordsFilteredByRules, wordSet);
  return finalValidWords;
}

function filterByBasicEnglishRules(permutations) {
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
  return permutations.filter(word => word.split('').some(char => vowels.has(char.toUpperCase())));
}

function filterByDictionary(permutations, wordSet) {
  return permutations.filter(word => wordSet.has(word.toUpperCase()));
}

// Example usage with mock data
const prePlacedTiles = [{ id: 1, letter: 'T', isPrePlaced: true }, { id: 2, letter: 'E', isPrePlaced: true }];
const letterPool = [{ id: 6, letter: 'S', isPrePlaced: false }, { id: 7, letter: 'T', isPrePlaced: false }];

findAllValidWords(prePlacedTiles, letterPool).then(validWords => {
  console.log('Valid words:', validWords);
  filterValidWords(validWords).then(finalValidWords => {
    console.log('Final filtered words:', finalValidWords);
  });
});



