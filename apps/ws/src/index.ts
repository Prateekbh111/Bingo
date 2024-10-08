import { WebSocketServer } from "ws";
import { BingoManager } from "./BingoManager";
import { decode } from "next-auth/jwt";
import https from "https";
import fs from "fs";
import path from "path";

const sslOptions = {
	cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
	key: fs.readFileSync(path.resolve(__dirname, "../certs/privkey.pem")),
};

const server = https.createServer(sslOptions);
server.listen(8080, () => {
	console.log("websocket server is listening on 8080");
});

const wss = new WebSocketServer({ server: server });
const bingoManager = new BingoManager();
const secret = "secret";

async function getTokenVal(req: any) {
	const sessionToken = req.url.match(/\/token=(.*)/)[1];
	// const reqToken = req.headers.cookie!.split("=")[1];
	// console.log(sessionToken);
	const decoded = await decode({
		token: sessionToken,
		secret: secret,
	});
	return decoded;
}

wss.on("connection", async function connection(ws, req) {
	const userSession = await getTokenVal(req);
	const user = {
		id: userSession?.sub!,
		name: userSession?.name!,
		image: userSession?.picture!,
		email: userSession?.email!,
		socket: ws,
	};
	bingoManager.addUser(user);
	ws.on("disconnect", () => bingoManager.removeUser(ws));
});

console.log("done");
