const { pipeline } = require("@xenova/transformers"); //import transformer

let embedder; //load model

async function init() {
	embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2"); //use this model to embed
}

async function embed(text) {
	const result = await embedder(text, { pooling: "mean", normalize: true }); //avg token vector and cosine similarity easier

	return Array.from(result.data); //js array
}

module.exports = { init, embed };

//langchain
