import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const requestUserData: { username: string; image: string } = await req.json();

	if (!session) {
		return Response.json(
			{ success: false, message: "UNAUTHORIZED" },
			{ status: 402 },
		);
	}

	try {
		await prisma.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				username: requestUserData.username,
				image: requestUserData.image,
			},
		});

		return Response.json({ success: true }, { status: 200 });
	} catch (error) {
		console.log(error);
	}
}
