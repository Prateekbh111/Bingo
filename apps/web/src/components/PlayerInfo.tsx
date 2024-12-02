"use client";

import { CARDFILL_TIME_MS, GAME_TIME_MS } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlayerData } from "@/types/types";

interface PlayerInfoProps {
	playerData?: PlayerData;
	isTurn?: boolean;
	isCurrentPlayer?: boolean;
}

export default function PlayerInfo({
	playerData,
	isTurn,
	isCurrentPlayer,
}: PlayerInfoProps) {
	const bingoLetters = ["B", "I", "N", "G", "O"];
	const getTimer = (timeConsumed: number, TotalTime: number) => {
		const timeLeftMs = TotalTime - timeConsumed;
		const minutes = Math.floor(timeLeftMs / (1000 * 60));
		const remainingSeconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
		const remainingMillis = Math.floor(
			((timeLeftMs % (1000 * 60)) % 1000) / 100,
		);
		return (
			<div
				className={`bg-secondary text-foreground p-2 rounded-md my-2 ${playerData?.isCardFilled ? (isTurn ? "animate-pulse duration-1000" : "") : "animate-pulse duration-1000"} ${minutes <= 0 && remainingSeconds <= 5 && "bg-red-500"}`}
			>
				{minutes < 10 ? "0" : ""}
				{minutes}:{remainingSeconds < 10 ? "0" : ""}
				{remainingSeconds}
				{minutes <= 0 && remainingSeconds <= 0 && `:${remainingMillis}`}
			</div>
		);
	};

	return (
		<div
			className={` flex md:flex-col items-center justify-center w-full max-w-sm md:max-w-xs  gap-2 p-4 border-2 bg-card ${isCurrentPlayer ? "rounded-b-md border-t-0 md:border-t-2" : "rounded-t-md border-b-0 md:border-b-2"} md:rounded-md  ${isTurn && isCurrentPlayer && " border-2 border-b-primary md:border-t-primary md:border-b-card"} ${isTurn && !isCurrentPlayer && "border-2 border-t-primary"}`}
		>
			<Avatar className="h-10 w-10">
				<AvatarImage
					src={playerData?.data ? playerData.data.image! : ""}
					alt={playerData?.data ? playerData.data.name! : "Opponent"}
				/>
				<AvatarFallback>
					{playerData?.data ? playerData!.data!.name.toUpperCase()[0] : "O"}
				</AvatarFallback>
			</Avatar>
			<div className="w-full flex md:flex-col md:text-center justify-between items-center">
				<div>
					<p className="font-semibold text-sm truncate">
						{playerData?.data ? playerData.data.name : "Opponent"}
					</p>
					<p className="text-xs font-medium">
						{playerData?.isCardFilled ? (
							<span className="text-green-500">Card Filled</span>
						) : (
							<span className="text-yellow-500">Filling Card...</span>
						)}
					</p>
				</div>
				{playerData?.isCardFilled
					? getTimer(playerData ? playerData.timeConsumed! : 0, GAME_TIME_MS)
					: getTimer(
							playerData ? playerData.gridFillTimeConsumed! : 0,
							CARDFILL_TIME_MS,
						)}
				<div className="flex justify-center items-center">
					{bingoLetters.map((letter, index) => (
						<div
							key={letter}
							className={`
									flex items-center justify-center text-2xl font-bold transition-all duration-300 ease-in-out
									${
										index < (playerData ? playerData.linesCompleted! : 0)
											? "text-secondary-foreground scale-110"
											: "text-primary-foreground scale-100"
									}
								`}
							aria-label={`Bingo letter ${letter} ${
								index < (playerData ? playerData.linesCompleted! : 0)
									? "completed"
									: "not completed"
							}`}
						>
							{letter}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
