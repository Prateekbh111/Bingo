import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileUpdateCard from "@/components/ProfileUpdateCard";
import AuthProvider from "@/context/authProvider";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function Profile() {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	return (
		<AuthProvider session={session}>
			<div className="min-h-screen flex items-center justify-center">
				<ProfileUpdateCard session={session} />
			</div>
		</AuthProvider>
	);
}
