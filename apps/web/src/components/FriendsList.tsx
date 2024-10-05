"use client";
import { Gamepad2, LoaderCircle, Users, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ToastAction } from "./ui/toast";

export const INIT_GAME = "init_game";
export const MOVE = "move";

export default function FriendsList({
	friends,
	session,
}: {
	friends: Friend[];
	session: Session;
}) {
	const router = useRouter();
	const [activeUserId, setActiveUserId] = useState<string>("");
	const [userFriends, setUserFriends] = useState<Friend[]>(friends);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);
	const { toast } = useToast();

	useEffect(() => {
		const newSocket = new WebSocket("ws://localhost:8080");
		newSocket.onopen = () => {
			console.log("Connection established");
		};
		newSocket.onmessage = (message) => {
			const messageJson = JSON.parse(message.data);
			if (messageJson.type == INIT_GAME) {
				router.push("/dashboard/game/123");
				setDisabled(false);
			}
		};
		setSocket(newSocket);
		return () => newSocket.close();
	}, []);

	async function handleGameSelect(whomToPlayWith: string) {
		setActiveUserId(whomToPlayWith);
		const userId = session?.user.id;
		const sortedIds = [userId, whomToPlayWith].sort();

		const gameId = `${sortedIds[0]}--${sortedIds[1]}`;
		socket?.send(
			JSON.stringify({
				type: INIT_GAME,
			}),
		);
	}

	async function handleRandomGameSelect() {
		setDisabled(true);
		socket?.send(
			JSON.stringify({
				type: INIT_GAME,
			}),
		);
	}

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));
		pusherClient.subscribe(toPusherKey(`game:${session.user.id}:games`));

		function friendsHandler(data: Friend) {
			setUserFriends((prevFriends) => [...prevFriends, data]);
		}

		function gameInviteHandler(data: any) {
			toast({
				title: "Game Invite",
				description: `Invite from ${data.senderName} `,
				action: (
					<ToastAction
						altText="Accept invite"
						className="py-6 px-8"
						onClick={async () => {
							await axios.post("/api/acceptGameInvite", {
								gameId: data.gameId,
							});
							router.push(`/game/${data.gameId}`);
						}}
					>
						Accept
					</ToastAction>
				),
				className: "bg-blue flex",
			});
		}

		pusherClient.bind("friends", friendsHandler);
		pusherClient.bind("game-invite", gameInviteHandler);
		pusherClient.bind("game-invite-accepted", (data: any) => {
			router.replace(`/game/${data.gameId}`);
		});

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${session?.user.id}:friends`));
			pusherClient.unsubscribe(toPusherKey(`game:${session.user.id}:games`));
			pusherClient.unbind("friends");
			pusherClient.unbind("game-invite");
			pusherClient.unbind("game-invite-accepted");
		};
	}, [session]);

	return (
		<div className="flex flex-col w-full justify-evenly items-center h-full pt-20">
			<div className="flex justify-center items-center w-full mt-20 mb-8 ">
				<Button
					className="px-16 py-8"
					onClick={handleRandomGameSelect}
					disabled={disabled}
					size={"lg"}
				>
					{!disabled ? (
						<div className="flex items-center justify-center gap-2">
							Join Random Game <Gamepad2 />
						</div>
					) : (
						<div className="flex gap-2">
							Waiting for another player{" "}
							<LoaderCircle className="animate-spin" />
						</div>
					)}
				</Button>
			</div>
			<div className="">
				<div className="flex items-center px-3 text-xs font-medium text-muted-foreground mb-2">
					<Users className="h-5 w-5 mr-2" />
					Friends
				</div>
				{userFriends.length === 0 ? (
					<p className="mx-2 p-2">No friends yet.</p>
				) : (
					<ScrollArea className="h-72 w-full ">
						<ul className="space-y-2 w-full">
							{userFriends.map((user) => (
								<li
									key={user.id}
									className={`flex flex-col justify-between items-center p-4 space-y-4 bg-card rounded-lg border `}
									// onClick={() => handleChatSelect(user.id!)}
								>
									<div className="flex justify-center items-center gap-2 w-full">
										<Avatar className="w-14 h-14">
											<AvatarImage src={user.image!} />
											<AvatarFallback>
												{user.name![0].toUpperCase()}
											</AvatarFallback>
										</Avatar>

										<div>
											<p className="text-2xl font-semibold leading-none tracking-tight">
												{user.name}
											</p>
											<p className="text-sm text-muted-foreground">
												{user.email}
											</p>
										</div>
									</div>
									<div className="flex flex-col space-x-4 w-full">
										<Button
											className="flex gap-2"
											size={"lg"}
											onClick={() => handleGameSelect(user.id!)}
											disabled={disabled}
										>
											<p>Start game </p>
											<Gamepad2 />
										</Button>
									</div>
								</li>
							))}
						</ul>
					</ScrollArea>
				)}
			</div>
		</div>
	);
}
