// Import a JSON file containing valid words (word-list-json is an external dependency)
const wordList = require('word-list-json');

// Convert the word list into a Set for quick lookup (case-insensitive)
const wordSet = new Set(wordList.map(word => word.toUpperCase()));

function removeDuplicates(words) {
  const uniqueWords = Array.from(new Set(words));
  console.log('Removed duplicates, count from:', words.length, 'to:', uniqueWords.length);
  return uniqueWords;
}

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
  console.log('Generated permutations for letters:', letters, 'Count:', results.length);
  return results;
}

function generateAllSubsetPermutations(letters, boardWidth) {
  let allPermutations = [];

  for (let i = 2; i <= Math.min(boardWidth, letters.length); i++) {
    const combinations = getCombinations(letters, i);
    combinations.forEach(combination => {
      const perms = generatePermutations(combination);
      // Store only unique words in the Set
      perms.forEach(word => allPermutations.add(word));
    });
  }

  console.log('Generated all subset permutations for letters:', letters, 'Total count:', allPermutations.length);
  return allPermutations;
}

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
  console.log('Generated combinations for length', length, 'Result count:', result.length);
  return result;
}

function isValidWord(word) {
  const valid = wordSet.has(word.toUpperCase());
  console.log(`Checked validity for word: ${word}, Result: ${valid}`);
  return valid;
}

async function findAllValidWords(starterWord, letterPool, boardWidth) {
  
  let combinedLetters = [...letterPool, ...starterWord.toUpperCase().split('')];
  console.log('All letters combined:', combinedLetters.join(', '));

  // 10 letters = 10 min
  // 15 letters = 20 min
  const allSubsetPermutations = generateAllSubsetPermutations(combinedLetters, boardWidth);
 
  // 10 letters = 10 min
  // 15 letters = 20 min
  let validWords = allSubsetPermutations.filter(permutation => isValidWord(permutation));
  console.log('Total permutations to check:', allSubsetPermutations.length);
  
  const finalWords = removeDuplicates(validWords);
  console.log('Filtered to valid words:', validWords.length);
 
  return finalWords;
}

module.exports = { findAllValidWords };
