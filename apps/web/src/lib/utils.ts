import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const GAME_TIME_MS = 0.25 * 60 * 1000;
export const CARDFILL_TIME_MS = 0.5 * 60 * 1000;

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GRID_FILLED = "grid_filled";
export const BEGIN_GAME = "begin_game";
export const GAME_OVER = "game_over";
export const RECONNECT = "reconnect";
export const GAME_TIME = "game_time";
export const GAME_INVITE = "game_invite";
export const SEND_GAME_INVITE = "send_game_invite";
export const ACCEPT_GAME_INVITE = "accept_game_invite";
export const OFFLINE = "offline";
export const ONLINE = "online";
export const GAME_ENDED = "game_ended";
export const EXIT_GAME = "exit_game";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toPusherKey(key: string) {
	return key.replace(/:/g, "__");
}

export function checkBingoWin(bingoCard: BingoCell[][]): number {
	let linesCompleted = 0;
	const size = bingoCard.length;

	for (let i = 0; i < size; i++) {
		if (bingoCard[i].every((cell) => cell.marked)) {
			linesCompleted++;
		}
	}

	for (let i = 0; i < size; i++) {
		if (bingoCard.every((row) => row[i].marked)) {
			linesCompleted++;
		}
	}

	if (bingoCard.every((row, index) => row[index].marked)) {
		linesCompleted++;
	}

	if (bingoCard.every((row, index) => row[size - index - 1].marked)) {
		linesCompleted++;
	}

	return Math.min(linesCompleted, 5);
}
