import { WebSocket } from "ws";
import { GRID_FILLED, INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

interface User {
	id: string;
	name: string;
	image: string;
	email: string;
	socket: WebSocket;
}

export class BingoManager {
	private games: Game[];
	private pendingUser: User | null; // pending user waiting to be connected
	private users: User[]; //active users

	constructor() {
		this.games = [];
		this.pendingUser = null;
		this.users = [];
	}

	addUser(user: User) {
		this.users.push(user);
		this.addHandler(user);
	}

	removeUser(socket: WebSocket) {
		this.users = this.users.filter((user) => user.socket !== socket);
		//stop the game here bec ause the user has left
	}

	private addHandler(user: User) {
		user.socket.on("message", (data) => {
			const message = JSON.parse(data.toString());
			console.log(message.type);

			if (message.type == INIT_GAME) {
				const game = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);

				if (game) {
					game.reconnect(user);
				}
				if (this.pendingUser && this.pendingUser.id !== user.id) {
					const game = new Game(this.pendingUser, user);
					this.games.push(game);
					this.pendingUser = null;
				} else {
					this.pendingUser = user;
				}
			}

			if (message.type == GRID_FILLED) {
				const game = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);
				const board = message.payload.board;

				if (user.id == game?.player1.id) {
					game.setBoard1(board);
					game.isPlayer1GridFilled = true;
					game.player2.socket.send(
						JSON.stringify({
							type: GRID_FILLED,
						}),
					);
				} else if (user.id == game?.player2.id) {
					game.setBoard2(board);
					game.isPlayer2GridFilled = true;
					game.player1.socket.send(
						JSON.stringify({
							type: GRID_FILLED,
						}),
					);
				}
			}

			if (message.type == MOVE) {
				const game = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);
				if (!game) console.log("Game not found!!!");

				game!.makeMove(user, message.payload.number);
				if (game!.isGameOver) {
					this.games = this.games.filter(
						(g) =>
							g.player1.id !== game!.player1.id ||
							g.player2.id !== game!.player2.id,
					);
				}
			}
		});
	}
}
