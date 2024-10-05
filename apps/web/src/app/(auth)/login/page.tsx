"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
	const handleGoogleLogin = () => {
		signIn("google", { callbackUrl: "/dashboard" });
		console.log("Google login initiated");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-background p-4">
			<Card className="w-full max-w-md rounded-xl shadow-xl">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Login
					</CardTitle>
					<CardDescription className="text-center">
						Sign in to your account using Google
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					<Button
						className="w-full max-w-sm rounded-md"
						onClick={handleGoogleLogin}
					>
						<FcGoogle className="w-5 h-5 mr-2" />
						Sign in with Google
					</Button>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-primary underline-offset-4 transition-colors hover:underline"
						>
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
