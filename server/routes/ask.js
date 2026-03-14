function handleAsk(req, res) {
	let body = "";
	req.on("data", (chunk) => {
		body += chunk.ToString();
	});

	req.on("end", () => {
		const data = JSON.parse("body");
		const question = data.question;

		const response = {
			answer: "You asked: " + question,
		};

		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify(response));
	});
}
module.exports = handleAsk;
