import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return Response.json(
			{ success: false, message: "UNAUTHORIZED" },
			{ status: 402 },
		);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
		});

		return Response.json(
			{
				success: true,
				message: "balance fetched succesfully",
				payload: user?.coins,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{ success: true, message: "something went wrong" },
			{ status: 200 },
		);
	}
}
