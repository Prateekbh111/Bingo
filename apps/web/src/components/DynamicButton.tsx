import { EXIT, FILLRANDOM, PLAYAGAIN } from "@/lib/utils";
import { Button } from "./ui/button";

export default function DynamicButton({
	isMobile = false,
	buttonType,
	onClick,
}: {
	isMobile?: boolean;
	onClick: () => void;
	buttonType: string;
}) {
	let buttonString: string = "";
	if (buttonType === FILLRANDOM) {
		buttonString = "Fill Random";
	} else if (buttonType === PLAYAGAIN) {
		buttonString = "Play Again";
	} else if (buttonType === EXIT) {
		buttonString = "Exit";
	}

	return (
		<Button
			className={`hidden md:block opacity-0 md:opacity-100 ${isMobile && "block md:hidden opacity-100 md:opacity-0"}`}
			variant={buttonType === EXIT ? "destructive" : "default"}
			onClick={onClick}
			size={"lg"}
		>
			{buttonString}
		</Button>
	);
}
