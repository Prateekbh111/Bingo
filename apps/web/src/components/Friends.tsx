"use client";
import { Users } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";
import { toPusherKey } from "@/lib/utils";
import { Session } from "next-auth";

export default function Friends({
	friends,
	disabled,
	handlePlayWithFriend,
	session,
}: {
	friends: Friend[];
	disabled: boolean;
	handlePlayWithFriend: (id: string) => void;
	session: Session;
}) {
	const [userFriends, setUserFriends] = useState<Friend[]>(friends);

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));

		const friendsHandler = (data: Friend) => {
			setUserFriends((prevFriends) => [...prevFriends, data]);
		};

		pusherClient.bind("friends", friendsHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${session?.user.id}:friends`));

			pusherClient.unbind("friends");
		};
	}, [session]);

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
										<AvatarImage src={user.image!} />
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
