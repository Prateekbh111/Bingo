import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Session } from "next-auth";
import prisma from "@/lib/prisma";
import AddFriend from "./AddFriend";
import PendingRequests from "./PendingRequests";

export default async function Sidebar({ session }: { session: Session }) {
	const allFriendRequests = await prisma.friendRequest.findMany({
		where: {
			receiverId: session.user.id,
		},
		select: {
			sender: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
	});
	const friendRequests: FriendRequest[] = allFriendRequests.map(
		(request) => request.sender,
	);

	return (
		<Sheet>
			<SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
				<Menu />
				<span className="sr-only">Menu</span>
			</SheetTrigger>
			<SheetContent side={"left"} className="w-64 h-full">
				<SheetTitle></SheetTitle>
				<div className="bg-background border-r p-6 flex flex-col justify-between h-full w-full">
					<div>
						<div className="flex items-center gap-3 mb-6">
							<Avatar className="w-10 h-10">
								<AvatarImage src={session?.user.image ?? ""} />
								<AvatarFallback>
									{session?.user.name ? session.user.name[0] : "?"}
								</AvatarFallback>{" "}
							</Avatar>
							<div>
								<div className="font-medium">
									{session?.user.name ?? "Unknown User"}
								</div>
								<div className="text-sm text-muted-foreground">Online</div>
							</div>
						</div>
						<nav className="space-y-2">
							<AddFriend />
							<PendingRequests
								friendRequests={friendRequests}
								session={session!}
							/>
						</nav>
					</div>
					<div className="flex items-center gap-2"></div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
