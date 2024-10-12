import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE, RECONNECT } from "./messages";

const GAME_TIME_MS = 2 * 60 * 60 * 1000;

type BingoCell = {
	number: number;
	marked: boolean;
};

interface User {
	id: string;
	name: string;
	image: string;
	socket: WebSocket;
}

export class Game {
	public player1: User;
	public player2: User;
	public board1: BingoCell[][];
	public board2: BingoCell[][];
	public isPlayer1GridFilled: boolean;
	public isPlayer2GridFilled: boolean;
	public turn: string;
	public isGameOver: boolean;
	private timer: NodeJS.Timeout | null = null;
	private player1TimeConsumed = 0;
	private player2TimeConsumed = 0;
	private startTime = new Date(Date.now());
	private lastMoveTime = new Date(Date.now());

	constructor(player1: User, player2: User) {
		this.player1 = player1;
		this.player2 = player2;
		this.board1 = [];
		this.board2 = [];
		this.isPlayer1GridFilled = false;
		this.isPlayer2GridFilled = false;
		this.turn = "player1";
		this.isGameOver = false;
		if (this.startTime) {
			this.startTime = this.startTime;
			this.lastMoveTime = this.startTime;
		}
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
	}

	setBoard1(board: BingoCell[][]) {
		this.board1 = board;
	}
	setBoard2(board: BingoCell[][]) {
		this.board2 = board;
	}

	gameOver(user: User) {
		this.isGameOver = true;
		this.player2.socket.send(
			JSON.stringify({
				type: GAME_OVER,
				payload: {
					winnerName: user.name,
				},
			}),
		);
		this.player1.socket.send(
			JSON.stringify({
				type: GAME_OVER,
				payload: {
					winnerName: user.name,
				},
			}),
		);
	}

	makeMove(user: User, move: number) {
		const moveTimestamp = new Date(Date.now());
		this.markNumber(move);
		const linesCompletedByPlayer1 = this.calculateLinesCompleted("player1");
		const linesCompletedByPlayer2 = this.calculateLinesCompleted("player2");

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

		this.lastMoveTime = moveTimestamp;

		if (
			(linesCompletedByPlayer1 === 5 && user.id === this.player1.id) ||
			this.player1TimeConsumed >= GAME_TIME_MS
		) {
			this.gameOver(this.player1);
			return;
		} else if (
			(linesCompletedByPlayer2 === 5 && user.id === this.player2.id) ||
			this.player2TimeConsumed >= GAME_TIME_MS
		) {
			this.gameOver(this.player2);
			return;
		} else if (user.id === this.player1.id) {
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
		this.turn = this.turn === "player1" ? "player2" : "player1";
		console.log(this.turn);
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
}
