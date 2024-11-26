export const INIT_GAME = "init_game";
export const INIT_GAME_COINS = "init_game_coins";
export const CANCEL_INIT_GAME = "cancel_init_game";
export const MOVE = "move";
export const GRID_FILLED = "grid_filled";
export const PENDING_GAME = "pending_game";
export const RECONNECT = "reconnect";
export const GAME_TIME = "game_time";
export const GAME_INVITE = "game_invite";
export const SEND_GAME_INVITE = "send_game_invite";
export const ACCEPT_GAME_INVITE = "accept_game_invite";
export const GAME_ENDED = "game_ended";
export const EXIT_GAME = "exit_game";

export type Type =
	| typeof INIT_GAME
	| typeof INIT_GAME_COINS
	| typeof CANCEL_INIT_GAME
	| typeof MOVE
	| typeof GRID_FILLED
	| typeof PENDING_GAME
	| typeof RECONNECT
	| typeof GAME_TIME
	| typeof GAME_INVITE
	| typeof SEND_GAME_INVITE
	| typeof ACCEPT_GAME_INVITE
	| typeof GAME_ENDED
	| typeof EXIT_GAME;
export const GAME_TIME_MS = 2 * 60 * 1000;
export type GAME_STATUS = "BINGO" | "TIME_UP" | "PLAYER_EXIT";
export type GAME_RESULT = "PLAYER1_WINS" | "PLAYER2_WINS";

export type BingoCell = {
	number: number;
	marked: boolean;
};
