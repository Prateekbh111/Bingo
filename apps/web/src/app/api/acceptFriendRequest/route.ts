import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { FRIEND_REQUEST_ACCEPTED, getTokenFromReq } from "@/lib/utils";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const requestUserData: FriendRequest = await req.json();
	const token = getTokenFromReq(req);
	const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}:8080/token=${token}`);

	if (!session) {
		return Response.json(
			{ success: false, message: "UNAUTHORIZED" },
			{ status: 402 },
		);
	}

	try {
		const hasFriendRequest = await prisma.friendRequest.findFirst({
			where: {
				receiverId: session.user.id!,
				senderId: requestUserData.id!,
			},
		});

		if (!hasFriendRequest) {
			return Response.json(
				{ success: false, message: "You don't have friend request" },
				{ status: 402 },
			);
		}

		const isAlreadyFriend = await prisma.friends.findFirst({
			where: {
				friendOfId: session.user.id!,
				friendId: requestUserData.id!,
			},
		});
		if (isAlreadyFriend) {
			return Response.json(
				{ success: false, message: "Already are friends" },
				{ status: 402 },
			);
		}


		ws.send(JSON.stringify({
			type: FRIEND_REQUEST_ACCEPTED,
			payload: {
				friendId: requestUserData.id,
				id: session.user.id,
				name: session.user.name,
				username: session.user.username,
				image: session.user.image,
			}
		}));
		ws.send(JSON.stringify({
			type: FRIEND_REQUEST_ACCEPTED,
			payload: {
				friendId: session.user.id,
				id: requestUserData.id,
				name: requestUserData.name,
				username: requestUserData.username,
				image: requestUserData.image,
			}
		}));

		await prisma.friends.create({
			data: {
				friendId: session.user.id!,
				friendOfId: requestUserData.id!,
			},
		});

		await prisma.friends.create({
			data: {
				friendId: requestUserData.id!,
				friendOfId: session.user.id!,
			},
		});

		await prisma.friendRequest.delete({
			where: {
				id: hasFriendRequest?.id,
			},
		});

		return Response.json(
			{ success: true, message: "Friend Request Accepted" },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
	}
}
