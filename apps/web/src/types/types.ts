export type BingoCell = {
	number: number | null;
	marked: boolean;
};

export type Player = {
	id: string;
	name: string;
	username?: string;
	image: string;
};

export type PlayerData = {
	isCardFilled: boolean;
	timeConsumed: number;
	gridFillTimeConsumed: number;
	linesCompleted: number;
	playerNumber: string;
	data: Player | null;
};

export type GameResult = {
	result: string;
	by: string;
};

enum GameStatus {
	IN_PROGRESS,
	COMPLETED,
	ABANDONED,
	TIME_UP,
	PLAYER_EXIT,
}

export type GameState = {
	card: BingoCell[][];
	isGameStarted: boolean;
	isGameEnded: boolean;
	turn: string;
	userData: PlayerData;
	opponentData: PlayerData;
	gameResult: {
		result: string;
		by: string;
	};
	isSearchingGame: boolean;
	isSearchingCoinGame: boolean;
	normalGameDisable: boolean;
	coinsGameDisable: boolean;
	nextNumber: number;
	lastNumber: number | null;
	pendingGame: {
		isCoinsGame: boolean;
		playerNumber: string;
	} | null;
};

enum ButtonType {
	FILLRANDOM,
	PLAYAGAIN,
	EXIT,
}

export type Payload = {
	number?: number;
	playerNumber?: string;
	otherPlayer?: Player;
	board?: BingoCell[][];
	cardFilled?: boolean;
	opponentCardFilled?: boolean;
	turn?: string;
	linesCompleted?: number;
	opponentLinesCompleted?: number;
	player1TimeConsumed?: number;
	player2TimeConsumed?: number;
	isCoinsGame?: boolean;
};

export type GameAction =
	| { type: "INIT_GAME"; payload: Payload }
	| { type: "RECONNECT_GAME"; payload: Payload }
	| { type: "START_SEARCH_NORMAL" }
	| { type: "START_SEARCH_COINS" }
	| { type: "CANCEL_SEARCH" }
	| { type: "MAKE_MOVE"; payload: Payload }
	| { type: "END_GAME"; payload: { result: string; status: string } }
	| { type: "RESET_GAME" }
	| { type: "UPDATE_CARD"; payload: BingoCell[][] }
	| {
			type: "SET_PLAYER_DATA";
			payload: {
				userData?: Partial<PlayerData>;
				opponentData?: Partial<PlayerData>;
			};
	  }
	| { type: "GAME_RESULT_RESET" }
	| { type: "SET_NEXT_NUMBER"; payload: number }
	| {
			type: "SET_PENDING_GAME";
			payload: {
				isCoinsGame: boolean;
				playerNumber: string;
			} | null;
	  };
