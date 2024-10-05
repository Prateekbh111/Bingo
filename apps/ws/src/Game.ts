import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

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
	public board1Filled: boolean;
	public board2Filled: boolean;
	public turn: string;
	private startTime: Date;

	constructor(player1: User, player2: User) {
		this.player1 = player1;
		this.player2 = player2;
		this.board1 = [];
		this.board2 = [];
		this.board1Filled = false;
		this.board2Filled = false;
		this.turn = "player1";
		this.startTime = new Date();
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
			})
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
			})
		);
	}

	setBoard1(board: BingoCell[][]) {
		this.board1 = board;
	}
	setBoard2(board: BingoCell[][]) {
		this.board2 = board;
	}

	gameOver(user: User) {
		if (user.socket == this.player1.socket) {
			this.player2.socket.send(
				JSON.stringify({
					type: GAME_OVER,
					payload: {
						winnerName: user.name,
					},
				})
			);
		} else {
			this.player1.socket.send(
				JSON.stringify({
					type: GAME_OVER,
					payload: {
						winnerName: user.name,
					},
				})
			);
		}
	}

	makeMove(user: User, move: number) {
		if (user.socket == this.player1.socket) {
			this.markNumber("player1", move);
			const linesCompleted = this.calculateLinesCompleted("player1");
			this.player2.socket.send(
				JSON.stringify({
					type: MOVE,
					payload: {
						number: move,
						linesCompleted,
					},
				})
			);
		} else if (user.socket === this.player2.socket) {
			this.markNumber("player2", move);
			const linesCompleted = this.calculateLinesCompleted("player2");
			this.player1.socket.send(
				JSON.stringify({
					type: MOVE,
					payload: {
						number: move,
						linesCompleted,
					},
				})
			);
		}
	}

	private markNumber(playerName: string, number: number) {
		this.board1 = this.board1.map((row) =>
			row.map((cell) =>
				cell.number === number ? { ...cell, marked: true } : cell
			)
		);
		this.board2 = this.board2.map((row) =>
			row.map((cell) =>
				cell.number === number ? { ...cell, marked: true } : cell
			)
		);
		console.log(playerName === "player1" ? this.board1 : this.board2);
	}

	private calculateLinesCompleted(playerName: string) {
		const board = playerName === "player1" ? this.board1 : this.board2;

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
