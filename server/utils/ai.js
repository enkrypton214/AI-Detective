const fetch = require("node-fetch");
const { OpenAI } = require("openai");

const groq = new OpenAI({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: "https://api.groq.com/openai/v1",
}); //api

async function askAI(question) {
	try {
		const completion = await groq.chat.completions.create({
			model: "llama3-70b-8192",
			messages: [
				{
					role: "system",
					content: `
You are a detective assistant. 
Only give the final conclusion in 2-3 sentences.
Do not explain reasoning steps, do not repeat clues.
Write like a human detective giving the verdict.
          `,
				},
				{ role: "user", content: question },
			],
		}); //check and use groq chat style prompt

		return completion.choices[0].message.content.trim();
	} catch (err) {
		console.log("Groq failed, switching to Ollama...", err.message);

		// Fallback to local Ollama
		try {
			const response = await fetch("http://localhost:11434/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "llama3",
					prompt: `
You are a detective assistant.
Only give the final conclusion in 2-3 sentences.
Do not explain reasoning steps, do not repeat clues.
Question: ${question}
Answer:`,
					stream: false,
				}),
			});
			//No groq use fallback mistral from Ollama

			const data = await response.json();
			return data.response.trim();
		} catch (ollamaErr) {
			console.error("Ollama also failed:", ollamaErr.message);
			return "Sorry, the AI is currently unavailable.";
		}
	}
}

module.exports = askAI;
