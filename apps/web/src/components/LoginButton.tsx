"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoginButton() {
	return (
		<Button
			className="px-8 text-base rounded-md"
			onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
		>
			Login
		</Button>
	);
}
