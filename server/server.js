const http = require("http"); //http module
const { json } = require("stream/consumers");
const handleAsk = require("./routes/ask");

const port = 3000; //assigning port number
const server = http.createServer((req, res) => {
	//Home
	if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, { "content-type": "text/plain" });
		res.end("AI Detective Server Running");
		return;
	}

	// API EndPoint
	if (req.url === "/ask" && req.method === "POST") {
		handleAsk(req, res);
		return;
	}

	//Error Catch
	res.writeHead(404, { "content-type": "text/plain" });
	res.end("Route not found");
}); // create server and check if it exists or not
//model = client(browser)=> Req => server => Res => client(Browser)
//process node starts server.js => server.listen starts listening => browser req => create server Runs => check URL => send Response

server.listen(port, () => {
	console.log(`Server Running on port ${port}`);
}); //
