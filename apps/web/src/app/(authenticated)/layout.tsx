import AppSidebar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (!session) notFound();
	return (
		<SidebarProvider>
			<AppSidebar session={session!} />
			<main className="w-full">{children}</main>
		</SidebarProvider>
	);
}
