// utils/ingest.js
const fs = require("fs");
const { getVectorStore } = require("./chromaStore");

async function loadData() {
	const vectorStore = getVectorStore();
	const docs = JSON.parse(fs.readFileSync("./data/clues.json", "utf8")); // your detective clues

	for (let doc of docs) {
		await vectorStore.addDocuments([
			{
				id: doc.id,
				text: doc.text,
				metadata: doc.metadata,
			},
		]);
	}

	await vectorStore.persist(); // save vectors to disk
}

module.exports = loadData;
