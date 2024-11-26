import { WebSocket } from "ws";
import {
	ACCEPT_GAME_INVITE,
	SEND_GAME_INVITE,
	GRID_FILLED,
	INIT_GAME,
	MOVE,
	GAME_INVITE,
	GAME_ENDED,
	Type,
	BingoCell,
	GAME_RESULT,
	INIT_GAME_COINS,
	GAME_STATUS,
	CANCEL_INIT_GAME,
	RECONNECT,
	PENDING_GAME,
} from "./types";
import { Game } from "./Game";

interface User {
	id: string;
	name: string;
	image: string;
	username: string;
	socket: WebSocket;
}

interface Message {
	type: Type;
	payload: {
		friendId?: string;
		otherPlayer: User;
		board: BingoCell[][];
		number: number;
		result: GAME_RESULT;
		by: GAME_STATUS;
	};
}

export class BingoManager {
	private games: Game[];
	private pendingUser: User | null; // pending user waiting to be connected in normal game
	private pendingUserCoins: User | null; //pending user waiting to be connnected in coins game
	private users: User[]; //active users

	constructor() {
		this.games = [];
		this.pendingUser = null;
		this.pendingUserCoins = null;
		this.users = [];
	}

	addUser(user: User) {
		this.users.push(user);
		this.addHandler(user);
	}

	removeUser(socket: WebSocket) {
		//stop the game here because the user has left
		console.log("user is removed");
		this.users = this.users.filter((user) => user.socket !== socket);
	}

	private checkExistingGame(user: User) {
		const existingGame = this.games.find(
			(game) => game.player1.id === user.id || game.player2.id === user.id,
		);

		//if game exists but over then remove that game
		if (existingGame && existingGame.isGameOver) {
			this.games = this.games.filter((g) => !g.isGameOver);
		}

		//if game exists but not over then reconnect
		if (
			existingGame &&
			!existingGame.isGameOver &&
			existingGame.player1 &&
			existingGame.player2
		) {
			user.socket.send(
				JSON.stringify({
					type: PENDING_GAME,
					payload: {
						isCoinsGame: true,
					},
				}),
			);
			return;
		}
	}

	private addHandler(user: User) {
		user.socket.on("message", (data) => {
			const message: Message = JSON.parse(data.toString());
			console.log(message.type);

			if (message.type == INIT_GAME) {
				this.users.map((user) => {
					console.log(user.name);
				});
				this.users = this.users.filter(
					(user) => user.socket.readyState === WebSocket.OPEN,
				);

				this.checkExistingGame(user);
				//if no game exists connect to new game
				//if there is a pending user to connect then add current user to it
				//otherwise make current user to pending user
				if (this.pendingUser && this.pendingUser.id !== user.id) {
					if (
						this.pendingUser.socket.readyState !== WebSocket.CLOSED &&
						this.pendingUser.socket.readyState !== WebSocket.CLOSING
					) {
						//if user has leaved the game end the game
						//TODO: later implement resigning error

						const existingUserGame = this.games.find(
							(game) =>
								game.player1.id === user.id || game.player2.id === user.id,
						);
						const existingPendingUserGame = this.games.find(
							(game) =>
								game.player1.id === this.pendingUser?.id ||
								game.player2.id === this.pendingUser?.id,
						);

						console.log(this.games.length);
						this.games = this.games.filter(
							(g) =>
								g.gameId != existingPendingUserGame?.gameId ||
								g.gameId != existingUserGame?.gameId,
						);
						console.log("deleteing game");
						console.log(this.games.length);

						const game = new Game(this.pendingUser, user, 0);
						this.games.push(game);
						this.pendingUser = null;
					} else {
						console.log("found a user which is offline now");
						this.users = this.users.filter(
							(user) => user.id != this.pendingUser?.id,
						);
						this.pendingUser = user;
					}
				} else {
					this.pendingUser = user;
				}
			}

			if (message.type == INIT_GAME_COINS) {
				this.checkExistingGame(user);
				//if no game exists connect to new game
				//if there is a pending user to connect then add current user to it
				//otherwise make current user to pending user
				if (this.pendingUserCoins && this.pendingUserCoins.id !== user.id) {
					if (
						this.pendingUserCoins.socket.readyState !== WebSocket.CLOSED &&
						this.pendingUserCoins.socket.readyState !== WebSocket.CLOSING
					) {
						//if user has leaved the game end the game
						//TODO: later implement resigning error
						//TTODO: check if user has sufficient coins or not
						const game = new Game(this.pendingUserCoins, user, 2);
						this.games.push(game);
						this.pendingUserCoins = null;
					} else {
						console.log("found a user which is offline now");
						this.users = this.users.filter(
							(user) => user.id != this.pendingUserCoins?.id,
						);
						this.pendingUserCoins = user;
					}
				} else {
					this.pendingUserCoins = user;
				}
			}

			if (message.type === CANCEL_INIT_GAME) {
				if (this.pendingUser && this.pendingUser.id === user.id) {
					this.pendingUser = null;
				}
				if (this.pendingUserCoins && this.pendingUserCoins.id === user.id) {
					this.pendingUserCoins = null;
				}
				console.log("game length: ", this.games.length);
				console.log("pendingUser:", this.pendingUser);
			}

			if (message.type === RECONNECT) {
				const existingGame = this.games.find(
					(game) => game.player1.id === user.id || game.player2.id === user.id,
				);

				//if game exists but over then remove that game
				if (existingGame && existingGame.isGameOver) {
					this.games = this.games.filter((g) => !g.isGameOver);
				}

				//if game exists but not over then reconnect
				if (existingGame && !existingGame.isGameOver) {
					existingGame.reconnect(user);
					return;
				}
			}

			if (message.type == SEND_GAME_INVITE) {
				this.checkExistingGame(user);

				//getting friend id from payload
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
				this.checkExistingGame(user);

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

				const game = new Game(user, opponent, 0);
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
				if (game?.isPlayer1GridFilled && game?.isPlayer2GridFilled) {
					game.setLastMoveTime();
				}
			}

			if (message.type == MOVE) {
				if (message.payload.number <= 0 || message.payload.number > 25) {
					console.log("Invalid move!!");
					return;
				}
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
				const by = message.payload.by;
				game?.endGame(by, result);
				if (game && game!.isGameOver) {
					this.games = this.games.filter((g) => !g.isGameOver);
					return;
				}
			}
		});
	}
}
