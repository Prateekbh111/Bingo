import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import GameInterface from "@/components/GameInterface";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
	const session = await getServerSession(authOptions);
	if (!session) notFound();
	const cookieStore = cookies();
	const sessionToken = cookieStore.get("next-auth.session-token");
	console.log(sessionToken);
	console.log(session?.user.id);

	const allFriends = await prisma.friends.findMany({
		where: {
			friendOfId: session.user.id,
		},
		select: {
			friend: {
				select: {
					id: true,
					name: true,
					image: true,
					email: true,
				},
			},
		},
	});

	const friends: Friend[] = allFriends.map(
		(request: { friend: Friend }) => request.friend,
	);

	return (
		<div className="w-full">
			<Navbar session={session!} withSideBar />
			<GameInterface
				friends={friends}
				session={session}
				sessionToken={sessionToken?.value!}
			/>
		</div>
	);
}
