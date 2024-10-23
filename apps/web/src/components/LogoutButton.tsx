"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
	return (
		<Button
			onClick={() => signOut({ callbackUrl: "/login" })}
			className="w-full h-full"
		>
			<LogOut className="mr-2 h-4 w-4" />
			<span>Log out</span>
		</Button>
	);
}
