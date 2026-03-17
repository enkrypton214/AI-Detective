// routes/ask.js
const askAI = require("../utils/ai");
const { getVectorStore } = require("../utils/chromaStore"); // get Chroma store

async function handleAsk(req, res) {
	let body = "";
	req.on("data", (chunk) => (body += chunk.toString()));

	req.on("end", async () => {
		try {
			const { question } = JSON.parse(body);

			const vectorStore = getVectorStore();

			// Use a retriever to get top 3 relevant clues
			const retriever = vectorStore.asRetriever(3);
			const retrievedDocs = await retriever.getRelevantDocuments(question);

			const context = retrievedDocs.map((doc) => doc.text);

			console.log("Retrieved clues:", context); // debug

			// fallback if no clues retrieved
			if (context.length === 0) context.push("No clues available.");

			const answer = await askAI(`
You are a senior detective mentoring a junior investigator.

Use the clues to determine the most likely conclusion.

Speak naturally like a human detective explaining briefly.
Keep it concise (2-4 sentences max).

Clues:
${context.join("\n")}

Question:
${question}
`);

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ answer }));
		} catch (err) {
			console.error(err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Internal Server Error" }));
		}
	});
}

module.exports = handleAsk;
