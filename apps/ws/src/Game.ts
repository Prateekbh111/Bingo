import { WebSocket } from "ws";
import {
	BingoCell,
	GAME_ENDED,
	GAME_RESULT,
	GAME_STATUS,
	GAME_TIME_MS,
	INIT_GAME,
	MOVE,
	RECONNECT,
} from "./types";
import { prisma } from "./db/prisma";

interface User {
	id: string;
	name: string;
	image: string;
	username: string;
	socket: WebSocket;
}

export class Game {
	public coins: number;
	public player1: User;
	public player2: User;
	public board1: BingoCell[][];
	public board2: BingoCell[][];
	public isPlayer1GridFilled: boolean;
	public isPlayer2GridFilled: boolean;
	public turn: string;
	public isGameOver: boolean;
	public gameId: string = "";
	private moveTimer: NodeJS.Timeout | null = null;
	private player1TimeConsumed = 0;
	private player2TimeConsumed = 0;
	private lastMoveTime = new Date(Date.now());
	private startTime = new Date(Date.now());

	constructor(player1: User, player2: User, coins: number) {
		this.coins = coins;
		this.player1 = player1;
		this.player2 = player2;
		this.board1 = [];
		this.board2 = [];
		this.isPlayer1GridFilled = false;
		this.isPlayer2GridFilled = false;
		this.turn = "player1";
		this.isGameOver = false;
		this.player1.socket.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: {
					playerNumber: "player1",
					otherPlayer: {
						id: player2.id,
						name: player2.name,
						image: player2.image,
					},
				},
			}),
		);
		this.player2.socket.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: {
					playerNumber: "player2",
					otherPlayer: {
						id: player1.id,
						name: player1.name,
						image: player1.image,
					},
				},
			}),
		);
		if (coins > 0) {
			this.handleCoinGame();
		}
		this.addGameToDb();
	}

	async handleCoinGame() {
		await prisma.$transaction(async (tx) => {
			const user1 = await tx.user.update({
				where: { id: this.player1.id },
				data: {
					coins: {
						decrement: this.coins,
					},
				},
			});
			if (user1.coins! < 0)
				throw new Error(
					`${user1.name} doesn't have enough to send ${this.coins}`,
				);
			const user2 = await tx.user.update({
				where: { id: this.player2.id },
				data: {
					coins: {
						decrement: this.coins,
					},
				},
			});
			if (user2.coins! < 0)
				throw new Error(
					`${user2.name} doesn't have enough to send ${this.coins}`,
				);
		});
	}

	makeMove(user: User, move: number) {
		this.markNumber(move);
		const linesCompletedByPlayer1 = this.calculateLinesCompleted("player1");
		const linesCompletedByPlayer2 = this.calculateLinesCompleted("player2");

		const moveTimestamp = new Date(Date.now());

		if (this.turn === "player1") {
			this.player1TimeConsumed =
				this.player1TimeConsumed +
				(moveTimestamp.getTime() - this.lastMoveTime.getTime());
		}

		if (this.turn === "player2") {
			this.player2TimeConsumed =
				this.player2TimeConsumed +
				(moveTimestamp.getTime() - this.lastMoveTime.getTime());
		}

		this.turn = this.turn === "player1" ? "player2" : "player1";

		this.resetMoveTimer();

		this.lastMoveTime = moveTimestamp;

		if (user.id === this.player1.id) {
			this.player2.socket.send(
				JSON.stringify({
					type: MOVE,
					payload: {
						number: move,
						linesCompleted: linesCompletedByPlayer1,
						player1TimeConsumed: this.player1TimeConsumed,
						player2TimeConsumed: this.player2TimeConsumed,
					},
				}),
			);
		} else if (user.id === this.player2.id) {
			this.player1.socket.send(
				JSON.stringify({
					type: MOVE,
					payload: {
						number: move,
						linesCompleted: linesCompletedByPlayer2,
						player1TimeConsumed: this.player1TimeConsumed,
						player2TimeConsumed: this.player2TimeConsumed,
					},
				}),
			);
		}

		if (user.id === this.player1.id && linesCompletedByPlayer1 === 5) {
			this.endGame("BINGO", "PLAYER1_WINS");
			return;
		}

		if (user.id === this.player2.id && linesCompletedByPlayer2 === 5) {
			this.endGame("BINGO", "PLAYER2_WINS");
			return;
		}

		if (linesCompletedByPlayer1 === 5) {
			this.endGame("BINGO", "PLAYER1_WINS");
			return;
		}

		if (linesCompletedByPlayer2 === 5) {
			this.endGame("BINGO", "PLAYER2_WINS");
			return;
		}
	}

	async endGame(status: GAME_STATUS, result: GAME_RESULT) {
		this.isGameOver = true;
		this.player1.socket.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					status,
					result,
				},
			}),
		);
		this.player2.socket.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					status,
					result,
				},
			}),
		);
		this.clearMoveTimer();
		if (this.coins > 0) {
			await prisma.user.update({
				where: {
					id: result === "PLAYER1_WINS" ? this.player1.id : this.player2.id,
				},
				data: {
					coins: { increment: this.coins * 2 },
				},
			});
		}

		await prisma.game.update({
			data: {
				status: "COMPLETED",
				result: result,
				endAt: new Date(Date.now()),
			},
			where: { id: this.gameId },
		});
	}

	async resetMoveTimer() {
		if (this.moveTimer) {
			clearTimeout(this.moveTimer);
		}
		const turn = this.turn;
		const timeLeft =
			GAME_TIME_MS -
			(turn === "player1"
				? this.player1TimeConsumed
				: this.player2TimeConsumed);

		this.moveTimer = setTimeout(() => {
			this.isGameOver = true;
			this.endGame(
				"TIME_UP",
				turn === "player1" ? "PLAYER2_WINS" : "PLAYER1_WINS",
			);
		}, timeLeft);
	}

	reconnect(user: User) {
		const isPlayer1 = user.id === this.player1.id;
		if (isPlayer1) this.player1.socket = user.socket;
		else this.player2.socket = user.socket;
		user.socket.send(
			JSON.stringify({
				type: RECONNECT,
				payload: {
					playerNumber: isPlayer1 ? "player1" : "player2",
					otherPlayer: {
						id: isPlayer1 ? this.player2.id : this.player1.id,
						name: isPlayer1 ? this.player2.name : this.player1.name,
						image: isPlayer1 ? this.player2.image : this.player1.image,
					},
					board: isPlayer1 ? this.board1 : this.board2,
					turn: this.turn,
					player1TimeConsumed: this.getPlayer1TimeConsumed(),
					player2TimeConsumed: this.getPlayer2TimeConsumed(),
					cardFilled: isPlayer1
						? this.isPlayer1GridFilled
						: this.isPlayer2GridFilled,
					opponentCardFilled: isPlayer1
						? this.isPlayer2GridFilled
						: this.isPlayer1GridFilled,
					linesCompleted: isPlayer1
						? this.calculateLinesCompleted("player1")
						: this.calculateLinesCompleted("player2"),
					opponentLinesCompleted: isPlayer1
						? this.calculateLinesCompleted("player2")
						: this.calculateLinesCompleted("player1"),
				},
			}),
		);
	}

	private calculateLinesCompleted(playerName: string) {
		const board = playerName === "player1" ? this.board1 : this.board2;
		if (board.length === 0) return 0;

		let linesCompleted = 0;
		const size = board.length;

		for (let i = 0; i < size; i++) {
			if (board[i].every((cell) => cell.marked)) {
				linesCompleted++;
			}
		}

		for (let i = 0; i < size; i++) {
			if (board.every((row) => row[i].marked)) {
				linesCompleted++;
			}
		}

		if (board.every((row, index) => row[index].marked)) {
			linesCompleted++;
		}

		if (board.every((row, index) => row[size - index - 1].marked)) {
			linesCompleted++;
		}

		return Math.min(linesCompleted, 5);
	}

	private markNumber(number: number) {
		this.board1 = this.board1.map((row) =>
			row.map((cell) =>
				cell.number === number ? { ...cell, marked: true } : cell,
			),
		);
		this.board2 = this.board2.map((row) =>
			row.map((cell) =>
				cell.number === number ? { ...cell, marked: true } : cell,
			),
		);
	}

	async addGameToDb() {
		const game = await prisma.game.create({
			data: {
				startAt: this.startTime,
				player1: {
					connect: {
						id: this.player1.id,
					},
				},
				player2: {
					connect: {
						id: this.player2.id,
					},
				},
				status: "IN_PROGRESS",
			},
		});
		this.gameId = game.id;
	}

	getPlayer1TimeConsumed() {
		if (this.turn === "player1") {
			return (
				this.player1TimeConsumed +
				(new Date(Date.now()).getTime() - this.lastMoveTime.getTime())
			);
		}
		return this.player1TimeConsumed;
	}

	getPlayer2TimeConsumed() {
		if (this.turn === "player2") {
			return (
				this.player2TimeConsumed +
				(new Date(Date.now()).getTime() - this.lastMoveTime.getTime())
			);
		}
		return this.player2TimeConsumed;
	}

	setLastMoveTime() {
		this.lastMoveTime = new Date(Date.now());
	}

	clearMoveTimer() {
		if (this.moveTimer) clearTimeout(this.moveTimer);
	}

	setBoard1(board: BingoCell[][]) {
		this.board1 = board;
	}

	setBoard2(board: BingoCell[][]) {
		this.board2 = board;
	}
}
