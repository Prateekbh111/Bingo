import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import FriendsList from "@/components/FriendsList";
import GameInterface from "@/components/GameInterface";
import HeroSection from "@/components/HeroSection";
import HowToPlay from "@/components/HowToPlay";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession, Session } from "next-auth";
import { getSession } from "next-auth/react";
import { notFound } from "next/navigation";

export default async function HomePage() {
	const session = await getServerSession(authOptions);
	if (!session) notFound();
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

	const friends: Friend[] = allFriends.map((request) => request.friend);

	return (
		<div className="w-full">
			<Navbar session={session!} withSideBar />
			<GameInterface friends={friends} session={session} />
		</div>
	);
}
