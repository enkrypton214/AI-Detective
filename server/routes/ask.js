const askAI = require("../utils/ai");

async function handleAsk(req, res) {
	let body = "";
	req.on("data", (chunk) => {
		body += chunk.toString();
	});

	req.on("end", async () => {
		const data = JSON.parse(body);
		const question = data.question;

		const answer = await askAI(question);

		const response = {
			answer: answer,
		};

		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify(response));
	});
}
module.exports = handleAsk;
