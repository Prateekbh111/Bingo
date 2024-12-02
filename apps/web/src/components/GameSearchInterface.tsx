import React, { useEffect } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogDescription,
} from "@/components/ui/dialog";
import { Trophy, Gamepad2, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Friends from "./Friends";
import {
	INIT_GAME,
	INIT_GAME_COINS,
	CANCEL_INIT_GAME,
	GAME_ENDED,
	RECONNECT,
} from "@/lib/utils";
import { GameAction, GameState } from "@/types/types";

interface GameSearchInterfaceProps {
	friends: Friend[];
	session: Session;
	gameState: GameState;
	userCoins: number;
	dispatch: React.Dispatch<GameAction>;
	socketRef: React.MutableRefObject<WebSocket | null>;
}

export default function GameSearchInterface({
	friends,
	session,
	gameState,
	userCoins,
	dispatch,
	socketRef,
}: GameSearchInterfaceProps) {
	const { toast } = useToast();

	useEffect(() => {
		if (gameState.pendingGame !== null) {
			socketRef.current?.send(JSON.stringify({ type: CANCEL_INIT_GAME }));
		}
	}, [gameState.pendingGame]);

	function handleRandomGameSelect() {
		dispatch({ type: "START_SEARCH_NORMAL" });
		socketRef.current?.send(JSON.stringify({ type: INIT_GAME }));
	}

	function handleCoinsGameSelect() {
		if (userCoins < 2) {
			toast({ title: "Not sufficient Trophies!!!" });
			return;
		}
		dispatch({ type: "START_SEARCH_COINS" });
		socketRef.current?.send(JSON.stringify({ type: INIT_GAME_COINS }));
	}

	function handlePlayWithFriend(friendId: string) {
		socketRef.current?.send(
			JSON.stringify({ type: "SEND_GAME_INVITE", payload: { friendId } }),
		);
	}

	function cancelGameSearch() {
		dispatch({ type: "CANCEL_SEARCH" });
		socketRef.current?.send(JSON.stringify({ type: CANCEL_INIT_GAME }));
	}

	function handleDeleteGame() {
		socketRef.current?.send(
			JSON.stringify({
				type: GAME_ENDED,
				payload: {
					result:
						gameState.pendingGame!.playerNumber === "player1"
							? "PLAYER2_WINS"
							: "PLAYER1_WINS",
					by: "PLAYER_EXIT",
				},
			}),
		);
		dispatch({ type: "SET_PENDING_GAME", payload: null });
		dispatch({ type: "START_SEARCH_NORMAL" });
		socketRef.current?.send(JSON.stringify({ type: INIT_GAME }));
	}

	function handleJoinGame() {
		console.log("Joining Game");
		socketRef.current?.send(
			JSON.stringify({
				type: RECONNECT,
			}),
		);
	}

	return (
		<div className="md:pt-24 flex justify-center items-center h-full w-full">
			<div className="max-w-sm w-full">
				<div className="space-y-8">
					<Dialog open={gameState.isSearchingGame}>
						<DialogTrigger className="w-full" asChild>
							<Button
								className="w-full py-8 text-lg"
								onClick={handleRandomGameSelect}
								disabled={
									gameState.normalGameDisable || gameState.coinsGameDisable
								}
								size="lg"
							>
								{!gameState.normalGameDisable ? (
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
						<DialogContent className="max-w-sm" aria-describedby="">
							<DialogHeader>
								{gameState.pendingGame != null ? (
									<DialogTitle>Game Pending</DialogTitle>
								) : (
									<DialogTitle>Searching Game</DialogTitle>
								)}
							</DialogHeader>
							{gameState.pendingGame != null ? (
								<DialogDescription>
									You have a pending game. Would you like to join it?
								</DialogDescription>
							) : (
								<span className="flex items-center gap-2">
									Waiting for another player{" "}
									<LoaderCircle className="h-5 w-5 animate-spin" />
								</span>
							)}

							<DialogFooter className="justify-end md:w-full">
								<DialogClose asChild>
									{gameState.pendingGame != null ? (
										<div className="flex justify-center gap-3 ">
											<Button
												size={"sm"}
												type="button"
												variant={"destructive"}
												onClick={handleDeleteGame}
											>
												Delete Game
											</Button>
											<Button onClick={handleJoinGame} size={"sm"}>
												Join Game
											</Button>
										</div>
									) : (
										<Button
											size={"sm"}
											type="button"
											variant={"destructive"}
											onClick={cancelGameSearch}
										>
											Cancel
										</Button>
									)}
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<div className="space-y-2">
						<Dialog open={gameState.isSearchingCoinGame}>
							<DialogTrigger className="w-full" asChild>
								<Button
									className="w-full py-8 text-lg"
									onClick={handleCoinsGameSelect}
									disabled={
										gameState.normalGameDisable || gameState.coinsGameDisable
									}
									size="lg"
								>
									{!gameState.coinsGameDisable ? (
										<span className="flex items-center gap-2">
											Play with Trophies <Trophy className="h-5 w-5" />
										</span>
									) : (
										<span className="flex items-center gap-2">
											Waiting for another open coin match{" "}
											<LoaderCircle className="h-5 w-5 animate-spin" />
										</span>
									)}
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]" aria-describedby="">
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
							Current Trophies: <Trophy className="ml-2 h-4 w-4" />
							{userCoins}
						</div>
					</div>
					<Friends
						friends={friends}
						disabled={gameState.normalGameDisable || gameState.coinsGameDisable}
						handlePlayWithFriend={handlePlayWithFriend}
						session={session}
					/>
				</div>
			</div>
		</div>
	);
}
