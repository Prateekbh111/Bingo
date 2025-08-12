import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import StructuredData from "@/components/StructuredData";

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
	title: "Bingooo.site | Free Online Bingo Games - Play with Friends Worldwide",
	description: "Join thousands of players on Bingooo.site, the premier free online Bingo platform. Play real-time multiplayer Bingo games, connect with friends, and enjoy fair gameplay in a secure environment. No downloads required!",
	keywords: "online bingo, free bingo games, multiplayer bingo, bingo online, play bingo, bingo with friends, real-time bingo, bingo community, free online games",
	authors: [{ name: "Prateek Bhardwaj", url: "https://prateekbh111-portfolio.vercel.app" }],
	creator: "Prateek Bhardwaj",
	publisher: "Bingooo.site",
	robots: "index, follow",
	icons: {
		icon: "/icon.svg",
		apple: "/icon.svg",
	},
	openGraph: {
		title: "Bingooo.site | Free Online Bingo Games",
		description: "Play free multiplayer Bingo games online with players worldwide. Real-time gameplay, fair random number generation, and a friendly community await!",
		url: "https://bingooo.site",
		siteName: "Bingooo.site",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Bingooo.site | Free Online Bingo Games",
		description: "Join the ultimate online Bingo experience! Play free multiplayer games with real-time action.",
		creator: "@prateekbh111",
	},
	alternates: {
		canonical: "https://bingooo.site",
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
					{children}
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
