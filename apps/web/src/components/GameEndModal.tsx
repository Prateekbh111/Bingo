import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Frown, Trophy } from "lucide-react";

interface GameEndModalProps {
	isOpen: boolean;
	onClose: () => void;
	isWinner: boolean;
	by: string;
	onPlayAgain: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
	isOpen,
	onClose,
	isWinner,
	by,
	onPlayAgain,
}) => {
	let byString;
	if (by === "TIME_UP") {
		byString = "timeout";
	} else if (by === "BINGO") {
		byString = "Bingo";
	} else if (by === "PLAYER_EXIT") {
		byString = "Player Exit";
	}
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center flex items-center justify-center">
						{isWinner ? (
							<>
								<Trophy className="w-8 h-8 text-yellow-400 mr-2" />
								Bingo Champion!
							</>
						) : (
							<>
								<Frown className="w-8 h-8 text-blue-500 mr-2" />
								Better Luck Next Time!
							</>
						)}
					</DialogTitle>
					<DialogDescription className="text-center text-lg">
						{isWinner
							? "Congratulations on your victory!"
							: "Don't give up, you'll get them next time!"}
					</DialogDescription>

					<p className="text-center tracking-tighter opacity-70">
						by {byString}
					</p>
				</DialogHeader>
				<DialogFooter className="flex justify-center gap-3 ">
					<Button onClick={onPlayAgain}>Play Again</Button>
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default GameEndModal;
