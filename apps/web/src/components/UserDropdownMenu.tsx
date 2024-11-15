"use client";
import {
	ChevronsUpDown,
	Handshake,
	LogOut,
	SquareUserRound,
	SunMoon,
	TicketX,
	User,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function UserDropdownMenu({ session }: { session: Session }) {
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const { setOpen, setOpenMobile } = useSidebar();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={session.user.image!} alt={session.user.name!} />
						<AvatarFallback className="rounded-lg">
							{session.user.name![0]}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{session.user.name!}</span>
						<span className="truncate text-xs">{session.user.email!}</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background"
				side="bottom"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={session.user.image!} alt={session.user.name!} />
							<AvatarFallback className="rounded-lg">
								{session.user.name![0]}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">
								{session.user.name!}
							</span>
							<span className="truncate text-xs">{session.user.email!}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => {
							setOpen(false);
							setOpenMobile(false);
							router.push("/profile");
						}}
					>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<SunMoon className="mr-2 h-4 w-4" />
							<span>Theme</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuCheckboxItem
								checked={theme === "system"}
								onCheckedChange={() => setTheme("system")}
							>
								System
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={theme === "light"}
								onCheckedChange={() => setTheme("light")}
							>
								Light
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={theme === "dark"}
								onCheckedChange={() => setTheme("dark")}
							>
								Dark
							</DropdownMenuCheckboxItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
