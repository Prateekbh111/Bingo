"use client";
import { Clock2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Session } from "next-auth";
import { ScrollArea } from "./ui/scroll-area";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { RequestCard } from "./RequestCard";

export default function PendingRequests({
	friendRequests,
	session,
}: {
	friendRequests: FriendRequest[];
	session: Session;
}) {
	const [UserFriendRequests, setUserFriendRequests] =
		useState<FriendRequest[]>(friendRequests);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${session.user.id}:friendRequests`)
		);

		const friendRequestHandler = (data: FriendRequest) => {
			console.log("new friend request");
			console.log(data);
			setUserFriendRequests((prevFriendRequest) => [
				...prevFriendRequest,
				data,
			]);
		};
		pusherClient.bind("friendRequests", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${session?.user.id}:friendRequests`)
			);

			pusherClient.unbind("friendRequests");
		};
	}, []);

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<div className="flex justify-between items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
					<div className="flex">
						<Clock2 className="h-5 w-5 mr-2" />
						Pending Requests
					</div>
					{UserFriendRequests.length !== 0 && (
						<span className="ml-2 relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-foreground"></span>
						</span>
					)}
				</div>
			</DrawerTrigger>
			<DrawerContent className="dark:bg-black">
				<DrawerTitle></DrawerTitle>
				<div className="mx-auto w-full flex justify-center p-4">
					{UserFriendRequests.length === 0 ? (
						<p>No friend requests</p>
					) : (
						<ScrollArea className="h-72 max-w-xl w-full ">
							<ul className="w-full  flex flex-col space-y-1.5 p-6">
								{UserFriendRequests.map((friendRequest) => (
									<RequestCard
										friendRequest={friendRequest}
										setUserFriendRequests={setUserFriendRequests}
										key={friendRequest.id}
									/>
								))}
							</ul>
						</ScrollArea>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
