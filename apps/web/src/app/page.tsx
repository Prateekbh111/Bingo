import HeroSection from "@/components/HeroSection";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import HowToPlay from "@/components/HowToPlay";
import TipsAndGuides from "@/components/TipsAndGuides";

export default async function page() {
	const session = await getServerSession(authOptions);
	return (
		<div>
			<Navbar session={session!} />
			<HeroSection session={session!} />
			<Features />
			<TipsAndGuides />
			<HowToPlay session={session!} />
			<Footer />
		</div>
	);
}
