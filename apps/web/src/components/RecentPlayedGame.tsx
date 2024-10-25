import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, X } from "lucide-react";
import { GameResult, GameStatus } from "@prisma/client";
import { Session } from "next-auth";

interface PlayedGames {
	result: GameResult | null;
	id: string;
	status: GameStatus | null;
	startAt: Date | null;
	endAt: Date | null;
	player1: {
		id: string;
		name: string | null;
		username: string | null;
		image: string | null;
	};
	player2: {
		id: string;
		name: string | null;
		username: string | null;
		image: string | null;
	};
}

export default function RecentlyPlayedGames({
	playedGames,
	session,
}: {
	playedGames: PlayedGames[];
	session: Session;
}) {
	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "2-digit",
			month: "2-digit",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleString(undefined, options);
	};

	return (
		<div className=" md:pt-24 bg-background flex items-center justify-center p-4 w-full">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle>Recently Played Games</CardTitle>
					<CardDescription>Your latest Bingo matches</CardDescription>
				</CardHeader>
				<CardContent>
					{playedGames.length > 0 && (
						<ScrollArea className="h-[300px] pr-4">
							{playedGames.map((game) => (
								<div key={game.id} className="flex items-center space-x-4 mb-4">
									<Avatar>
										<AvatarImage
											src={
												game.player1.id === session.user.id
													? game.player2.image!
													: game.player1.image!
											}
											alt={
												game.player1.id === session.user.id
													? game.player2.name!
													: game.player1.name!
											}
										/>
										<AvatarFallback>
											{game.player1.id === session.user.id
												? game.player2.name![0]
												: game.player1.name![0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											{game.player1.id === session.user.id
												? game.player2.username!
												: game.player1.username!}
										</p>
										<p className="text-sm text-muted-foreground">
											{formatDate(game.startAt!.toString())}
										</p>
									</div>
									<Badge
										variant={
											game.result === "PLAYER1_WINS" &&
											game.player1.id === session.user.id
												? "default"
												: game.result === "PLAYER2_WINS" &&
													  game.player2.id === session.user.id
													? "default"
													: "secondary"
										}
										className="flex items-center space-x-1"
									>
										{(game.result === "PLAYER1_WINS" &&
											game.player1.id === session.user.id) ||
										(game.result === "PLAYER2_WINS" &&
											game.player2.id === session.user.id) ? (
											<>
												<Trophy className="w-3 h-3" />
												<span>Won</span>
											</>
										) : (
											<>
												<X className="w-3 h-3" />
												<span>Lost</span>
											</>
										)}
									</Badge>
								</div>
							))}
						</ScrollArea>
					)}
					{playedGames.length === 0 && (
						<div className="flex justify-center items-center h-[300px] pr-4">
							<p>No played games yet</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
