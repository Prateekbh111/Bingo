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
import { Frown } from "lucide-react";

interface LoserModalProps {
	isOpen: boolean;
	onClose: () => void;
	winner: string;
	onPlayAgain: () => void;
}

const LoserModal: React.FC<LoserModalProps> = ({
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
						<Frown className="w-8 h-8 text-red-500 mr-2" />
						Better Luck Next Time!
					</DialogTitle>
					<DialogDescription className="text-center text-lg">
						{winner} won this round.
					</DialogDescription>
				</DialogHeader>
				<div className="my-4">
					<p className="text-center">
						Don&apos;t give up! Every game is a new opportunity to win.
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

export default LoserModal;
