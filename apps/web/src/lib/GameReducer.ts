import { BingoCell, GameAction, GameState } from "@/types/types";
import { Reducer } from "react";

export const initialGameState: GameState = {
	card: generateEmptyCard(),
	isGameStarted: false,
	isGameEnded: false,
	turn: "player1",
	userData: {
		isCardFilled: false,
		timeConsumed: 0,
		gridFillTimeConsumed: 0,
		linesCompleted: 0,
		playerNumber: "",
		data: null,
	},
	opponentData: {
		isCardFilled: false,
		timeConsumed: 0,
		gridFillTimeConsumed: 0,
		linesCompleted: 0,
		playerNumber: "",
		data: null,
	},
	gameResult: {
		result: "",
		by: "",
	},
	isSearchingGame: false,
	isSearchingCoinGame: false,
	normalGameDisable: false,
	coinsGameDisable: false,
	nextNumber: 1,
	lastNumber: null,
	pendingGame: null,
};

export const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
	console.log(action.type);
	switch (action.type) {
		case "INIT_GAME":
			return {
				...state,
				pendingGame: null,
				isGameStarted: true,
				isSearchingGame: false,
				isSearchingCoinGame: false,
				userData: {
					...state.userData,
					isCardFilled: false,
					playerNumber: action.payload.playerNumber || "",
				},
				opponentData: {
					...state.opponentData,
					isCardFilled: false,
					playerNumber:
						action.payload.playerNumber === "player1" ? "player2" : "player1",
					data: action.payload.otherPlayer || null,
				},
			};

		case "RECONNECT_GAME":
			return {
				...state,
				pendingGame: null,
				isGameStarted: true,
				isSearchingGame: false,
				isSearchingCoinGame: false,
				turn: action.payload.turn!,
				userData: {
					...state.userData,
					playerNumber: action.payload.playerNumber || "",
					isCardFilled: action.payload.cardFilled!,
					timeConsumed:
						action.payload.playerNumber === "player1"
							? action.payload.player1TimeConsumed!
							: action.payload.player2TimeConsumed!,
					linesCompleted: action.payload.linesCompleted!,
				},
				opponentData: {
					...state.opponentData,
					playerNumber:
						action.payload.playerNumber === "player1" ? "player2" : "player1",
					data: action.payload.otherPlayer!,
					isCardFilled: action.payload.opponentCardFilled!,
					timeConsumed:
						action.payload.playerNumber! === "player1"
							? action.payload.player2TimeConsumed!
							: action.payload.player1TimeConsumed!,
					linesCompleted: action.payload.opponentLinesCompleted!,
				},
				card:
					action.payload.board!.length === 0
						? generateEmptyCard()
						: action.payload.board!,
				nextNumber: action.payload.board!.length === 0 ? 1 : 26,
			};

		case "START_SEARCH_NORMAL":
			return {
				...state,
				isSearchingGame: true,
				normalGameDisable: true,
			};

		case "START_SEARCH_COINS":
			return {
				...state,
				isSearchingCoinGame: true,
				coinsGameDisable: true,
			};

		case "CANCEL_SEARCH":
			return {
				...state,
				isSearchingGame: false,
				isSearchingCoinGame: false,
				normalGameDisable: false,
				coinsGameDisable: false,
			};

		case "MAKE_MOVE":
			return {
				...state,
				card: markNumberOnCard(state.card, action.payload.number!),
				turn: state.turn === "player1" ? "player2" : "player1",
				lastNumber: action.payload.number!,
			};

		case "END_GAME":
			return {
				...state,
				isGameEnded: true,
				gameResult: {
					result: action.payload.result,
					by: action.payload.status,
				},
			};

		case "RESET_GAME":
			return {
				...initialGameState,
				card: generateEmptyCard(),
			};

		case "UPDATE_CARD":
			return {
				...state,
				card:
					action.payload.length === 0 ? generateEmptyCard() : action.payload,
				nextNumber: state.nextNumber + 1,
			};

		case "SET_PLAYER_DATA":
			return {
				...state,
				userData: action.payload.userData
					? { ...state.userData, ...action.payload.userData }
					: state.userData,
				opponentData: action.payload.opponentData
					? { ...state.opponentData, ...action.payload.opponentData }
					: state.opponentData,
			};

		case "GAME_RESULT_RESET":
			return {
				...state,
				gameResult: { result: "", by: "" },
			};

		case "SET_NEXT_NUMBER":
			return {
				...state,
				nextNumber: action.payload!,
			};

		case "SET_PENDING_GAME":
			return {
				...state,
				pendingGame: action.payload,
			};

		default:
			return state;
	}
};

function generateEmptyCard(): BingoCell[][] {
	return Array(5)
		.fill(null)
		.map(() =>
			Array(5)
				.fill(null)
				.map(() => ({ number: null, marked: false })),
		);
}

function markNumberOnCard(card: BingoCell[][], number: number): BingoCell[][] {
	return card.map((row) =>
		row.map((cell) =>
			cell.number === number ? { ...cell, marked: true } : cell,
		),
	);
}
