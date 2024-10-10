import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE, RECONNECT } from "./messages";

type BingoCell = {
	number: number;
	marked: boolean;
};

interface User {
	id: string;
	name: string;
	image: string;
	email: string;
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
	private startTime: Date;

	constructor(player1: User, player2: User) {
		this.player1 = player1;
		this.player2 = player2;
		this.board1 = [];
		this.board2 = [];
		this.isPlayer1GridFilled = false;
		this.isPlayer2GridFilled = false;
		this.turn = "player1";
		this.startTime = new Date();
		this.isGameOver = false;
		this.player1.socket.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: {
					playerNumber: "player1",
					otherPlayer: {
						id: player2.id,
						name: player2.name,
						email: player2.email,
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
						email: player1.email,
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
		this.markNumber(move);
		const linesCompletedByPlayer1 = this.calculateLinesCompleted("player1");
		const linesCompletedByPlayer2 = this.calculateLinesCompleted("player2");

		if (linesCompletedByPlayer1 === 5 && user.id === this.player1.id) {
			this.gameOver(this.player1);
		} else if (linesCompletedByPlayer2 === 5 && user.id === this.player2.id) {
			this.gameOver(this.player2);
		} else if (user.id === this.player1.id) {
			this.player2.socket.send(
				JSON.stringify({
					type: MOVE,
					payload: {
						number: move,
						linesCompleted: linesCompletedByPlayer1,
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
					},
				}),
			);
		}
		this.turn = this.turn === "player1" ? "player2" : "player1";
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
						email: isPlayer1 ? this.player2.email : this.player1.email,
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
