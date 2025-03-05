const { generateScrabbleSetup } = require('./utils/scrabbleSetup'); // Adjust path if needed

async function runScrabbleSetup() {
    try {
        const setup = await generateScrabbleSetup();
        console.log("Generated Scrabble Setup:", JSON.stringify(setup, null, 2));
    } catch (error) {
        console.error("Error generating Scrabble setup:", error);
    }
}

runScrabbleSetup();
