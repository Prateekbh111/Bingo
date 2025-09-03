"use client";
import { ScrollArea } from "./ui/scroll-area";
import { RequestCard } from "./RequestCard";
import { useWebSocket } from "@/context/WebSocketProvider";

export default function PendingRequests({
}: {
	}) {
	const { userFriendRequests, dispatchFriendRequests } = useWebSocket();
	return (
		<div className="mx-auto w-full flex justify-center">
			{userFriendRequests.length === 0 ? (
				<p className="text-muted-foreground">Nothing to see here</p>
			) : (
				<ScrollArea className="h-48 md:h-56 max-w-xl w-full ">
					<ul className="w-full  flex flex-col space-y-1.5">
						{userFriendRequests.map((friendRequest) => (
							<RequestCard
								friendRequest={friendRequest}
								dispatchFriendRequest={dispatchFriendRequests}
								key={friendRequest.id}
							/>
						))}
					</ul>
				</ScrollArea>
			)}
		</div>
	);
}
