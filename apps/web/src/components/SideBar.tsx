import { Session } from "next-auth";
import prisma from "@/lib/prisma";
import AddFriend from "./AddFriend";
import PendingRequests from "./PendingRequests";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { UserDropdownMenu } from "./UserDropdownMenu";

export default async function AppSidebar({ session }: { session: Session }) {
	const allFriendRequests = await prisma.friendRequest.findMany({
		where: {
			receiverId: session.user.id,
		},
		select: {
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
				id: string | null;
				name: string | null;
				username: string | null;
				image: string | null;
			};
		}) => request.sender,
	);
	return (
		<Sidebar>
			<SidebarContent>
				{/* <SidebarGroup>
					<SidebarGroupLabel>Add Friend</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<AddFriend />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup> */}
				<SidebarGroup>
					<SidebarGroupLabel>Pending Friend Requests</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<PendingRequests
									friendRequests={friendRequests}
									session={session!}
								/>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<AddFriend />
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					<SidebarMenuItem>
						<UserDropdownMenu session={session} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			{/* // <Sheet>
				// 	<SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
				// 		<Menu />
				// 		<span className="sr-only">Menu</span>
				// 	</SheetTrigger>
				// 	<SheetContent side={"left"} className="w-64 h-full">
				// 		<SheetTitle></SheetTitle>
				// 	</SheetContent>
				// </Sheet> */}
		</Sidebar>
	);
}
