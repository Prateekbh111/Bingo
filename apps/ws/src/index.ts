import { WebSocketServer } from "ws";
import { BingoManager } from "./BingoManager";
import { decode } from "next-auth/jwt";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

// Railway uses PORT, fallback to WS_PORT for local development
const port = process.env.PORT ? parseInt(process.env.PORT) : (process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080);

// Railway handles SSL/HTTPS termination automatically
// We only need HTTP server - Railway will handle the SSL layer
const server = http.createServer();

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
