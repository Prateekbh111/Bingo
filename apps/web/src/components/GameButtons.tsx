import { EXIT, FILLRANDOM, PLAYAGAIN } from "@/lib/utils";
import DynamicButton from "./DynamicButton";
import { GameResult } from "@/types/types";

export default function GameButtons({
	isGameStarted,
	isGameEnded,
	isCardFilled,
	isMobile,
	gameResult,
	onFillRandomClick,
	onExitClick,
	onResetClick,
}: {
	isGameStarted: boolean;
	isGameEnded: boolean;
	isCardFilled: boolean;
	isMobile: boolean;
	gameResult: GameResult;
	onFillRandomClick: () => void;
	onExitClick: () => void;
	onResetClick: () => void;
}) {
	return (
		<>
			{isGameStarted && !isGameEnded && (
				<div
					className={`flex justify-around items-center w-full max-w-sm ${isMobile && "mt-4"}`}
				>
					{!isCardFilled && (
						<DynamicButton
							isMobile={isMobile}
							onClick={onFillRandomClick}
							buttonType={FILLRANDOM}
						/>
					)}

					<DynamicButton
						isMobile={isMobile}
						buttonType={EXIT}
						onClick={onExitClick}
					/>
				</div>
			)}
			{isGameEnded && gameResult.result == "" && (
				<DynamicButton
					isMobile={isMobile}
					onClick={onResetClick}
					buttonType={PLAYAGAIN}
				/>
			)}
		</>
	);
}
