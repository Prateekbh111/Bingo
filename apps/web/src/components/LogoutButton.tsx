"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => signOut({ callbackUrl: "/login" })}
			className=""
		>
			<LogOut />
			<span className="sr-only">Logout</span>
		</Button>
	);
}
