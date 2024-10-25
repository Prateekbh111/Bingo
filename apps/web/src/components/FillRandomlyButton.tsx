import { Button } from "./ui/button";

export default function FillRandomlyButton({
	isMobile = false,
	setCard,
	setNextNumber,
}: {
	isMobile?: boolean;
	setCard: (card: BingoCell[][]) => void;
	setNextNumber: (num: number) => void;
}) {
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

	return (
		<Button
			className={`hidden md:block opacity-0 md:opacity-100 ${isMobile && "block md:hidden opacity-100 md:opacity-0"}`}
			onClick={() => setCard(generateRandomBingoGrid())}
		>
			Fill randomly
		</Button>
	);
}
