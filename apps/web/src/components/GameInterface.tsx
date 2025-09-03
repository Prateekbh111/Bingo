"use client";

import { LoaderCircleIcon } from "lucide-react";
import GameEndModal from "./GameEndModal";
import { useSidebar } from "./ui/sidebar";
import GameSearchInterface from "./GameSearchInterface";
import GamePlayInterface from "./GamePlayInterface";
import { useWebSocket } from "@/context/WebSocketProvider";

export default function GameInterface() {
	const { open, isMobile } = useSidebar();
	const {
		socket: socketRef,
		gameState,
		dispatch,
		resetGame,
	} = useWebSocket();

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
				<GameSearchInterface />
			) : (
				<GamePlayInterface
					isMobile={isMobile}
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