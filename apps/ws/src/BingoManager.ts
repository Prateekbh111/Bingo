import { WebSocket } from "ws";
import { GAME_OVER, GRID_FILLED, INIT_GAME, MOVE } from "./messages";
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
					(game) => game.player1 === user || game.player2 === user,
				);
				const board = message.payload.board;

				if (user == game?.player1) {
					game.setBoard1(board);
					game.board1Filled = true;
					game.player2.socket.send(
						JSON.stringify({
							type: GRID_FILLED,
						}),
					);
				} else if (user == game?.player2) {
					game.setBoard2(board);
					game.board2Filled = true;
					game.player1.socket.send(
						JSON.stringify({
							type: GRID_FILLED,
						}),
					);
				}
			}
			if (message.type == GAME_OVER) {
				const game = this.games.find(
					(game) => game.player1 === user || game.player2 === user,
				);
				if (game) {
					game.gameOver(user);
				}
				this.games = this.games.filter(
					(game) => game.player1 === user || game.player2 === user,
				);
			}

			if (message.type == MOVE) {
				const game = this.games.find(
					(game) => game.player1 === user || game.player2 === user,
				);

				if (game) {
					game.makeMove(user, message.payload.number);
				}
			}
		});
	}
}
