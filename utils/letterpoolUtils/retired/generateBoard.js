

const scrabbleLetters = {
  'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3,
  'H': 2, 'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6,
  'O': 8, 'P': 2, 'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4,
  'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1, '_': 2
};

const featureTypes = [
  { type: 'doubleLetterScore', multiplier: 2 },
  { type: 'tripleLetterScore', multiplier: 3 },
  { type: 'doubleWordScore', multiplier: 2 },
  { type: 'tripleWordScore', multiplier: 3 },
  { type: 'subtractPoints', multiplier: -1 }
];

function drawLetters(numberOfLetters) {
  const letters = [];
  for (const letter in scrabbleLetters) {
      for (let i = 0; i < scrabbleLetters[letter]; i++) {
          letters.push(letter);
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

function generateScrabbleSetup() {
  const numberOfPoolLetters = 7;
  const numberOfPreplaced = 5;
  const boardSize = 16;

  const poolLetters = drawLetters(numberOfPoolLetters);
  const prePlacedLetters = drawLetters(numberOfPreplaced);
  const randomPositions = generateUniquePositions(numberOfPreplaced, boardSize);

  const letterPool = poolLetters.map((letter, index) => ({
      id: index + 6,
      letter,
      isPrePlaced: false
  }));

  const prePlacedTiles = prePlacedLetters.map((letter, index) => ({
      id: index + 1,
      letter,
      position: randomPositions[index],
      isPrePlaced: true
  }));

  const prePlacedPositions = prePlacedTiles.map(tile => tile.position);
  const featureSquares = placeFeatureTiles(3, boardSize, prePlacedPositions);

  return {
      letterPool,
      prePlacedTiles,
      featureSquares
  };
}

module.exports = { generateScrabbleSetup };
