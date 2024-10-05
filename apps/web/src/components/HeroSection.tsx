import Link from "next/link";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import { Gamepad2 } from "lucide-react";

export default function HeroSection() {
	return (
		<>
			<Spotlight
				className="-top-40 left-0 md:left-60 md:-top-20"
				fill="green"
			/>
			<div className="min-h-screen flex flex-col justify-center items-center">
				<div className="flex flex-col items-center justify-center  gap-4">
					<div className="text-center">
						<span className="tracking-tighter text-2xl md:text-3xl font-medium text-primary">
							Let&apos;s Play
						</span>
						<h1 className="tracking-tighter text-7xl md:text-8xl xl:text-8xl font-bold my-2">
							<span className="font-bold bg-gradient-to-b from-green-400 to-green-700 bg-clip-text text-transparent">
								B
							</span>
							ingo
						</h1>
					</div>
					<p className="text-foregroudn/80 max-w-xs lg:max-w-xl text-center tracking-tight md:text-lg font-light">
						Welcome to the ultimate Bingo experience, where fun meets strategy!
						Challenge your friends, win big, and enjoy a seamless gaming
						adventure!
					</p>
					<Link href={"/dashboard"}>
						<Button className="px-20 py-8 flex items-center justify-center gap-2 rounded-md">
							<span className="font-bold text-xl">Play</span>
							<Gamepad2 />
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
