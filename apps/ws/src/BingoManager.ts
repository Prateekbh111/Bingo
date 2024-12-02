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
		otherPlayer?: User;
		board?: BingoCell[][];
		number?: number;
		result?: GAME_RESULT;
		by?: GAME_STATUS;
	};
}

export class BingoManager {
	private games: Game[] = [];
	private users: User[] = [];
	private pendingUser: User | null = null;
	private pendingUserCoins: User | null = null;

	addUser(user: User): void {
		this.users = this.users.filter(
			(u) => u.socket.readyState === WebSocket.OPEN,
		);
		this.users.push(user);
		this.attachMessageHandler(user);
	}

	removeUser(socket: WebSocket): void {
		this.users = this.users.filter((user) => user.socket !== socket);
		this.cleanupUserGames(socket);
	}

	private cleanupUserGames(socket: WebSocket): void {
		const userGame = this.games.find(
			(game) =>
				game.player1.socket === socket || game.player2.socket === socket,
		);

		if (userGame) {
			this.games = this.games.filter((game) => game !== userGame);
		}
	}

	private attachMessageHandler(user: User): void {
		user.socket.on("message", (data) => {
			const message: Message = JSON.parse(data.toString());

			switch (message.type) {
				case INIT_GAME:
					this.handleInitGame(user);
					break;
				case INIT_GAME_COINS:
					this.handleInitGameCoins(user);
					break;
				case CANCEL_INIT_GAME:
					this.handleCancelInitGame(user);
					break;
				case RECONNECT:
					this.handleReconnect(user);
					break;
				case SEND_GAME_INVITE:
					this.handleSendGameInvite(user, message);
					break;
				case ACCEPT_GAME_INVITE:
					this.handleAcceptGameInvite(user, message);
					break;
				case GRID_FILLED:
					this.handleGridFilled(user, message);
					break;
				case MOVE:
					this.handleMove(user, message);
					break;
				case GAME_ENDED:
					this.handleGameEnded(user, message);
					break;
			}
		});
	}

	private handleInitGame(user: User): void {
		this.checkExistingGame(user);

		if (this.pendingUser && this.pendingUser.id !== user.id) {
			this.createGameWithPendingUser(user);
		} else {
			this.pendingUser = user;
		}
	}

	private handleInitGameCoins(user: User): void {
		this.checkExistingGame(user);

		if (this.pendingUserCoins && this.pendingUserCoins.id !== user.id) {
			this.createGameWithPendingCoinsUser(user);
		} else {
			this.pendingUserCoins = user;
		}
	}

	private createGameWithPendingUser(user: User): void {
		const pendingUser = this.pendingUser!;
		const game = new Game(pendingUser, user, 0);
		this.games.push(game);
		this.pendingUser = null;
	}

	private createGameWithPendingCoinsUser(user: User): void {
		const pendingUser = this.pendingUserCoins!;
		const game = new Game(pendingUser, user, 2);
		this.games.push(game);
		this.pendingUserCoins = null;
	}

	private handleCancelInitGame(user: User): void {
		if (this.pendingUser?.id === user.id) this.pendingUser = null;
		if (this.pendingUserCoins?.id === user.id) this.pendingUserCoins = null;
	}

	private handleReconnect(user: User): void {
		const existingGame = this.findUserGame(user);

		if (existingGame && !existingGame.isGameOver) {
			existingGame.reconnect(user);
		} else {
			user.socket.send(
				JSON.stringify({
					type: RECONNECT,
					payload: {
						playerNumber: null,
					},
				}),
			);
		}
	}

	private handleSendGameInvite(user: User, message: Message): void {
		this.checkExistingGame(user);
		const friendId = message.payload.friendId;
		const recipient = this.users.find((u) => u.id === friendId);

		if (recipient) {
			recipient.socket.send(
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
		}
	}

	private handleAcceptGameInvite(user: User, message: Message): void {
		this.checkExistingGame(user);
		const otherPlayer = message.payload.otherPlayer;
		const opponent = this.users.find((u) => u.id === otherPlayer?.id);

		if (opponent) {
			const game = new Game(user, opponent, 0);
			this.games.push(game);
		}
	}

	private handleGridFilled(user: User, message: Message): void {
		const game = this.findUserGame(user);
		const board = message.payload.board!;

		if (game) {
			if (user.id === game.player1.id) {
				game.setBoard1(board);
				game.isPlayer1GridFilled = true;
				game.player2.socket.send(JSON.stringify({ type: GRID_FILLED }));
			} else if (user.id === game.player2.id) {
				game.setBoard2(board);
				game.isPlayer2GridFilled = true;
				game.player1.socket.send(JSON.stringify({ type: GRID_FILLED }));
			}

			if (game.isPlayer1GridFilled && game.isPlayer2GridFilled) {
				game.setLastMoveTime();
			}
		}
	}

	private handleMove(user: User, message: Message): void {
		const number = message.payload.number!;
		if (number <= 0 || number > 25) return;

		const game = this.findUserGame(user);
		if (!game || game.isGameOver) {
			if (game) this.games = this.games.filter((g) => !g.isGameOver);
			return;
		}

		game.makeMove(user, number);
		if (game.isGameOver) {
			this.games = this.games.filter((g) => !g.isGameOver);
		}
	}

	private handleGameEnded(user: User, message: Message): void {
		const game = this.findUserGame(user);
		if (!game) return;

		const { result, by } = message.payload;
		game.endGame(by!, result!);

		if (game.isGameOver) {
			this.games = this.games.filter((g) => !g.isGameOver);
		}
	}

	private checkExistingGame(user: User): void {
		const existingGame = this.findUserGame(user);

		if (existingGame) {
			if (existingGame.isGameOver) {
				this.games = this.games.filter((g) => !g.isGameOver);
			} else {
				user.socket.send(
					JSON.stringify({
						type: PENDING_GAME,
						payload: {
							isCoinsGame: existingGame.coins > 0,
							playerNumber:
								user.id === existingGame.player1.id ? "player1" : "player2",
						},
					}),
				);
			}
		}
	}

	private findUserGame(user: User): Game | undefined {
		return this.games.find(
			(game) => game.player1.id === user.id || game.player2.id === user.id,
		);
	}
}
