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
	let sessionToken = cookieStore.get("next-auth.session-token");
	if (!sessionToken)
		sessionToken = cookieStore.get("__Secure-next-auth.session-token");

	const allFriends = await prisma.friends.findMany({
		where: {
			friendOfId: session.user.id,
		},
		select: {
			friend: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			},
		},
	});

	const friends: Friend[] = allFriends.map(
		(request: { friend: Friend }) => request.friend,
	);

	return (
		<>
			<Navbar session={session!} withSideBar floating={false} />
			<GameInterface
				friends={friends}
				session={session}
				sessionToken={sessionToken ? sessionToken.value : undefined}
			/>
		</>
	);
}
