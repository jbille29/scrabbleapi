const wordList = require('word-list-json');
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

function generateAllSubsetPermutations(letters) {
  let allPermutations = [];

  for (let i = 2; i <= letters.length; i++) {
    const combinations = getCombinations(letters, i);
    combinations.forEach(combination => {
      const perms = generatePermutations(combination);
      allPermutations = allPermutations.concat(perms);
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

async function findAllValidWords(starterWord, letterPool) {
  
  let combinedLetters = [...letterPool, ...starterWord.toUpperCase().split('')];
  console.log('All letters combined:', combinedLetters.join(', '));

  const allSubsetPermutations = generateAllSubsetPermutations(combinedLetters);
 
  let validWords = allSubsetPermutations.filter(permutation => isValidWord(permutation));
  console.log('Total permutations to check:', allSubsetPermutations.length);
  
  const finalWords = removeDuplicates(validWords);
  console.log('Filtered to valid words:', validWords.length);
 
  return finalWords;
}

module.exports = { findAllValidWords };
