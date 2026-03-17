// utils/retriever.js
const { getVectorStore } = require("./chromaStore");
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function retrieveAndAnswer(query) {
	const vectorStore = getVectorStore();
	const retriever = vectorStore.asRetriever(3); // top 3 results

	// Retrieve relevant docs
	const results = await retriever.getRelevantDocuments(query);

	// Combine text for context
	const context = results.map((r) => r.text).join("\n\n");

	// Call LLM with context
	const response = await client.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: "You are an AI detective assistant." },
			{ role: "user", content: `${query}\n\nContext:\n${context}` },
		],
	});

	return response.choices[0].message.content;
}

module.exports = { retrieveAndAnswer };
