import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import Link from "next/link";

export default function HowToPlay({ session }: { session: Session }) {
	return (
		<>
			<section className="mb-16 mx-4">
				<h2 className="text-3xl font-bold text-center text-primary mb-8">
					How to Play
				</h2>
				<div className="bg-card rounded-lg shadow-lg p-6">
					<ol className="list-decimal list-inside space-y-4 text-foreground">
						<li>Get your unique Bingo card with random numbers</li>
						<li>Listen for the caller to announce numbers</li>
						<li>Mark off the numbers on your card as they&apos;re called</li>
						<li>
							Shout &quot;BINGO!&quot; when you complete a winning pattern
						</li>
						<li>Verify your win and collect your prize!</li>
					</ol>
				</div>
			</section>

			<section className="text-center mx-4">
				<h2 className="text-3xl font-bold text-primary mb-4">Ready to Play?</h2>
				<p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
					Jump into a game now and experience the BingoBlitz excitement!
				</p>
				<Button asChild size="lg">
					<Link href={`${session ? "/dashboard" : "/login"}`}>
						Start a New Game
					</Link>
				</Button>
			</section>
		</>
	);
}
