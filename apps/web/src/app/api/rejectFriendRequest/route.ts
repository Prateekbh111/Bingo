import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(req: Request, res: Response) {
	const session = await getServerSession(authOptions);
	const requestUserData: FriendRequest = await req.json();

	if (!session?.user) {
		return Response.json(
			{ success: false, message: "UNAUTHORIZED" },
			{ status: 402 }
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
				{ status: 402 }
			);
		}

		await prisma.friendRequest.delete({
			where: {
				id: hasFriendRequest?.id,
			},
		});

		return Response.json(
			{ success: true, message: "Friend Request Denied" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{ success: true, message: "Friend Request Denied" },
			{ status: 200 }
		);
	}
}
