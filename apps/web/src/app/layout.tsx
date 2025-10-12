import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import StructuredData from "@/components/StructuredData";
import { AudioProvider } from "@/context/AudioProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Bingo | Free Online Bingo Games - Play with Friends Worldwide",
	description: "Join thousands of players on Bingo, the premier free online Bingo platform. Play real-time multiplayer Bingo games, connect with friends, and enjoy fair gameplay in a secure environment. No downloads required!",
	keywords: "online bingo, free bingo games, multiplayer bingo, bingo online, play bingo, bingo with friends, real-time bingo, bingo community, free online games",
	authors: [{ name: "Prateek Bhardwaj", url: "https://prateekbh111.in" }],
	creator: "Prateek Bhardwaj",
	publisher: "Bingo",
	robots: "index, follow",
	icons: {
		icon: "/icon.svg",
		apple: "/icon.svg",
	},
	openGraph: {
		title: "Bingo | Free Online Bingo Games",
		description: "Play free multiplayer Bingo games online with players worldwide. Real-time gameplay, fair random number generation, and a friendly community await!",
		url: "https://bingo.prateekbh111.in",
		siteName: "Bingo",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Bingo | Free Online Bingo Games",
		description: "Join the ultimate online Bingo experience! Play free multiplayer games with real-time action.",
		creator: "@prateekbh111",
	},
	alternates: {
		canonical: "https://bingo.prateekbh111.in",
	},
	category: "Games & Entertainment",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<StructuredData />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider attribute="class" defaultTheme="dark">
					<AudioProvider>
						{children}
					</AudioProvider>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
