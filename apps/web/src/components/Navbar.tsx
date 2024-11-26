import Link from "next/link";
import { Session } from "next-auth";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import BingoLogo from "./BingoLogo";
import LoginButton from "./LoginButton";

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
			className={`fixed w-full z-50 ${floating && "top-2 md:top-6 mt-2 md:mt-0"} `}
		>
			<nav
				className={`z-50 flex items-center gap-2  rounded-2xl  ${floating && "border mx-2 md:mx-auto md:max-w-6xl md:shadow-lg"}`}
			>
				<div
					className={`flex w-full justify-between mx-auto backdrop-blur-3xl p-4 border-none${floating && "border-b border-primary/10 p-5 rounded-2xl"}`}
				>
					{withSideBar && (
						<div className="flex h-16 shrink-0 items-center gap-2 pl-4">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<BingoLogo />
						</div>
					)}
					{floating && (
						<Link
							href={"/"}
							className="text-3xl md:text-3xl font-bold tracking-tight text-foreground cursor-pointer"
						>
							<span className="text-primary">B</span>
							ingo
						</Link>
					)}

					<div className="flex items-center gap-2 lg:gap-8">
						{!session && <LoginButton />}
					</div>
				</div>
			</nav>
		</nav>
	);
}
