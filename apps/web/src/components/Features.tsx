import { Sparkles, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export default function Features() {
	return (
		<section className="mb-16">
			<h2 className="text-3xl font-bold text-center text-primary mb-8">
				Game Features
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
				<FeatureCard
					icon={<Zap className="h-8 w-8 text-yellow-500" />}
					title="Lightning Fast"
					description="Quick-paced games for maximum excitement"
				/>
				<FeatureCard
					icon={<Users className="h-8 w-8 text-blue-500" />}
					title="Multiplayer"
					description="Play with friends or join public games"
				/>
				<FeatureCard
					icon={<Sparkles className="h-8 w-8 text-pink-500" />}
					title="Special Events"
					description="Themed games and seasonal challenges"
				/>
			</div>
		</section>
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
		<Card className="bg-card shadow-lg">
			<CardContent className="p-6 text-center">
				<div className="flex justify-center mb-4">{icon}</div>
				<h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
				<p className="text-gray-600 dark:text-gray-300">{description}</p>
			</CardContent>
		</Card>
	);
}
