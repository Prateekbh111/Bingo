import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const requestUserData: FriendRequest = await req.json();

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

		console.log(isAlreadyFriend);
		if (isAlreadyFriend) {
			return Response.json(
				{ success: false, message: "Already are friends" },
				{ status: 402 },
			);
		}

		console.log("helaosdfasdf");

		await pusherServer.trigger(
			toPusherKey(`user:${session.user.id}:friends`),
			"friends",
			requestUserData,
		);
		await pusherServer.trigger(
			toPusherKey(`user:${requestUserData.id}:friends`),
			"friends",
			{
				id: session.user.id,
				name: session.user.name,
				username: session.user.username,
				image: session.user.image,
			},
		);

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
