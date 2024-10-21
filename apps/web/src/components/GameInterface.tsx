"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Gamepad2, LoaderCircle, LoaderCircleIcon } from "lucide-react";
import { ToastAction } from "./ui/toast";
import {
	ACCEPT_GAME_INVITE,
	checkBingoWin,
	GAME_ENDED,
	GAME_INVITE,
	GAME_TIME,
	GAME_TIME_MS,
	GRID_FILLED,
	INIT_GAME,
	MOVE,
	RECONNECT,
	SEND_GAME_INVITE,
} from "@/lib/utils";
import PlayerInfo from "./PlayerInfo";
import GameEndModal from "./GameEndModal";
import Friends from "./Friends";

export default function GameInterface({
	friends,
	session,
	sessionToken,
}: {
	friends: Friend[];
	session: Session;
	sessionToken: string | undefined;
}) {
	const { toast } = useToast();

	const socketRef = useRef<WebSocket | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
	const [turn, setTurn] = useState<string>("player1");
	const [nextNumber, setNextNumber] = useState<number>(1);
	const [lastNumber, setLastNumber] = useState<number | null>(null);

	const [cellSize, setCellSize] = useState(56);
	const [card, setCard] = useState<BingoCell[][]>([]);

	const [gameResult, setGameResult] = useState<GameResult>({
		result: "",
		by: "",
	});

	const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

	const [userData, setUserData] = useState<PlayerData>({
		isCardFilled: false,
		timeConsumed: 0,
		linesCompleted: 0,
		playerNumber: "",
		data: {
			id: session.user.id!,
			name: session.user.name!,
			username: session.user.username!,
			image: session.user.image!,
		},
	});

	const [opponentData, setOpponentData] = useState<PlayerData>({
		isCardFilled: false,
		timeConsumed: 0,
		linesCompleted: 0,
		playerNumber: "",
		data: null,
	});

	const resetGame = useCallback(() => {
		setCard(generateEmptyCard());
		setNextNumber(1);
		setTurn("player1");
		setGameResult({ result: "", by: "" });
		setLastNumber(null);
		setIsGameStarted(false);
		setIsGameEnded(false);
		setDisabled(false);

		setUserData((prevUserData) => ({
			...prevUserData,
			isCardFilled: false,
			playerNumber: "",
			linesCompleted: 0,
			timeConsumed: 0,
		}));
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			isCardFilled: false,
			playerNumber: "",
			linesCompleted: 0,
			timeConsumed: 0,
		}));
	}, []);

	async function handleSocketMessage(message: MessageEvent) {
		const messageJson = JSON.parse(message.data);
		console.log(messageJson.type);
		switch (messageJson.type) {
			case INIT_GAME:
				handleInitGame(messageJson.payload);
				break;
			case GAME_INVITE:
				handleGameInvite(messageJson.payload);
			case GRID_FILLED:
				setOpponentData((prevOpponentData) => ({
					...prevOpponentData,
					isCardFilled: true,
				}));
				break;
			case MOVE:
				handleMove(messageJson.payload.number);
				setUserData((prevUserData) => ({
					...prevUserData,
					timeConsumed:
						prevUserData.playerNumber === "player1"
							? messageJson.payload.player1TimeConsumed!
							: messageJson.payload.player2TimeConsumed!,
				}));
				setOpponentData((prevOpponentData) => ({
					...prevOpponentData,
					timeConsumed:
						prevOpponentData.playerNumber === "player1"
							? messageJson.payload.player1TimeConsumed!
							: messageJson.payload.player2TimeConsumed!,
					linesCompleted: messageJson.payload.linesCompleted!,
				}));
				break;
			case GAME_ENDED:
				if (gameResult?.result != "") return;
				const result = messageJson.payload.result;
				const by = messageJson.payload.status;
				setGameResult({ result, by });
				setDisabled(true);
				setIsGameEnded(true);
				break;
			case RECONNECT:
				handleReconnectGame(messageJson.payload);
				break;
			case GAME_TIME:
				setUserData((prevUserData) => ({
					...prevUserData,
					timeConsumed:
						messageJson.payload.playerNumber! === "player1"
							? messageJson.payload.player1TimeConsumed!
							: messageJson.payload.player2TimeConsumed!,
				}));
				setOpponentData((prevOpponentData) => ({
					...prevOpponentData,
					timeConsumed:
						messageJson.payload.playerNumber! === "player1"
							? messageJson.payload.player1TimeConsumed!
							: messageJson.payload.player2TimeConsumed!,
					linesCompleted: messageJson.payload.opponentLinesCompleted!,
				}));
				break;
		}
	}

	useEffect(() => {
		const newSocket = new WebSocket(
			`wss://${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}:8080/token=${sessionToken}`,
		);
		newSocket.onopen = () => console.log("Connection established");
		socketRef.current = newSocket;
		newSocket.onmessage = handleSocketMessage;
		newSocket.onerror = () => console.error("WebSocket connection error");

		return () => {
			if (newSocket.readyState === WebSocket.OPEN) {
				newSocket.close();
				console.log("WebSocket connection closed");
			}
		};
	}, [sessionToken]);

	useEffect(() => {
		resetGame();
	}, [resetGame]);

	useEffect(() => {
		let startTimestamp = Date.now();
		let interval: NodeJS.Timeout;

		const updateTime = () => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTimestamp;

			if (userData.playerNumber === turn) {
				setUserData((prevUserData) => ({
					...prevUserData,
					timeConsumed: prevUserData.timeConsumed + elapsedTime,
				}));
			} else {
				setOpponentData((prevOpponentData) => ({
					...prevOpponentData,
					timeConsumed: prevOpponentData.timeConsumed + elapsedTime,
				}));
			}
			startTimestamp = currentTime;
		};

		if (
			isGameStarted &&
			userData.isCardFilled &&
			opponentData.isCardFilled &&
			!isGameEnded
		) {
			interval = setInterval(updateTime, 100);

			return () => {
				clearInterval(interval);
			};
		}
	}, [
		isGameStarted,
		isGameEnded,
		turn,
		userData.isCardFilled,
		userData.playerNumber,
		opponentData.isCardFilled,
	]);

	useEffect(() => {
		setUserData((prevUserData) => ({
			...prevUserData,
			linesCompleted: checkBingoWin(card),
		}));
		if (!userData.isCardFilled && nextNumber > 25) {
			socketRef.current?.send(
				JSON.stringify({ type: GRID_FILLED, payload: { board: card } }),
			);
			setUserData((prevUserData) => ({ ...prevUserData, isCardFilled: true }));
		}
	}, [nextNumber, card, userData.isCardFilled]);

	function generateEmptyCard(): BingoCell[][] {
		return Array(5)
			.fill(null)
			.map(() =>
				Array(5)
					.fill(null)
					.map(() => ({ number: null, marked: false })),
			);
	}

	if (!socketRef || card.length === 0) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="flex justify-center items-center gap-2 text-3xl font-bold">
					Loading <LoaderCircleIcon className="animate-spin" />
				</div>
			</div>
		);
	}

	if (gameResult.result === "" && userData.timeConsumed > GAME_TIME_MS) {
		setUserData((prevUserData) => ({
			...prevUserData,
			timeConsumed: GAME_TIME_MS,
		}));
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						userData.playerNumber === "player1"
							? "PLAYER2_WINS"
							: "PLAYER1_WINS",
				},
			}),
		);
	}

	if (gameResult.result === "" && opponentData.timeConsumed > GAME_TIME_MS) {
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			timeConsumed: GAME_TIME_MS,
		}));
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						opponentData.playerNumber === "player1"
							? "PLAYER2_WINS"
							: "PLAYER1_WINS",
				},
			}),
		);
	}

	function handleInitGame(payload: Payload) {
		setUserData((prevUserData) => ({
			...prevUserData,
			playerNumber: payload.playerNumber!,
		}));
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			playerNumber: payload.playerNumber! === "player1" ? "player2" : "player1",
			data: payload.otherPlayer!,
		}));

		setIsGameStarted(true);
		setDisabled(false);
	}

	function handleMove(number: number) {
		markNumber(number);
		setLastNumber(number);
		setTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));
	}

	function handleReconnectGame(payload: Payload) {
		toast({
			title: "Reconnected",
			description: "You are connected to previously uncompleted game.",
		});
		console.log(payload);
		console.log("player1-server: ", payload.player1TimeConsumed);

		console.log("player2-server: ", payload.player2TimeConsumed);

		setCard(payload.board!.length === 0 ? generateEmptyCard() : payload.board!);
		setTurn(payload.turn!);
		setNextNumber(payload.board!.length === 0 ? 1 : 26);
		setIsGameStarted(true);
		setDisabled(false);
		setUserData((prevUserData) => ({
			...prevUserData,
			playerNumber: payload.playerNumber!,
			isCardFilled: payload.cardFilled!,
			timeConsumed:
				payload.playerNumber! === "player1"
					? payload.player1TimeConsumed!
					: payload.player2TimeConsumed!,
			linesCompleted: payload.linesCompleted!,
		}));
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			playerNumber: payload.playerNumber! === "player1" ? "player2" : "player1",
			data: payload.otherPlayer!,
			isCardFilled: payload.opponentCardFilled!,
			timeConsumed:
				payload.playerNumber! === "player1"
					? payload.player2TimeConsumed!
					: payload.player1TimeConsumed!,
			linesCompleted: payload.opponentLinesCompleted!,
		}));
	}

	function handleGameInvite(payload: Payload) {
		const otherPlayer = payload.otherPlayer;
		toast({
			description: (
				<div className="flex items-center space-x-4 mb-4">
					<Avatar>
						<AvatarImage src={otherPlayer?.image} alt={otherPlayer?.name} />
						<AvatarFallback>{otherPlayer?.name}</AvatarFallback>
					</Avatar>
					<div className="grid gap-1">
						<p className="font-medium">Bingo Invite</p>
						<p className="text-sm text-muted-foreground">
							{otherPlayer?.name} has invited you to play Bingo!
						</p>
					</div>
				</div>
			),
			action: (
				<ToastAction
					altText="Accept game invite"
					onClick={() => {
						setGameResult({ result: "", by: "" });
						resetGame();
						socketRef.current!.send(
							JSON.stringify({
								type: ACCEPT_GAME_INVITE,
								payload: { otherPlayer },
							}),
						);
					}}
				>
					<Check className="w-4 h-4 mr-1" />
					Accept
				</ToastAction>
			),
			duration: 5000,
		});
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
		setNextNumber(26);
		return grid;
	}

	function markNumber(number: number) {
		setCard((prevCard) =>
			prevCard.map((row) =>
				row.map((cell) =>
					cell.number === number ? { ...cell, marked: true } : cell,
				),
			),
		);
	}

	function handleCellClick(row: number, col: number) {
		if (card[row][col].number === null && nextNumber <= 25) {
			setCard((prevCard) => {
				const newCard = [...prevCard];
				newCard[row][col] = { ...newCard[row][col], number: nextNumber };
				return newCard;
			});
			setNextNumber((prev) => prev + 1);
		} else if (nextNumber > 25) {
			if (isGameStarted && !opponentData.isCardFilled) {
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
					payload: { number: card[row][col].number },
				}),
			);
			setCard((prevCard) => {
				const newCard = [...prevCard];
				newCard[row][col] = { ...newCard[row][col], marked: true };
				return newCard;
			});
			setLastNumber(card[row][col].number);
			setTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));
		}
	}

	function handleRandomGameSelect() {
		setDisabled(true);
		socketRef.current?.send(JSON.stringify({ type: INIT_GAME }));
	}

	function updateCellSize(containerWidth: number) {
		const newSize = Math.floor((containerWidth - 30) / 5);
		setCellSize(Math.max(newSize, 56));
	}

	function handlePlayWithFriend(friendId: string) {
		socketRef.current?.send(
			JSON.stringify({ type: SEND_GAME_INVITE, payload: { friendId } }),
		);
	}

	return (
		<div className="bg-background flex flex-col md:flex-row justify-center items-center min-h-screen p-4 gap-4 w-full">
			<div className="md:pt-24 flex flex-col md:flex-row md:gap-10 justify-center items-center h-full w-full ">
				{isGameStarted && (
					<PlayerInfo
						playerData={userData}
						isTurn={turn === userData.playerNumber}
						isCurrentPlayer={true}
					/>
				)}
				<div className="max-w-sm w-full flex flex-col items-center justify-center gap-4">
					<Card
						className={`w-full dark:bg-card bg-neutral-100 border-2 ${isGameStarted && "rounded-none md:rounded-md"}`}
					>
						<CardContent className="p-4">
							<div
								className="grid grid-cols-5 gap-2"
								ref={(el) => {
									if (el) {
										const resizeObserver = new ResizeObserver((entries) => {
											for (const entry of entries) {
												updateCellSize(entry.contentRect.width);
											}
										});
										resizeObserver.observe(el);
										return () => resizeObserver.disconnect();
									}
								}}
							>
								{card.map((row, rowIndex) =>
									row.map((cell, cellIndex) => (
										<Button
											key={`${rowIndex}-${cellIndex}`}
											onClick={() => handleCellClick(rowIndex, cellIndex)}
											variant={cell.marked ? "default" : "outline"}
											className={`p-0 font-bold text-lg ${
												cell.marked && "bg-primary text-primary-foreground"
											} ${lastNumber && cell.number === lastNumber && "ring-4 dark:ring-neutral-400 ring-neutral-600"}`}
											style={{
												width: `${cellSize}px`,
												height: `${cellSize}px`,
											}}
											disabled={
												disabled ||
												!isGameStarted ||
												(nextNumber > 25 && turn !== userData.playerNumber) ||
												cell.marked
											}
										>
											{cell.number}
										</Button>
									)),
								)}
							</div>
						</CardContent>
					</Card>
					{isGameStarted && !userData.isCardFilled && (
						<Button
							className="hidden md:block opacity-0 md:opacity-100"
							onClick={() => setCard(generateRandomBingoGrid())}
						>
							Fill randomly
						</Button>
					)}
				</div>
				{isGameStarted && (
					<PlayerInfo
						playerData={opponentData}
						isCurrentPlayer={false}
						isTurn={turn === opponentData.playerNumber}
					/>
				)}
			</div>
			{isGameStarted && !userData.isCardFilled && (
				<Button
					className="block md:hidden opacity-100 md:opacity-0"
					onClick={() => setCard(generateRandomBingoGrid())}
				>
					Fill randomly
				</Button>
			)}
			{!isGameStarted && (
				<div className="md:pt-24 flex justify-center items-center h-full w-full">
					<div className="max-w-sm w-full">
						<div className="space-y-8">
							<Button
								className="w-full py-8 text-lg"
								onClick={handleRandomGameSelect}
								disabled={disabled}
								size="lg"
							>
								{!disabled ? (
									<span className="flex items-center gap-2">
										Join Random Game <Gamepad2 className="h-5 w-5" />
									</span>
								) : (
									<span className="flex items-center gap-2">
										Waiting for another player{" "}
										<LoaderCircle className="h-5 w-5 animate-spin" />
									</span>
								)}
							</Button>

							<Friends
								friends={friends}
								disabled={disabled}
								handlePlayWithFriend={handlePlayWithFriend}
								session={session}
							/>
						</div>
					</div>
				</div>
			)}
			<GameEndModal
				isOpen={gameResult.result !== ""}
				onClose={() => {
					// setUserData((prevUserData) => ({
					// 	...prevUserData,
					// 	timeConsumed: 0,
					// }));
					// setOpponentData((prevOpponentData) => ({
					// 	...prevOpponentData,
					// 	timeConsumed: 0,
					// }));
					setGameResult({ result: "", by: "" });
				}}
				isWinner={
					gameResult?.result === "PLAYER1_WINS" &&
					userData.playerNumber === "player1"
						? true
						: gameResult?.result === "PLAYER2_WINS" &&
							  userData.playerNumber === "player2"
							? true
							: false
				}
				by={gameResult.by || ""}
				onPlayAgain={() => {
					setGameResult({ result: "", by: "" });
					resetGame();
				}}
			/>
		</div>
	);
}
