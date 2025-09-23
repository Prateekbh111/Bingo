import { EXIT, FILLRANDOM, PLAYAGAIN } from "@/lib/utils";
import DynamicButton from "./DynamicButton";
import { GameResult } from "@/types/types";
import { useAudio } from "@/context/AudioProvider";

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
	const { playSoundEffect } = useAudio();

	const handleFillRandomClick = () => {
		playSoundEffect('click');
		onFillRandomClick();
	};

	const handleExitClick = () => {
		playSoundEffect('click');
		onExitClick();
	};

	const handleResetClick = () => {
		playSoundEffect('click');
		onResetClick();
	};
	return (
		<>
			{isGameStarted && !isGameEnded && (
				<div
					className={`flex justify-around items-center w-full max-w-sm ${isMobile && "mt-4"}`}
				>
					{!isCardFilled && (
						<DynamicButton
							isMobile={isMobile}
							onClick={handleFillRandomClick}
							buttonType={FILLRANDOM}
						/>
					)}

					<DynamicButton
						isMobile={isMobile}
						buttonType={EXIT}
						onClick={handleExitClick}
					/>
				</div>
			)}
			{isGameEnded && gameResult.result == "" && (
				<DynamicButton
					isMobile={isMobile}
					onClick={handleResetClick}
					buttonType={PLAYAGAIN}
				/>
			)}
		</>
	);
}
