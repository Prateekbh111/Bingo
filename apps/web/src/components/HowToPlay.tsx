"use client";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { Check, Trophy, Info } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function HowToPlay({ session }: { session: Session }) {
	const steps = [
		{
			title: "Receive Your Card",
			description: "Get a unique digital card with randomly generated numbers",
			icon: <Info className="w-6 h-6 text-blue-500" />,
		},
		{
			title: "Follow the Numbers",
			description:
				"Watch as numbers are called in real-time with clear audio and visual cues",
			icon: <Info className="w-6 h-6 text-green-500" />,
		},
		{
			title: "Mark Your Progress",
			description: "Easily mark numbers with a single click as they appear",
			icon: <Info className="w-6 h-6 text-purple-500" />,
		},
		{
			title: "Claim Your Victory",
			description: "Submit your winning card when you complete a valid pattern",
			icon: <Check className="w-6 h-6 text-emerald-500" />,
		},
		{
			title: "Verify and Win",
			description: "Our automated system verifies your win instantly",
			icon: <Trophy className="w-6 h-6 text-amber-500" />,
		},
	];

	return (
		<div className="max-w-6xl mx-auto px-4 py-12">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 1 }}
			>
				<section className="mb-16">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4 text-primary">
							How to Play
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Follow these simple steps to enjoy our digital bingo experience
						</p>
					</div>

					<div className="bg-card rounded-2xl shadow-xl p-8">
						<div className="space-y-8">
							{steps.map((step, index) => (
								<div
									key={index}
									className="flex items-start gap-4 transition-all hover:translate-x-2"
								>
									<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-md">
										{step.icon}
									</div>
									<div className="flex-grow">
										<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
										<p className="text-gray-600 dark:text-gray-300">
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 1 }}
			>
				<section className="text-center bg-card rounded-2xl p-12 shadow-lg">
					<h2 className="text-4xl font-bold mb-4">Begin Your Gaming Journey</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
						Experience the thrill of digital bingo in a secure and engaging
						environment
					</p>
					<Button
						size="lg"
						className="bg-primary px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
						onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
					>
						Start Playing Now
					</Button>
				</section>
			</motion.div>
		</div>
	);
}
