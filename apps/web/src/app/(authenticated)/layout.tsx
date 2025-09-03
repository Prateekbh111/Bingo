import AppSidebar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import LoginPage from "../(not-authenticated)/login/page";
import { WebSocketProvider } from "@/context/WebSocketProvider";
import { cookies } from "next/headers";

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (!session) {
		notFound();
	}

	const user = await prisma.user.findFirst({ where: { id: session.user.id } });
	if (!user) {
		return <LoginPage />;
	}

	// Get session token from cookies
	const cookieStore = cookies();
	let sessionToken = cookieStore.get("next-auth.session-token");
	if (!sessionToken) {
		sessionToken = cookieStore.get("__Secure-next-auth.session-token");
	}

	// Fetch friend requests and friends
	const allFriendRequests = await prisma.friendRequest.findMany({
		where: {
			receiverId: session.user.id,
		},
		select: {
			id: false,
			sender: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			},
		},
	});

	const friendRequests: FriendRequest[] = allFriendRequests.map(
		(request: {
			sender: {
				name: string | null;
				id: string;
				username: string | null;
				image: string | null;
			};
		}) => ({
			...request.sender,
		})
	);

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
		<WebSocketProvider
			sessionToken={sessionToken ? sessionToken.value : undefined}
			session={session}
			initialFriendRequests={friendRequests}
			initialFriends={friends}
		>
			<SidebarProvider defaultOpen={false}>
				<AppSidebar session={session!} />
				<main className="w-full">{children}</main>
			</SidebarProvider>
		</WebSocketProvider>
	);
}
