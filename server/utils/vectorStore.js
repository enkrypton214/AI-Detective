const fs = require("fs"); //file sys
const path = require("path");
const { embed } = require("./embed");
const chunkText = require("./chunker");

let vectors = [];

async function loadData() {
	const clues = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../../data/clues.json")),
	); //Read clues
	for (let clue of clues) {
		const chunks = chunkText(clue.text);
		for (let chunk of chunks) {
			const vector = await embed(chunk);

			vectors.push({
				text: chunk,
				source: clue.text,
				vector,
			});
		}
	}
	//each clue creates multiple vectors now
	console.log(
		"Clues loaded:",
		vectors.map((v) => v.text), //debug for checking if clues are loaded
	);
}

//Similarity function = A . B / (|A| * |B|)
function cosineSimilarity(a, b) {
	let dot = 0,
		magA = 0,
		magB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		magA += a[i] * a[i];
		magB += b[i] * b[i];
	}
	return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// compare with stored vectors, compare and sort, return top
async function search(queryVector, k = 3) {
	const scored = vectors.map((v) => ({
		text: v.text,
		score: cosineSimilarity(queryVector, v.vector),
	}));

	// Filter weak matches
	const filtered = scored.filter((s) => s.score > 0.3);

	filtered.sort((a, b) => b.score - a.score);

	return filtered.slice(0, k);
}

module.exports = { loadData, search };

//vectordb chroma vetcor= embedded db store

//retriever

//tool call to call retrievver
