import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
	const { friendUsername }: { friendUsername: string } = await req.json();
	const session = await getServerSession(authOptions);

	if (!session) {
		return Response.json(
			{ success: false, message: "Not Authorized" },
			{ status: 401 },
		);
	}

	//TODO: delete this three line
	const currUsername = session.user.username;
	console.log("user Email: ", currUsername);
	console.log("friend Email", friendUsername);

	console.log("userId: ", session.user.id);

	if (currUsername === friendUsername) {
		return Response.json(
			{ success: false, message: "Can't send request to yourself." },
			{ status: 400 },
		);
	}
	const userToAdd = await prisma.user.findFirst({
		where: {
			username: friendUsername,
		},
		select: {
			id: true,
		},
	});

	console.log(userToAdd);

	const idToAdd = userToAdd?.id;

	console.log("idToAdd: ", idToAdd);
	if (!idToAdd) {
		return Response.json(
			{ success: false, message: "User with this username does not exits." },
			{ status: 400 },
		);
	}

	const isAlreadyFriendRequested = await prisma.friendRequest.findFirst({
		where: {
			senderId: session.user.id,
			receiverId: idToAdd,
		},
	});

	console.log("isAlreadyFriendRequested: ", isAlreadyFriendRequested);
	if (isAlreadyFriendRequested) {
		return Response.json(
			{ success: false, message: "Already Requested." },
			{ status: 400 },
		);
	}

	const isAlreadyFriend = await prisma.friends.findFirst({
		where: {
			friendOfId: session.user.id,
			friendId: idToAdd,
		},
	});

	console.log("isAlreadyFriend: ", isAlreadyFriend);
	if (isAlreadyFriend) {
		return Response.json(
			{ success: false, message: "Already Friends." },
			{ status: 400 },
		);
	}

	//send friend request
	await pusherServer.trigger(
		toPusherKey(`user:${idToAdd}:friendRequests`),
		"friendRequests",
		{
			id: session.user.id,
			name: session.user.name,
			username: session.user.username,
			image: session.user.image,
		},
	);

	await prisma.friendRequest.create({
		data: {
			senderId: session.user.id,
			receiverId: idToAdd,
		},
	});

	return Response.json(
		{
			success: true,
			message: "Friend request sent.",
		},
		{
			status: 200,
		},
	);
}
