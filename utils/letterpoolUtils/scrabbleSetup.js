const { findAllValidWords } = require('./scrabbleLogic');
const scrabbleLetters = {
  'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3,
  'H': 2, 'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6,
  'O': 8, 'P': 2, 'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4,
  'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1
};

// Define constants for the Scrabble setup
const numberOfPoolLetters = 10;
const numberOfPreplaced = 3;
const numberOfFeatures = 5;
const boardWidth = 5; 
const boardSize = boardWidth * boardWidth;

// DEV NOTE: 
// Algo is set up to grab next one, so if we want to balance featureTypes
// we need to do the math and add the appropriate number. 
// For example, if we want double as many dLS we should have 2x the number in this array
// I think it picks it like a pool.. or we need to add a weight to these.

// Define the feature types and their multipliers
const featureTypes = [
  { type: 'doubleLetterScore', multiplier: 2 },
  { type: 'tripleLetterScore', multiplier: 3 },
  { type: 'doubleLetterScore', multiplier: 2 },
  { type: 'tripleLetterScore', multiplier: 3 },
  { type: 'doubleLetterScore', multiplier: 2 },
  { type: 'tripleLetterScore', multiplier: 3 },
  // continue as before
];

/**
 * Simulates drawing a specified number of letters from a Scrabble bag after accounting for the letters
 * used in a starter word. This function first removes the letters of the starter word from the pool,
 * and then randomly draws the remaining letters.
 *
 * @param {number} numberOfLetters - The number of letters to draw after removing the starterWord letters.
 * @param {string} starterWord - A word that has already been "played," whose letters are to be removed from the bag.
 * @returns {Array} The letters drawn from the bag after accounting for the starter word.
 */
function drawLetters(numberOfLetters, starterWord) {
  const letters = [];
  for (const letter in scrabbleLetters) {
    for (let i = 0; i < scrabbleLetters[letter]; i++) {
      letters.push(letter);
    }
  }

  // Remove the letters used in the starterWord from the bag
  for (const letter of starterWord.toUpperCase()) {
    const index = letters.indexOf(letter);
    if (index !== -1) {
      letters.splice(index, 1);
    } else {
      console.error(`Not enough of letter ${letter} in bag to form the starter word.`);
      return; // Optional: Handle the error more gracefully
    }
  }

  const drawnLetters = [];
  for (let i = 0; i < numberOfLetters; i++) {
    if (letters.length === 0) break;
    const randomIndex = Math.floor(Math.random() * letters.length);
    drawnLetters.push(letters.splice(randomIndex, 1)[0]);
  }

  return drawnLetters;
}

/**
 * Places a starter word randomly on a board of given size and returns the positions of each letter.
 * The word can be placed either horizontally or vertically.
 *
 * @param {string} starterWord - The word to be placed on the board.
 * @param {number} boardWidth - The width (and height) of the square board.
 * @returns {Object} An object containing the starter word and the positions of its letters.
 */
// Assuming placeStarterWord function only returns an array of positions
function placeStarterWord(starterWord, boardWidth) {
  const orientation = Math.floor(Math.random() * 2);
  let positions = [];
  const rowOrCol = Math.floor(Math.random() * boardWidth);
  const maxStartIndex = boardWidth - starterWord.length;

  if (orientation === 0) { // Horizontal
    const startCol = Math.floor(Math.random() * (maxStartIndex + 1));
    for (let i = 0; i < starterWord.length; i++) {
      positions.push(rowOrCol * boardWidth + startCol + i);
    }
  } else { // Vertical
    const startRow = Math.floor(Math.random() * (maxStartIndex + 1));
    for (let i = 0; i < starterWord.length; i++) {
      positions.push((startRow + i) * boardWidth + rowOrCol);
    }
  }
  return positions;
}




function generateUniquePositions(count, max) {
  const positions = new Set();
  while (positions.size < count) {
    const position = Math.floor(Math.random() * max) + 1;
    positions.add(position);
  }
  return Array.from(positions);
}

function placeFeatureTiles(featureCount, boardSize, occupiedPositions) {
  const features = {};
  const availableFeatures = featureTypes.slice();

  while (Object.keys(features).length < featureCount && availableFeatures.length > 0) {
    const featureIndex = Math.floor(Math.random() * availableFeatures.length);
    const feature = availableFeatures.splice(featureIndex, 1)[0];

    let position;
    do {
      position = Math.floor(Math.random() * boardSize) + 1;
    } while (occupiedPositions.includes(position) || features[position]);

    features[position] = { type: feature.type, multiplier: feature.multiplier };
  }

  return features;
}


  // Print board to console
 function printBoard(prePlacedTiles, featureSquares) {
  const board = Array.from({ length: boardWidth }, () => Array.from({ length: boardWidth }, () => ' . '));
  
  // Place feature tiles
  for (const [position, feature] of Object.entries(featureSquares)) {
      const idx = parseInt(position) - 1;
      const row = Math.floor(idx / boardWidth);
      const col = idx % boardWidth;
      board[row][col] = `${feature.type[0]}${feature.multiplier}`; // Simplified feature representation
  }

  // Place pre-placed tiles
  prePlacedTiles.forEach(tile => {
      const idx = tile.position - 1;
      const row = Math.floor(idx / boardWidth);
      const col = idx % boardWidth;
      board[row][col] = ` ${tile.letter} `;
  });

  // Print the board to the console
  board.forEach(row => console.log(row.join('|')));
}

async function generateScrabbleSetup(starterWord) {
  // Example usage:
  const poolLetters = drawLetters(numberOfPoolLetters, starterWord);
  //const validWords = await findAllValidWords(starterWord, poolLetters, boardWidth);

  const positions = placeStarterWord(starterWord, boardWidth);

  const letterPool = poolLetters.map((letter, index) => ({
    id: index + 6,
    letter,
    isPrePlaced: false
  }));
  
  // Formatting starterWord for frontend
  const starterWordObj = starterWord.split('').map((letter, index) => ({
    id: index + 1,  // Starting IDs from 1 for pre-placed letters
    letter: letter.toUpperCase(),
    position: positions[index],
    isPrePlaced: true
  }));
  
  return {
    letterPool,
    starterWordObj,
    maxScore: 50
    //prePlacedTiles,
    //featureSquares,
    //validWords
  };
  
}

module.exports = { generateScrabbleSetup };
