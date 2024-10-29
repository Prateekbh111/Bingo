"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
	Check,
	CircleDollarSign,
	Gamepad2,
	LoaderCircle,
	LoaderCircleIcon,
} from "lucide-react";
import { ToastAction } from "./ui/toast";
import {
	ACCEPT_GAME_INVITE,
	CANCEL_INIT_GAME,
	CARDFILL_TIME_MS,
	checkBingoWin,
	EXIT,
	FILLRANDOM,
	GAME_ENDED,
	GAME_INVITE,
	GAME_TIME_MS,
	GRID_FILLED,
	INIT_GAME,
	INIT_GAME_COINS,
	MOVE,
	PLAYAGAIN,
	RECONNECT,
	SEND_GAME_INVITE,
} from "@/lib/utils";
import PlayerInfo from "./PlayerInfo";
import GameEndModal from "./GameEndModal";
import Friends from "./Friends";
import { useSidebar } from "./ui/sidebar";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import BingoCard from "./BingoCard";
import DynamicButton from "./DynamicButton";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

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
	const { open, isMobile } = useSidebar();
	const socketRef = useRef<WebSocket | null>(null);
	const [userCoins, setUserCoins] = useState<number>(0);
	const [normalGameDisable, setNormalGameDisable] = useState<boolean>(false);
	const [coinsGameDisable, setCoinsGameDisable] = useState<boolean>(false);
	const [turn, setTurn] = useState<string>("player1");
	const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
	const [isGameEnded, setIsGameEnded] = useState<boolean>(false);
	const [nextNumber, setNextNumber] = useState<number>(1);
	const [lastNumber, setLastNumber] = useState<number | null>(null);
	const [card, setCard] = useState<BingoCell[][]>([]);

	const [isSearchingGame, setIsSearchingGame] = useState<boolean>(false);
	const [isSearchingCoinGame, setIsSearchingCoinGame] =
		useState<boolean>(false);
	const [gameResult, setGameResult] = useState<GameResult>({
		result: "",
		by: "",
	});

	const [userData, setUserData] = useState<PlayerData>({
		isCardFilled: false,
		timeConsumed: 0,
		gridFillTimeConsumed: 0,
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
		gridFillTimeConsumed: 0,
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
		setNormalGameDisable(false);
		setCoinsGameDisable(false);
		setIsSearchingGame(false);
		setIsSearchingCoinGame(false);

		setUserData((prevUserData) => ({
			...prevUserData,
			isCardFilled: false,
			playerNumber: "",
			linesCompleted: 0,
			timeConsumed: 0,
			gridFillTimeConsumed: 0,
		}));
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			isCardFilled: false,
			playerNumber: "",
			linesCompleted: 0,
			timeConsumed: 0,
			gridFillTimeConsumed: 0,
		}));
		fetchCoins();
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
				handleMove(messageJson.payload);
				break;
			case GAME_ENDED:
				if (gameResult?.result != "") return;
				const result = messageJson.payload.result;
				const by = messageJson.payload.status;
				setGameResult({ result, by });
				setNormalGameDisable(true);
				setIsGameEnded(true);
				fetchCoins();
				break;
			case RECONNECT:
				handleReconnectGame(messageJson.payload);
				break;
		}
	}

	async function fetchCoins() {
		const response = await axios.get<ApiResponse>("/api/balance");
		setUserCoins(response.data.payload!);
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
		let startTimestamp = Date.now();
		let interval: NodeJS.Timeout;

		const updateGridFillTimes = () => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTimestamp;

			if (!userData.isCardFilled) {
				setUserData((prevUserData) => ({
					...prevUserData,
					gridFillTimeConsumed: prevUserData.gridFillTimeConsumed + elapsedTime,
				}));
			}

			if (!opponentData.isCardFilled) {
				setOpponentData((prevOpponentData) => ({
					...prevOpponentData,
					gridFillTimeConsumed:
						prevOpponentData.gridFillTimeConsumed + elapsedTime,
				}));
			}

			startTimestamp = currentTime;
		};

		if (isGameStarted && !isGameEnded) {
			interval = setInterval(updateGridFillTimes, 100);

			return () => {
				clearInterval(interval);
			};
		}
	}, [
		isGameStarted,
		isGameEnded,
		userData.isCardFilled,
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

	if (
		gameResult.result === "" &&
		(userData.timeConsumed > GAME_TIME_MS ||
			userData.gridFillTimeConsumed > CARDFILL_TIME_MS)
	) {
		setUserData((prevUserData) => ({
			...prevUserData,
			timeConsumed: GAME_TIME_MS,
			gridFillTimeConsumed: CARDFILL_TIME_MS,
		}));
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						userData.playerNumber === "player1"
							? "PLAYER2_WINS"
							: "PLAYER1_WINS",
					by: "TIME_UP",
				},
			}),
		);
	}

	if (
		gameResult.result === "" &&
		(opponentData.timeConsumed > GAME_TIME_MS ||
			opponentData.gridFillTimeConsumed > CARDFILL_TIME_MS)
	) {
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			timeConsumed: GAME_TIME_MS,
			gridFillTimeConsumed: CARDFILL_TIME_MS,
		}));
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						opponentData.playerNumber === "player1"
							? "PLAYER2_WINS"
							: "PLAYER1_WINS",
					by: "TIME_UP",
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
		setNormalGameDisable(false);
	}

	function handleMove(payload: Payload) {
		markNumber(payload.number!);
		setLastNumber(payload.number!);
		setTurn((prevTurn) => (prevTurn === "player1" ? "player2" : "player1"));
		setUserData((prevUserData) => ({
			...prevUserData,
			timeConsumed:
				prevUserData.playerNumber === "player1"
					? payload.player1TimeConsumed!
					: payload.player2TimeConsumed!,
		}));
		setOpponentData((prevOpponentData) => ({
			...prevOpponentData,
			timeConsumed:
				prevOpponentData.playerNumber === "player1"
					? payload.player1TimeConsumed!
					: payload.player2TimeConsumed!,
			linesCompleted: payload.linesCompleted!,
		}));
	}

	function handleReconnectGame(payload: Payload) {
		toast({
			title: "Reconnected",
			description: "You are connected to previously uncompleted game.",
		});
		setCard(payload.board!.length === 0 ? generateEmptyCard() : payload.board!);
		setTurn(payload.turn!);
		setNextNumber(payload.board!.length === 0 ? 1 : 26);
		setIsGameStarted(true);
		setNormalGameDisable(false);
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
		setNormalGameDisable(true);
		setIsSearchingGame(true);
		socketRef.current?.send(JSON.stringify({ type: INIT_GAME }));
	}

	function handleCoinsGameSelect() {
		if (userCoins < 2) {
			toast({ title: "Not sufficient Coins!!!" });
			return;
		}
		setIsSearchingCoinGame(true);
		setCoinsGameDisable(true);
		socketRef.current?.send(JSON.stringify({ type: INIT_GAME_COINS }));
	}

	function handlePlayWithFriend(friendId: string) {
		socketRef.current?.send(
			JSON.stringify({ type: SEND_GAME_INVITE, payload: { friendId } }),
		);
	}

	function handleGameExit() {
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						opponentData.playerNumber === "player1"
							? "PLAYER1_WINS"
							: "PLAYER2_WINS",
					by: "PLAYER_EXIT",
				},
			}),
		);
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

	function cancelGameSearch() {
		setIsSearchingGame(false);
		setIsSearchingCoinGame(false);
		setNormalGameDisable(false);
		setCoinsGameDisable(false);
		socketRef.current?.send(JSON.stringify({ type: CANCEL_INIT_GAME }));
	}

	return (
		<div
			className={`bg-background flex flex-col md:flex-row justify-center items-center min-h-screen p-4 gap-4 w-full ${open && "md:flex-col lg:flex-row"}`}
		>
			<div
				className={`pt-24 flex flex-col md:flex-row md:gap-4 lg:gap-10 justify-center items-center h-full w-full  `}
			>
				{isGameStarted && isMobile && (
					<PlayerInfo
						playerData={opponentData}
						isCurrentPlayer={false}
						isTurn={turn === opponentData.playerNumber}
					/>
				)}
				{isGameStarted && !isMobile && (
					<PlayerInfo
						playerData={userData}
						isTurn={turn === userData.playerNumber}
						isCurrentPlayer={true}
					/>
				)}
				<div className="max-w-sm min-w-80 w-full flex flex-col items-center justify-center gap-4">
					<BingoCard
						card={card}
						handleCellClick={handleCellClick}
						isDisable={
							normalGameDisable ||
							!isGameStarted ||
							(nextNumber > 25 && turn !== userData.playerNumber)
						}
						isGameStarted={isGameStarted}
						lastNumber={lastNumber}
					/>

					{isGameStarted && !isGameEnded && !isMobile && (
						<div className="flex justify-around items-center max-w-sm w-full">
							{!userData.isCardFilled && (
								<DynamicButton
									onClick={() => setCard(generateRandomBingoGrid())}
									buttonType={FILLRANDOM}
								/>
							)}

							<DynamicButton
								buttonType={EXIT}
								onClick={() => handleGameExit()}
							/>
						</div>
					)}
					{isGameEnded && gameResult.result == "" && (
						<DynamicButton onClick={() => resetGame()} buttonType={PLAYAGAIN} />
					)}
				</div>
				{isGameStarted && isMobile && (
					<PlayerInfo
						playerData={userData}
						isTurn={turn === userData.playerNumber}
						isCurrentPlayer={true}
					/>
				)}
				{isGameStarted && !isMobile && (
					<PlayerInfo
						playerData={opponentData}
						isCurrentPlayer={false}
						isTurn={turn === opponentData.playerNumber}
					/>
				)}
			</div>
			{isGameStarted && !isGameEnded && isMobile && (
				<div className="flex justify-around items-center w-full max-w-sm">
					{!userData.isCardFilled && (
						<DynamicButton
							isMobile={true}
							onClick={() => setCard(generateRandomBingoGrid())}
							buttonType={FILLRANDOM}
						/>
					)}

					<DynamicButton
						isMobile={true}
						buttonType={EXIT}
						onClick={() => handleGameExit()}
					/>
				</div>
			)}
			{isGameEnded && gameResult.result == "" && (
				<DynamicButton
					isMobile={true}
					onClick={() => resetGame()}
					buttonType={PLAYAGAIN}
				/>
			)}
			{!isGameStarted && (
				<div className="md:pt-24 flex justify-center items-center h-full w-full">
					<div className="max-w-sm w-full">
						<div className="space-y-8">
							<Dialog open={isSearchingGame}>
								<DialogTrigger className="w-full">
									<Button
										className="w-full py-8 text-lg"
										onClick={handleRandomGameSelect}
										disabled={normalGameDisable || coinsGameDisable}
										size="lg"
									>
										{!normalGameDisable ? (
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
								</DialogTrigger>
								<DialogContent className="max-w-sm">
									<DialogHeader>
										<DialogTitle>Searching Game</DialogTitle>
									</DialogHeader>
									<span className="flex items-center gap-2">
										Waiting for another player{" "}
										<LoaderCircle className="h-5 w-5 animate-spin" />
									</span>
									<DialogFooter className="justify-end md:w-full">
										<DialogClose asChild>
											<Button
												size={"sm"}
												type="button"
												variant={"destructive"}
												onClick={cancelGameSearch}
											>
												Cancel
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<div className="space-y-2">
								<Dialog open={isSearchingCoinGame}>
									<DialogTrigger className="w-full">
										<Button
											className="w-full py-8 text-lg"
											onClick={handleCoinsGameSelect}
											disabled={normalGameDisable || coinsGameDisable}
											size="lg"
										>
											{!coinsGameDisable ? (
												<span className="flex items-center gap-2">
													Play with coins{" "}
													<CircleDollarSign className="h-5 w-5" />
												</span>
											) : (
												<span className="flex items-center gap-2">
													Waiting for another open coin match{" "}
													<LoaderCircle className="h-5 w-5 animate-spin" />
												</span>
											)}
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Searching Game</DialogTitle>
										</DialogHeader>
										<span className="flex items-center gap-2">
											Waiting for another open coin match{" "}
											<LoaderCircle className="h-5 w-5 animate-spin" />
										</span>
										<DialogFooter>
											<Button
												type="submit"
												variant={"destructive"}
												onClick={cancelGameSearch}
											>
												Cancel
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								<div className="flex items-center text-muted-foreground text-sm m-0">
									Current Balance: <CircleDollarSign className="ml-2 h-4 w-4" />
									{userCoins}
								</div>
							</div>

							{/* <div className="space-y-2">
								<Button
									className="w-full py-8 text-lg"
									onClick={handleCoinsGameSelect}
									disabled={normalGameDisable || coinsGameDisable}
									size="lg"
								>
									{!coinsGameDisable ? (
										<span className="flex items-center gap-2">
											Play with coins <CircleDollarSign className="h-5 w-5" />
										</span>
									) : (
										<span className="flex items-center gap-2">
											Waiting for another open coin match{" "}
											<LoaderCircle className="h-5 w-5 animate-spin" />
										</span>
									)}
								</Button>
							</div> */}

							<Friends
								friends={friends}
								disabled={normalGameDisable || coinsGameDisable}
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
				by={gameResult.by}
				onPlayAgain={() => {
					setGameResult({ result: "", by: "" });
					resetGame();
				}}
			/>
		</div>
	);
}
