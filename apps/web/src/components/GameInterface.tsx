"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Check, LoaderCircleIcon } from "lucide-react";
import { ToastAction } from "./ui/toast";
import {
	ACCEPT_GAME_INVITE,
	GAME_ENDED,
	GAME_INVITE,
	GRID_FILLED,
	INIT_GAME,
	MOVE,
	PENDING_GAME,
	RECONNECT,
} from "@/lib/utils";
import GameEndModal from "./GameEndModal";
import { useSidebar } from "./ui/sidebar";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { gameReducer, initialGameState } from "@/lib/GameReducer";
import GameSearchInterface from "./GameSearchInterface";
import GamePlayInterface from "./GamePlayInterface";
import { Payload } from "@/types/types";

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
	const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

	const resetGame = useCallback(() => {
		dispatch({ type: "RESET_GAME" });
		dispatch({
			type: "SET_PLAYER_DATA",
			payload: {
				userData: {
					data: {
						id: session.user.id!,
						image: session.user.image!,
						name: session.user.name!,
					},
				},
			},
		});
		fetchCoins();
	}, []);

	useEffect(() => {
		resetGame();
	}, [resetGame]);

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

	async function handleSocketMessage(message: MessageEvent) {
		const messageJson = JSON.parse(message.data);
		console.log(messageJson.type);
		switch (messageJson.type) {
			case INIT_GAME:
				dispatch({
					type: "INIT_GAME",
					payload: messageJson.payload,
				});
				break;
			case GAME_INVITE:
				handleGameInvite(messageJson.payload);
			case GRID_FILLED:
				dispatch({
					type: "SET_PLAYER_DATA",
					payload: {
						opponentData: { isCardFilled: true },
					},
				});
				break;
			case MOVE:
				handleMove(messageJson.payload);
				break;
			case GAME_ENDED:
				if (gameState.gameResult?.result != "") return;
				dispatch({ type: "END_GAME", payload: messageJson.payload });
				fetchCoins();
				break;
			case RECONNECT:
				if (messageJson.payload.playerNumber === null) {
					toast({
						title: "Game Not Found",
						description: "You are not connected to any game.",
						duration: 1000,
					});
					dispatch({ type: "SET_PENDING_GAME", payload: null });
					dispatch({ type: "START_SEARCH_NORMAL" });
					socketRef.current?.send(JSON.stringify({ type: INIT_GAME }));
				} else {
					toast({
						title: "Reconnected",
						description: "You are connected to previously uncompleted game.",
						duration: 1000,
					});
					dispatch({ type: "RECONNECT_GAME", payload: messageJson.payload });
				}
				break;
			case PENDING_GAME:
				dispatch({
					type: "SET_PENDING_GAME",
					payload: messageJson.payload,
				});
				break;
		}
	}

	async function fetchCoins() {
		const response = await axios.get<ApiResponse>("/api/balance");
		setUserCoins(response.data.payload!);
	}

	function handleMove(payload: Payload) {
		dispatch({ type: "MAKE_MOVE", payload: payload });
		dispatch({
			type: "SET_PLAYER_DATA",
			payload: {
				userData: {
					timeConsumed:
						gameState.userData.playerNumber === "player1"
							? payload.player1TimeConsumed!
							: payload.player2TimeConsumed!,
				},
				opponentData: {
					timeConsumed:
						gameState.opponentData.playerNumber === "player1"
							? payload.player1TimeConsumed!
							: payload.player2TimeConsumed!,
					linesCompleted: payload.linesCompleted,
				},
			},
		});
	}

	function handleGameInvite(payload: Payload) {
		toast({
			description: (
				<div className="flex items-center space-x-4 mb-4">
					<Avatar>
						<AvatarImage
							src={payload.otherPlayer?.image}
							alt={payload.otherPlayer?.name}
						/>
						<AvatarFallback>{payload.otherPlayer?.name}</AvatarFallback>
					</Avatar>
					<div className="grid gap-1">
						<p className="font-medium">Bingo Invite</p>
						<p className="text-sm text-muted-foreground">
							{payload.otherPlayer?.name} has invited you to play Bingo!
						</p>
					</div>
				</div>
			),
			action: (
				<ToastAction
					altText="Accept game invite"
					onClick={() => {
						dispatch({ type: "GAME_RESULT_RESET" });
						resetGame();
						socketRef.current!.send(
							JSON.stringify({
								type: ACCEPT_GAME_INVITE,
								payload: { otherPlayer: payload.otherPlayer },
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

	if (!socketRef || !socketRef.current || gameState.card.length === 0) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="flex justify-center items-center gap-2 text-3xl font-bold">
					Loading <LoaderCircleIcon className="animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<div
			className={`bg-background flex flex-col md:flex-row justify-center items-center min-h-screen p-4 gap-4 w-full ${open && "md:flex-col lg:flex-row"}`}
		>
			{!gameState.isGameStarted ? (
				<GameSearchInterface
					friends={friends}
					session={session}
					gameState={gameState}
					userCoins={userCoins}
					dispatch={dispatch}
					socketRef={socketRef}
				/>
			) : (
				<GamePlayInterface
					gameState={gameState}
					isMobile={isMobile}
					dispatch={dispatch}
					socketRef={socketRef}
					session={session}
					resetGame={resetGame}
				/>
			)}
			<GameEndModal
				isOpen={gameState.gameResult.result !== ""}
				onClose={() => {
					dispatch({ type: "GAME_RESULT_RESET" });
				}}
				isWinner={
					gameState.gameResult?.result ===
					`${gameState.userData.playerNumber.toUpperCase()}_WINS`
				}
				by={gameState.gameResult.by}
				onPlayAgain={resetGame}
			/>
		</div>
	);
}
