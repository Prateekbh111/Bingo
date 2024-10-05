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
import { Trophy } from "lucide-react";

interface WinnerModalProps {
	isOpen: boolean;
	onClose: () => void;
	winner: string;
	onPlayAgain: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
	isOpen,
	onClose,
	winner,
	onPlayAgain,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center flex items-center justify-center">
						<Trophy className="w-8 h-8 text-yellow-400 mr-2" />
						Bingo Winner!
					</DialogTitle>
					<DialogDescription className="text-center text-lg">
						Congratulations, {winner}!
					</DialogDescription>
				</DialogHeader>
				<div className="my-4">
					<p className="text-center">
						You've completed a Bingo! Great job on your strategy and luck.
					</p>
				</div>
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

export default WinnerModal;
