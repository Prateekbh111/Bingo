import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import ThemeSwitch from "./ThemeSwitch";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

export default async function Navbar({
	session,
	withSideBar = false,
	floating = true,
}: {
	session: Session;
	withSideBar?: boolean;
	floating?: boolean;
}) {
	return (
		<nav
			className={`md:fixed w-full ${floating && "top-2 md:top-6 mt-2 md:mt-0"} `}
		>
			<nav
				className={`z-50 flex items-center gap-2  rounded-2xl  ${floating && "border mx-2 md:mx-auto md:max-w-6xl md:shadow-lg"}`}
			>
				<div
					className={`flex w-full justify-between mx-auto backdrop-blur-3xl p-4 border-none${floating && "border-b border-primary/10 p-6 rounded-2xl"}`}
				>
					{withSideBar && (
						<div className="flex h-16 shrink-0 items-center gap-2 px-4">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Link
								href={"/"}
								className="text-3xl md:text-3xl font-bold tracking-tight text-foreground "
							>
								<span className="text-primary">B</span>
								ingo
							</Link>
						</div>
					)}
					{floating && (
						<Link
							href={"/"}
							className="text-3xl md:text-3xl font-bold tracking-tight text-foreground "
						>
							<span className="text-primary">B</span>
							ingo
						</Link>
					)}

					<div className="flex items-center gap-2 lg:gap-8 px-4">
						<ThemeSwitch />
						{!session && (
							<Link href={"/login"}>
								<Button className="px-8 text-base rounded-md">Login</Button>
							</Link>
						)}
					</div>
				</div>
			</nav>
		</nav>
	);
}
