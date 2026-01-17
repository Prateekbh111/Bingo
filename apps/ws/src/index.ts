import { WebSocketServer } from "ws";
import { BingoManager } from "./BingoManager";
import { decode } from "next-auth/jwt";
import fs from "fs";
import https from "https";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

// Railway uses PORT, fallback to WS_PORT for local development
const port = process.env.PORT ? parseInt(process.env.PORT) : (process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080);

// Check if SSL certificates are provided via environment variables
// Railway handles SSL automatically, so we typically won't need this in production
const sslCertPath = process.env.SSL_CERT;
const sslKeyPath = process.env.SSL_KEY;
const useSSL = !!(sslCertPath && sslKeyPath);

let server;
if (useSSL) {
	const sslOptions = {
		cert: fs.readFileSync(sslCertPath),
		key: fs.readFileSync(sslKeyPath),
	};
	server = https.createServer(sslOptions);
	console.log(`Secure WebSocket server starting on port ${port} 🔒`);
} else {
	server = http.createServer();
	console.log(`WebSocket server starting on port ${port} (HTTP) 🟢`);
}

// Start the server listening on all interfaces
server.listen(port, '0.0.0.0', () => {
	console.log(`WebSocket server is listening on port ${port}`);
});

const wss = new WebSocketServer({ server: server });
const bingoManager = new BingoManager();
// Use NEXTAUTH_SECRET from environment variables (must match frontend)
const secret = process.env.NEXTAUTH_SECRET || "secret";

async function getTokenVal(req: any) {
	try {
		const match = req.url?.match(/\/token=(.*)/);
		if (!match || !match[1]) {
			return { error: "No token provided" };
		}
		const sessionToken = match[1];
		const decoded = await decode({
			token: sessionToken,
			secret: secret,
		});
		return decoded;
	} catch (error) {
		console.error("Token decoding error:", error);
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
