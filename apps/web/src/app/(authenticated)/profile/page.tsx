import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Navbar from "@/components/Navbar";
import ProfileUpdateCard from "@/components/ProfileUpdateCard";
import RecentlyPlayedGames from "@/components/RecentPlayedGame";
import AuthProvider from "@/context/authProvider";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function Profile() {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	const playedGames = await prisma.game.findMany({
		where: {
			OR: [{ player1Id: session.user.id }, { player2Id: session.user.id }],
		},
		select: {
			player1: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			},
			player2: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			},
			status: true,
			id: true,
			result: true,
			startAt: true,
			endAt: true,
		},
		orderBy: {
			endAt: "desc",
		},
	});

	return (
		<AuthProvider session={session}>
			<Navbar session={session!} withSideBar floating={false} />
			<div className="min-h-screen flex flex-col lg:flex-row items-center justify-center">
				<ProfileUpdateCard session={session} />
				<RecentlyPlayedGames session={session} playedGames={playedGames} />
			</div>
		</AuthProvider>
	);
}
