// utils/chromaStore.js
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { embed } = require("./embed");

let vectorStore;

class CustomEmbeddings {
	constructor() {
		this.numDimensions = 1536; // required by Chroma
	}

	async embedDocuments(texts) {
		const results = [];
		for (const t of texts) {
			results.push(await embed(t));
		}
		return results;
	}

	async embedQuery(text) {
		return embed(text);
	}
}

async function initVectorStore() {
	if (!vectorStore) {
		const embeddings = new CustomEmbeddings();

		vectorStore = new Chroma({
			collectionName: "detective-clues",
			embeddingFunction: embeddings, // <- note: embeddingFunction
			persistDirectory: "./chroma_db", // optional
		});
	}
	return vectorStore;
}

function getVectorStore() {
	if (!vectorStore) throw new Error("Vector store not initialized yet");
	return vectorStore;
}

module.exports = { initVectorStore, getVectorStore };
