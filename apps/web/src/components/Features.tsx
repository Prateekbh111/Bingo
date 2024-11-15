"use client";
import { Award, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function Features() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 1 }}
		>
			<section className="py-12 px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-primary">
					Experience Premium Gaming
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<FeatureCard
						icon={<Clock className="h-8 w-8 text-blue-500" />}
						title="Real-Time Gaming"
						description="Enjoy responsive gameplay with minimal latency for the best gaming experience"
					/>
					<FeatureCard
						icon={<Users className="h-8 w-8 text-green-500" />}
						title="Social Gaming"
						description="Connect with players worldwide in our friendly gaming community"
					/>
					<FeatureCard
						icon={<Award className="h-8 w-8 text-purple-500" />}
						title="Regular Tournaments"
						description="Participate in competitive events with fair play guidelines"
					/>
				</div>
			</section>
		</motion.div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: ReactNode;
	title: string;
	description: string;
}) {
	return (
		<Card className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
			<CardContent className="p-6 text-center">
				<div className="flex justify-center mb-4">{icon}</div>
				<h3 className="text-xl font-semibold mb-3">{title}</h3>
				<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
