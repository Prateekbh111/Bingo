"use client";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import { Trophy, Users, Star, Gamepad2 } from "lucide-react";
import { Session } from "next-auth";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function HeroSection({ session }: { session: Session }) {
	const features = [
		{ icon: <Trophy className="w-5 h-5" />, text: "Win Big Prizes" },
		{ icon: <Users className="w-5 h-5" />, text: "Join Our Community" },
		{ icon: <Star className="w-5 h-5" />, text: "Earn Rewards" },
	];

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<Spotlight
				className="-top-40 left-0 md:left-60 md:-top-20"
				fill="green"
			/>

			<div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,rgba(74,222,128,0.1),transparent)] " />

			<div className="relative container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center items-center mt-10">
				<motion.div
					className="flex flex-col items-center justify-center max-w-4xl gap-8 text-center"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* Main Heading */}
					<div className="space-y-4">
						<motion.h1
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-6xl md:text-7xl xl:text-8xl font-bold tracking-tight"
						>
							<span className="inline-block bg-gradient-to-b from-green-400 to-green-700 bg-clip-text text-transparent">
								B
							</span>
							ingo
						</motion.h1>
					</div>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="text-gray-600 dark:text-gray-300 max-w-2xl text-lg md:text-xl leading-relaxed"
					>
						Join our vibrant online Bingo community and compete for exciting
						prizes in a secure and fair gaming environment.
					</motion.p>

					{/* Features */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						className="flex flex-wrap justify-center gap-6 my-4"
					>
						{features.map((feature, index) => (
							<div
								key={index}
								className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full shadow-md"
							>
								<span className="text-emerald-600 dark:text-emerald-400">
									{feature.icon}
								</span>
								<span className="text-gray-700 dark:text-gray-200 font-medium">
									{feature.text}
								</span>
							</div>
						))}
					</motion.div>

					{/* CTA Button */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 1 }}
						className="flex flex-col items-center gap-4"
					>
						<Button
							className="group relative px-20 py-8 flex items-center justify-center gap-2 rounded-md  shadow-lg transition-all duration-300 hover:shadow-xl"
							onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
						>
							<span className="font-bold text-xl">Play</span>
							<Gamepad2 className="group-hover:rotate-12 transition-transform" />
						</Button>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Secure authentication required • Fair play enforced
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
