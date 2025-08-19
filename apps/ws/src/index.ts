import { WebSocketServer } from "ws";
import { BingoManager } from "./BingoManager";
import { decode } from "next-auth/jwt";
import https from "https";
import http from "http";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Check if SSL certificates are provided via environment variables
const sslCert = process.env.SSL_CERT;
const sslKey = process.env.SSL_KEY;
const useSSL = sslCert && sslKey;

let server;
if (useSSL) {
	const sslOptions = {
		cert: sslCert,
		key: sslKey,
	};
	server = https.createServer(sslOptions);
	console.log(`Secure WebSocket server starting on port ${port} 🔒`);
} else {
	server = http.createServer();
	console.log(`WebSocket server starting on port ${port} (HTTP) 🟢`);
}

server.listen(port, () => {
	console.log(`WebSocket server is listening on port ${port}`);
});

const wss = new WebSocketServer({ server: server });
const bingoManager = new BingoManager();
const secret = "secret";

async function getTokenVal(req: any) {
	try {
		const sessionToken = req.url.match(/\/token=(.*)/)[1];
		const decoded = await decode({
			token: sessionToken,
			secret: secret,
		});
		return decoded;
	} catch {
		console.error("Token decoding error");
		return { error: "Invalid token" };
	}
}

wss.on("connection", async function connection(ws, req) {
	const userSession = await getTokenVal(req);
	if (!userSession || userSession.error) return;
	const user = {
		id: userSession?.sub!,
		name: userSession?.name!,
		image: userSession?.picture!,
		username: userSession?.username! as string,
		socket: ws,
	};
	bingoManager.addUser(user);
	ws.on("disconnect", () => {
		console.log("disconnected");
		bingoManager.removeUser(ws);
	});
});

console.log("done");
