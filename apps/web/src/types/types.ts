type BingoCell = {
	number: number | null;
	marked: boolean;
};

type Player = {
	id: string;
	name: string;
	username: string;
	image: string;
};

type PlayerData = {
	isCardFilled: boolean;
	timeConsumed: number;
	gridFillTimeConsumed: number;
	linesCompleted: number;
	playerNumber: string;
	data: Player | null;
};

type GameResult = {
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

enum ButtonType {
	FILLRANDOM,
	PLAYAGAIN,
	EXIT,
}

type Payload = {
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
};
