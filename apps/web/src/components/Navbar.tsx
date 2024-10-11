import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import ThemeSwitch from "./ThemeSwitch";
import Sidebar from "./SideBar";

export default function Navbar({
	session,
	withSideBar = false,
}: {
	session: Session;
	withSideBar?: boolean;
}) {
	return (
		<nav className="md:fixed mt-2 md:mt-0 w-full top-2 md:top-6 ">
			<nav className="z-50 flex items-center gap-2 mx-2 md:mx-auto md:max-w-6xl border rounded-2xl md:shadow-lg">
				<div className="flex w-full justify-between mx-auto backdrop-blur-3xl border border-primary/10 p-6 rounded-2xl">
					{withSideBar && <Sidebar session={session!} />}
					<Link
						href={"/"}
						className="text-3xl md:text-3xl font-bold tracking-tight text-foreground "
					>
						<span className="text-primary">B</span>
						ingo
					</Link>
					<div className="flex items-center gap-2 lg:gap-8">
						<ThemeSwitch />
						{!withSideBar &&
							(session ? (
								<Avatar>
									<AvatarImage
										src={session.user.image!}
										alt={session.user.name!}
									/>
									<AvatarFallback>{session.user.name![0]}</AvatarFallback>
								</Avatar>
							) : (
								<Link href={"/login"}>
									<Button className="px-8 text-base rounded-md">Login</Button>
								</Link>
							))}
					</div>
				</div>
			</nav>
		</nav>
	);
}
