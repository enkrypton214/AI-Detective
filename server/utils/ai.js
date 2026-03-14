const OpenAI = require("openai");

const groq = new OpenAI({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: "https://api.groq.com/openai/v1",
});

async function askAI(question) {
	try {
		// GROQ
		const completion = await groq.chat.completions.create({
			model: "llama-3.3-70b-versatile",
			messages: [
				{
					role: "system",
					content:
						"You are a logical detective assistant. Explain reasoning step by step before giving the conclusion.",
				},
				{ role: "user", content: question },
			],
		});

		return completion.choices[0].message.content;
	} catch (err) {
		console.log("Groq failed, switching to Ollama...", err.message);

		// Fallback
		try {
			const response = await fetch("http://localhost:11434/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "mistral",
					prompt: `You are a logical detective assistant. 
            Explain reasoning step by step before giving the conclusion.
            Question: ${question}
            Answer:`,
					stream: false,
				}),
			});

			const data = await response.json();
			return data.response;
		} catch (ollamaErr) {
			console.error("Ollama also failed:", ollamaErr.message);
			return "Sorry, the AI is currently unavailable.";
		}
	}
}

module.exports = askAI;
