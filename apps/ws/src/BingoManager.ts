import { WebSocket } from "ws";
import {
	ACCEPT_GAME_INVITE,
	SEND_GAME_INVITE,
	GRID_FILLED,
	INIT_GAME,
	MOVE,
	GAME_INVITE,
	GAME_OVER,
	OFFLINE,
	ONLINE,
	GAME_ENDED,
} from "./messages";
import { Game } from "./Game";

interface User {
	id: string;
	name: string;
	username: string;
	image: string;
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
				const existingGame = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);

				if (existingGame && existingGame.isGameOver) {
					console.log("delete krdi bc");
					this.games = this.games.filter((g) => !g.isGameOver);
				}

				if (existingGame && !existingGame.isGameOver) {
					existingGame.reconnect(user);
					return;
				}
				if (this.pendingUser && this.pendingUser.id !== user.id) {
					const game = new Game(this.pendingUser, user);
					this.games.push(game);
					this.pendingUser = null;
				} else {
					this.pendingUser = user;
				}
			}

			if (message.type == SEND_GAME_INVITE) {
				const existingGame = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);

				if (existingGame) {
					existingGame.reconnect(user);
					return;
				}
				const friendId = message.payload.friendId;
				let sent = false;
				this.users.map((activeUser) => {
					if (activeUser.id == friendId) {
						activeUser.socket.send(
							JSON.stringify({
								type: GAME_INVITE,
								payload: {
									otherPlayer: {
										id: user.id,
										name: user.name,
										username: user.username,
										image: user.image,
									},
								},
							}),
						);
						sent = true;
					}
				});

				if (!sent) {
					//TODO: handle game invite not send here
				}
			}

			if (message.type == ACCEPT_GAME_INVITE) {
				const existingGame = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);

				if (existingGame) {
					existingGame.reconnect(user);
					return;
				}
				const otherPlayer = message.payload.otherPlayer;
				let otherPlayerSocket = null;
				this.users.map((activeUser) => {
					if (activeUser.id == otherPlayer.id) {
						otherPlayerSocket = activeUser.socket;
					}
				});

				if (!otherPlayerSocket) {
					console.log("returing");
					//TODO: handle other user not availble
					return;
				}

				const opponent: User = {
					id: otherPlayer.id,
					name: otherPlayer.name,
					username: otherPlayer.username,
					image: otherPlayer.image,
					socket: otherPlayerSocket,
				};

				const game = new Game(user, opponent);
				this.games.push(game);
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
				if (game?.isPlayer1GridFilled && game.isPlayer2GridFilled) {
					game.setLastMoveTime();
				}
			}

			if (message.type == MOVE) {
				const game = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);
				if (!game) {
					console.log("Game not found!!!");
					return;
				}
				if (game && game!.isGameOver) {
					this.games = this.games.filter((g) => !g.isGameOver);
					return;
				}

				game!.makeMove(user, message.payload.number);
				if (game && game!.isGameOver) {
					this.games = this.games.filter((g) => !g.isGameOver);
				}
			}

			if (message.type == GAME_ENDED) {
				const game = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);
				if (!game) {
					console.log("Game not found!!!");
					return;
				}

				const result = message.payload.result;
				game?.gameOver(result, "TIME_UP");
				console.log(game.isGameOver);
				if (game && game!.isGameOver) {
					this.games = this.games.filter((g) => !g.isGameOver);
					return;
				}
			}
		});
	}
}
