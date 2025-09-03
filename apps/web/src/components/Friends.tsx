"use client";
import { Users } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useWebSocket } from "@/context/WebSocketProvider";

export default function Friends({
	disabled,
	handlePlayWithFriend,
}: {
	disabled: boolean;
	handlePlayWithFriend: (id: string) => void;
}) {
	const { userFriends } = useWebSocket();
	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold flex items-center gap-2">
				<Users className="h-5 w-5" />
				Friends
			</h2>
			{userFriends.length === 0 ? (
				<p className="text-muted-foreground">No friends yet.</p>
			) : (
				<ScrollArea>
					<div className="space-y-4">
						{userFriends.map((user) => (
							<Card key={user.id} className="p-4">
								<div className="flex items-center gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage src={user.image || ""} alt={user.name!} />
										<AvatarFallback>
											{user.name![0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<h3 className="font-semibold">{user.name}</h3>
										<p>{user.username}</p>
									</div>
									<Button
										disabled={disabled}
										size="sm"
										onClick={() => handlePlayWithFriend(user.id!)}
									>
										Play
									</Button>
								</div>
							</Card>
						))}
					</div>
				</ScrollArea>
			)}
		</div>
	);
}
