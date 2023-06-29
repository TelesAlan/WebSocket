const WebSocket = require("ws");
const getAllUrlParams = require("./../app/scripts/general");

function corsValidation(origin) {
	return process.env.CORS_ORIGIN === "*" || process.env.CORS_ORIGIN.startsWith(origin)
}
function verifyClient(info, callback) {
	if (!corsValidation(info.origin)) return callback(false);

	const params = getAllUrlParams(info.req.url);

	if (!params.hasOwnProperty("token") || params.token !== process.env.TOKEN) return callback(false);

	return callback(true);
}
function onConnection(ws, req) {
	ws.on("message", data => onMessage(ws, data));
	ws.on("error", error => onError(ws, error));
}
function onError(ws, error) {
	console.error(`>> New error: ${error.message}`);
}
function onMessage(ws, data) {
	console.log(`>> New message: ${data.toString()}`);

	ws.send(`receive!`);
}
// Use to send message for clients with connetions opened
function broadcast(jsonObject) {
	if (!this.clients) return;

	this.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(jsonObject));
		}
	});
}


module.exports = server => {
	const wss = new WebSocket.Server({ server, verifyClient });

	server.on("update", (req, socket, head) => {
		wss.handleUpgrade(req, socket, head, webSocket => {
			wss.emit("connection", webSocket, req);
		});
	});

	wss.on("connection", onConnection);
	wss.broadcast = broadcast;

	console.log(`>> App Web Socket Server is running`);
	return wss;
}