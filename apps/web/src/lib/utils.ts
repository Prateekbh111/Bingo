import { BingoCell } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const GAME_TIME_MS = 2 * 60 * 1000;
export const CARDFILL_TIME_MS = 0.5 * 60 * 1000;

export const INIT_GAME = "init_game";
export const INIT_GAME_COINS = "init_game_coins";
export const CANCEL_INIT_GAME = "cancel_init_game";
export const MOVE = "move";
export const GRID_FILLED = "grid_filled";
export const RECONNECT = "reconnect";
export const PENDING_GAME = "pending_game";
export const GAME_TIME = "game_time";
export const GAME_INVITE = "game_invite";
export const SEND_GAME_INVITE = "send_game_invite";
export const ACCEPT_GAME_INVITE = "accept_game_invite";
export const GAME_ENDED = "game_ended";
export const FILLRANDOM = "fill_random";
export const PLAYAGAIN = "play_again";
export const EXIT = "exit";

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
