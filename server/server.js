// server.js
require("dotenv").config();
const { init } = require("./utils/embed");
const { initVectorStore } = require("./utils/chromaStore");
const loadData = require("./utils/ingest");
const http = require("http");
const handleAsk = require("./routes/ask");

const port = 3000;

const server = http.createServer((req, res) => {
	// CORS headers
	if (req.method === "OPTIONS") {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		});
		res.end();
		return;
	}

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	// Home route
	if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("AI Detective Server Running");
		return;
	}

	// /ask endpoint
	if (req.url === "/ask" && req.method === "POST") {
		handleAsk(req, res);
		return;
	}

	// 404 fallback
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("Route not found");
});

async function startServer() {
	await init(); // initialize transformer/embeddings
	await initVectorStore(); // initialize Chroma vector store
	await loadData(); // ingest your clues
}

server.listen(port, () => console.log(`Server Running on port ${port}`));
startServer();
