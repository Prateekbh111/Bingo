"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, LoaderCircle, LoaderCircleIcon, Users } from "lucide-react";
import WinnerModal from "./Winner_modal";
import LoserModal from "./Loser_modal";

type BingoCell = {
	number: number | null;
	marked: boolean;
};

type User = {
	id: string;
	name: string;
	email: string;
	image: string;
};

type Payload = {
	playerNumber?: string;
	otherPlayer?: User;
	board?: BingoCell[][];
	cardFilled?: boolean;
	opponentCardFilled?: boolean;
	turn?: string;
	linesCompleted?: number;
	opponentLinesCompleted?: number;
};

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GRID_FILLED = "grid_filled";
export const BEGIN_GAME = "begin_game";
export const GAME_OVER = "game_over";
export const RECONNECT = "reconnect";

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
	const [cellSize, setCellSize] = useState(56);
	const [card, setCard] = useState<BingoCell[][]>([]);
	const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
	const [isOpponentCardFilled, setIsOpponentCardFilled] =
		useState<boolean>(false);
	const [opponentLinesCompleted, setOpponentLinesCompleted] =
		useState<number>(0);
	const [linesCompleted, setLinesCompleted] = useState<number>(0);
	const [nextNumber, setNextNumber] = useState<number>(1);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [userFriends] = useState<Friend[]>(friends);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [opponent, setOpponent] = useState<User | null>();
	const [turn, setTurn] = useState<string>("player1");
	const [playerNumber, setPlayerNumber] = useState<string | null>(null);
	const [isCardFilled, setIsCardFilled] = useState<boolean>(false);

	const [isLoser, setIsLoser] = useState(false);
	const [isWinner, setIsWinner] = useState(false);
	const [winnerName, setWinnerName] = useState("");

	useEffect(() => {
		const newSocket = new WebSocket(
			`wss://${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}:8080/token=${sessionToken}`,
		);
		newSocket.onopen = () => console.log("Connection established");
		newSocket.onmessage = handleSocketMessage;
		setSocket(newSocket);

		return () => newSocket.close();
	}, []);

	useEffect(() => {
		resetGame();
	}, []);

	useEffect(() => {
		setLinesCompleted(checkBingoWin(card));
		if (!isCardFilled && nextNumber > 25) {
			socket?.send(
				JSON.stringify({ type: GRID_FILLED, payload: { board: card } }),
			);
			setIsCardFilled(true);
		}
	}, [nextNumber, isCardFilled, card, socket]);

	const handleSocketMessage = async (message: MessageEvent) => {
		const messageJson = JSON.parse(message.data);
		console.log(messageJson.type);
		switch (messageJson.type) {
			case INIT_GAME:
				handleInitGame(messageJson.payload);
				break;
			case GRID_FILLED:
				setIsOpponentCardFilled(true);
				break;
			case MOVE:
				console.log(messageJson.payload);
				handleMove(messageJson.payload.number);
				setOpponentLinesCompleted(messageJson.payload.linesCompleted);
				break;
			case GAME_OVER:
				const winner = messageJson.payload.winnerName;
				setWinnerName(winner);
				if (winner == session.user.name) {
					setIsWinner(true);
				} else {
					setIsLoser(true);
				}
				break;
			case RECONNECT:
				console.log(messageJson);
				handleReconnectGame(messageJson.payload);
				break;
		}
	};

	const handleInitGame = (payload: Payload) => {
		setPlayerNumber(payload.playerNumber!);
		setOpponent(payload.otherPlayer);
		setIsGameStarted(true);
		setDisabled(false);
	};

	const handleMove = (number: number) => {
		markNumber(number);
		setTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));
	};

	function handleReconnectGame(payload: Payload) {
		//TODO: next number state is doing some issue will look into in tommorow
		setPlayerNumber(payload.playerNumber!);
		setOpponent(payload.otherPlayer);
		setIsCardFilled(payload.cardFilled!);
		setIsOpponentCardFilled(payload.opponentCardFilled!);
		setCard(payload.board!.length === 0 ? generateEmptyCard() : payload.board!);
		setTurn(payload.turn!);
		setNextNumber(payload.board!.length === 0 ? 1 : 26);
		setLinesCompleted(payload.linesCompleted!);
		setOpponentLinesCompleted(payload.opponentLinesCompleted!);
		setIsGameStarted(true);
		setDisabled(false);
	}

	const generateEmptyCard = (): BingoCell[][] => {
		return Array(5)
			.fill(null)
			.map(() =>
				Array(5)
					.fill(null)
					.map(() => ({ number: null, marked: false })),
			);
	};

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

	const resetGame = () => {
		setCard(generateEmptyCard());
		setNextNumber(1);
		setIsCardFilled(false);
		setIsOpponentCardFilled(false);
		setPlayerNumber(null);
		setTurn("player1");
		setOpponent(null);
		setLinesCompleted(0);
		setOpponentLinesCompleted(0);
		setIsGameStarted(false);
		setIsWinner(false);
		setIsLoser(false);
	};

	const markNumber = (number: number) => {
		setCard((prevCard) =>
			prevCard.map((row) =>
				row.map((cell) =>
					cell.number === number ? { ...cell, marked: true } : cell,
				),
			),
		);
	};

	const handleCellClick = (row: number, col: number) => {
		if (card[row][col].number === null && nextNumber <= 25) {
			setCard((prevCard) => {
				const newCard = [...prevCard];
				newCard[row][col] = { ...newCard[row][col], number: nextNumber };
				return newCard;
			});
			setNextNumber((prev) => prev + 1);
		} else if (nextNumber > 25) {
			if (isGameStarted && !isOpponentCardFilled) {
				toast({
					title: "Opponent's Card Not Filled",
					description: "Please wait for your opponent to complete their card.",
					variant: "destructive",
				});
				return;
			}

			socket?.send(
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
			setTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));
		}
	};

	const handleRandomGameSelect = () => {
		setDisabled(true);
		socket?.send(JSON.stringify({ type: INIT_GAME }));
	};

	const updateCellSize = (containerWidth: number) => {
		const newSize = Math.floor((containerWidth - 30) / 5);
		setCellSize(Math.max(newSize, 56));
	};

	const handlePlayAgain = () => {
		setIsWinner(false);
		setIsLoser(false);
		setWinnerName("");
		resetGame();
	};

	if (!socket || !card)
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="flex justify-center items-center gap-2 text-3xl font-bold">
					Loading <LoaderCircleIcon className="animate-spin" />
				</div>
			</div>
		);

	return (
		<div className="bg-background flex flex-col md:flex-row justify-center items-center min-h-screen p-4 gap-4 w-full">
			<div className="md:pt-24 flex flex-col md:flex-row md:gap-10 justify-center items-center h-full w-full ">
				{isGameStarted && (
					<PlayerInfo
						player={{
							id: session.user.id,
							name: "You",
							email: session.user.email!,
							image: session.user.image!,
						}}
						isTurn={turn === playerNumber}
						isCurrentPlayer={true}
						isCardFilled={isCardFilled}
						linesCompleted={linesCompleted}
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
												cell.marked ? "bg-primary text-primary-foreground" : ""
											}`}
											style={{
												width: `${cellSize}px`,
												height: `${cellSize}px`,
											}}
											disabled={
												disabled ||
												!isGameStarted ||
												(nextNumber > 25 && turn !== playerNumber) ||
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
					{isGameStarted && !isCardFilled && (
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
						player={opponent!}
						isTurn={turn !== playerNumber}
						isCurrentPlayer={false}
						isCardFilled={isOpponentCardFilled}
						linesCompleted={opponentLinesCompleted}
					/>
				)}
			</div>
			{isGameStarted && !isCardFilled && (
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

							<div className="space-y-4">
								<h2 className="text-lg font-semibold flex items-center gap-2">
									<Users className="h-5 w-5" />
									Friends
								</h2>
								{userFriends.length === 0 ? (
									<p className="text-muted-foreground">No friends yet.</p>
								) : (
									<ScrollArea>
										<div className="space-y-4">
											{userFriends.map((user) => (
												<Card key={user.id} className="p-4">
													<div className="flex items-center gap-4">
														<Avatar className="h-12 w-12">
															<AvatarImage src={user.image!} />
															<AvatarFallback>
																{user.name![0].toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className="flex-1">
															<h3 className="font-semibold">{user.name}</h3>
															<p className="text-sm text-muted-foreground">
																{user.email}
															</p>
														</div>
														<Button disabled={disabled} size="sm">
															Play
														</Button>
													</div>
												</Card>
											))}
										</div>
									</ScrollArea>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			<WinnerModal
				isOpen={isWinner}
				onClose={() => setIsWinner(false)}
				winner={winnerName}
				onPlayAgain={handlePlayAgain}
			/>

			<LoserModal
				isOpen={isLoser}
				onClose={() => setIsLoser(false)}
				winner={winnerName}
				onPlayAgain={handlePlayAgain}
			/>
		</div>
	);
}

interface Player {
	id: string;
	name: string;
	email: string;
	image: string;
}

interface PlayerInfoProps {
	player: Player;
	isTurn?: boolean;
	isCurrentPlayer: boolean;
	isCardFilled: boolean;
	linesCompleted: number;
}

function PlayerInfo({
	player,
	isCardFilled,
	isTurn,
	isCurrentPlayer,
	linesCompleted,
}: PlayerInfoProps) {
	const bingoLetters = ["B", "I", "N", "G", "O"];
	return (
		<div
			className={` flex md:flex-col items-center justify-center w-full max-w-sm md:max-w-xs  gap-2 p-4 border-2 bg-card ${isCurrentPlayer ? "rounded-t-md border-b-0 md:border-b-2" : "rounded-b-md border-t-0 md:border-t-2"} md:rounded-md  ${isTurn && isCurrentPlayer && "border-2 border-t-primary "} ${isTurn && !isCurrentPlayer && " border-2 border-b-primary md:border-t-primary md:border-b-card"}`}
		>
			<Avatar className="h-10 w-10">
				<AvatarImage
					src={player ? player.image : ""}
					alt={player ? player.name : "Opponent"}
				/>
				<AvatarFallback>
					{player ? player.name[0].toUpperCase() : "O"}
				</AvatarFallback>
			</Avatar>
			<div className="w-full flex md:flex-col md:text-center justify-between items-center">
				<div>
					<p className="font-semibold text-sm truncate">
						{player ? player.name : "Opponent"}
					</p>
					<p className="text-xs font-medium">
						{isCardFilled ? (
							<span className="text-green-500">Card Filled</span>
						) : (
							<span className="text-yellow-500">Filling Card...</span>
						)}
					</p>
				</div>
				<div className="flex justify-center items-center">
					{bingoLetters.map((letter, index) => (
						<div
							key={letter}
							className={`
									flex items-center justify-center text-2xl font-bold transition-all duration-300 ease-in-out
									${
										index < linesCompleted
											? "text-secondary-foreground scale-110"
											: "text-primary-foreground scale-100"
									}
								`}
							aria-label={`Bingo letter ${letter} ${
								index < linesCompleted ? "completed" : "not completed"
							}`}
						>
							{letter}
						</div>
					))}
				</div>
				{/* <p className="text-xs font-medium">{checkBingoWin(card) && "winner"}</p> */}
			</div>
		</div>
	);
}

function checkBingoWin(bingoCard: BingoCell[][]): number {
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
