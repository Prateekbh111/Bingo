// src/components/GameInterface/GamePlayInterface.tsx
import React, { useEffect } from "react";
import { Session } from "next-auth";
import { useToast } from "@/hooks/use-toast";
import {
	CARDFILL_TIME_MS,
	GAME_TIME_MS,
	GRID_FILLED,
	GAME_ENDED,
	MOVE,
	checkBingoWin,
} from "@/lib/utils";
import PlayerInfo from "./PlayerInfo";
import BingoCard from "./BingoCard";
import GameButtons from "./GameButtons";
import { BingoCell, GameAction, GameState, PlayerData } from "@/types/types";

interface GamePlayInterfaceProps {
	gameState: GameState;
	isMobile: boolean;
	dispatch: React.Dispatch<GameAction>;
	socketRef: React.MutableRefObject<WebSocket | null>;
	session: Session;
	resetGame: () => void;
}

export default function GamePlayInterface({
	gameState,
	isMobile,
	dispatch,
	socketRef,
	resetGame,
}: GamePlayInterfaceProps) {
	const { toast } = useToast();

	useEffect(() => {
		let startTimestamp = Date.now();
		let interval: NodeJS.Timeout;

		const updateTimes = () => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTimestamp;

			const userDataUpdates = {
				gridFillTimeConsumed: !gameState.userData.isCardFilled
					? gameState.userData.gridFillTimeConsumed + elapsedTime
					: gameState.userData.gridFillTimeConsumed,
				timeConsumed:
					gameState.userData.isCardFilled && gameState.opponentData.isCardFilled
						? gameState.userData.timeConsumed +
							(gameState.userData.playerNumber === gameState.turn
								? elapsedTime
								: 0)
						: gameState.userData.timeConsumed,
			};

			const opponentDataUpdates = {
				gridFillTimeConsumed: !gameState.opponentData.isCardFilled
					? gameState.opponentData.gridFillTimeConsumed + elapsedTime
					: gameState.opponentData.gridFillTimeConsumed,
				timeConsumed:
					gameState.userData.isCardFilled && gameState.opponentData.isCardFilled
						? gameState.opponentData.timeConsumed +
							(gameState.opponentData.playerNumber === gameState.turn
								? elapsedTime
								: 0)
						: gameState.opponentData.timeConsumed,
			};

			dispatch({
				type: "SET_PLAYER_DATA",
				payload: {
					userData: userDataUpdates,
					opponentData: opponentDataUpdates,
				},
			});

			startTimestamp = currentTime;
		};

		if (gameState.isGameStarted && !gameState.isGameEnded) {
			interval = setInterval(updateTimes, 100);
			return () => clearInterval(interval);
		}
	}, [gameState]);

	useEffect(() => {
		dispatch({
			type: "SET_PLAYER_DATA",
			payload: {
				userData: {
					linesCompleted: checkBingoWin(gameState.card),
				},
			},
		});

		if (!gameState.userData.isCardFilled && gameState.nextNumber > 25) {
			socketRef.current?.send(
				JSON.stringify({
					type: GRID_FILLED,
					payload: { board: gameState.card },
				}),
			);
			dispatch({
				type: "SET_PLAYER_DATA",
				payload: {
					userData: {
						isCardFilled: true,
					},
				},
			});
		}
	}, [gameState.nextNumber, gameState.lastNumber, gameState.isGameStarted]);

	function checkEndGame(playerData: PlayerData, isUser: boolean) {
		if (
			gameState.gameResult.result === "" &&
			(playerData.timeConsumed > GAME_TIME_MS ||
				playerData.gridFillTimeConsumed > CARDFILL_TIME_MS)
		) {
			dispatch({
				type: "SET_PLAYER_DATA",
				payload: {
					[isUser ? "userData" : "opponentData"]: {
						timeConsumed: GAME_TIME_MS,
						gridFillTimeConsumed: CARDFILL_TIME_MS,
					},
				},
			});

			socketRef.current?.send(
				JSON.stringify({
					type: GAME_ENDED,
					payload: {
						result:
							playerData.playerNumber === "player1"
								? "PLAYER2_WINS"
								: "PLAYER1_WINS",
						by: "TIME_UP",
					},
				}),
			);
		}
	}

	function handleCellClick(row: number, col: number) {
		if (
			gameState.card[row][col].number === null &&
			gameState.nextNumber <= 25
		) {
			const newCard = [...gameState.card];
			newCard[row][col] = {
				...newCard[row][col],
				number: gameState.nextNumber,
			};
			dispatch({ type: "UPDATE_CARD", payload: newCard });
		} else if (gameState.nextNumber > 25) {
			if (gameState.isGameStarted && !gameState.opponentData.isCardFilled) {
				toast({
					title: "Opponent's Card Not Filled",
					description: "Please wait for your opponent to complete their card.",
					variant: "destructive",
				});
				return;
			}

			socketRef.current?.send(
				JSON.stringify({
					type: MOVE,
					payload: { number: gameState.card[row][col].number },
				}),
			);

			dispatch({
				type: "MAKE_MOVE",
				payload: {
					number: gameState.card[row][col].number!,
				},
			});
		}
	}

	function generateRandomBingoGrid(): BingoCell[][] {
		const numbers = Array.from({ length: 25 }, (_, i) => i + 1);

		for (let i = numbers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[numbers[i], numbers[j]] = [numbers[j], numbers[i]];
		}

		const grid: BingoCell[][] = [];
		for (let i = 0; i < 5; i++) {
			grid.push(
				numbers.slice(i * 5, i * 5 + 5).map((number) => ({
					number,
					marked: false,
				})),
			);
		}
		dispatch({ type: "SET_NEXT_NUMBER", payload: 26 });
		return grid;
	}

	function handleGameExit() {
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						gameState.opponentData.playerNumber === "player1"
							? "PLAYER1_WINS"
							: "PLAYER2_WINS",
					by: "PLAYER_EXIT",
				},
			}),
		);
	}

	checkEndGame(gameState.userData, true);
	checkEndGame(gameState.opponentData, false);

	return (
		<div
			className={`pt-24 flex flex-col md:flex-row md:gap-4 lg:gap-10 justify-center items-center h-full w-full`}
		>
			{gameState.isGameStarted && (
				<PlayerInfo
					playerData={isMobile ? gameState.opponentData : gameState.userData}
					isTurn={
						gameState.turn ===
						(isMobile
							? gameState.opponentData.playerNumber
							: gameState.userData.playerNumber)
					}
					isCurrentPlayer={!isMobile}
				/>
			)}
			<div className="max-w-sm min-w-80 w-full flex flex-col items-center justify-center gap-4">
				<BingoCard
					card={gameState.card}
					handleCellClick={handleCellClick}
					isDisable={
						!gameState.isGameStarted ||
						(gameState.nextNumber > 25 &&
							gameState.turn !== gameState.userData.playerNumber)
					}
					isGameStarted={gameState.isGameStarted}
					lastNumber={gameState.lastNumber}
				/>
				{!isMobile && (
					<GameButtons
						isCardFilled={gameState.userData.isCardFilled}
						isGameEnded={gameState.isGameEnded}
						isGameStarted={gameState.isGameStarted}
						gameResult={gameState.gameResult}
						isMobile={isMobile}
						onExitClick={handleGameExit}
						onResetClick={resetGame}
						onFillRandomClick={() =>
							dispatch({
								type: "UPDATE_CARD",
								payload: generateRandomBingoGrid(),
							})
						}
					/>
				)}
			</div>
			{gameState.isGameStarted && (
				<PlayerInfo
					playerData={isMobile ? gameState.userData : gameState.opponentData}
					isTurn={
						gameState.turn ===
						(isMobile
							? gameState.userData.playerNumber
							: gameState.opponentData.playerNumber)
					}
					isCurrentPlayer={isMobile}
				/>
			)}
			{isMobile && (
				<GameButtons
					isCardFilled={gameState.userData.isCardFilled}
					isGameEnded={gameState.isGameEnded}
					isGameStarted={gameState.isGameStarted}
					gameResult={gameState.gameResult}
					isMobile={isMobile}
					onExitClick={handleGameExit}
					onResetClick={resetGame}
					onFillRandomClick={() =>
						dispatch({
							type: "UPDATE_CARD",
							payload: generateRandomBingoGrid(),
						})
					}
				/>
			)}
		</div>
	);
}
