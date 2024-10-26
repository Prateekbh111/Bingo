import AppSidebar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import LoginPage from "../(not-authenticated)/login/page";

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (!session) {
		notFound();
	}

	const user = await prisma.user.findFirst({ where: { id: session.user.id } });
	if (!user) {
		return <LoginPage />;
	}
	return (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar session={session!} />
			<main className="w-full">{children}</main>
		</SidebarProvider>
	);
}
