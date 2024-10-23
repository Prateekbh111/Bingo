"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { Session } from "next-auth";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileUpdateCard({ session }: { session: Session }) {
	const { update } = useSession();
	const [username, setUsername] = useState<string>(session.user.username);
	const [isUpdatingField, setIsUpdatingField] = useState<boolean>(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			setIsUpdatingField(true);
			await axios.post<ApiResponse>("/api/updateUsername", {
				username,
			});
			await update({
				username: username,
			});
			console.log(session.user.username);
			toast({
				title: "Profile Updated",
				description: "Your profile has been successfully updated.",
				duration: 1000,
			});
			router.refresh();
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			console.log(axiosError);
			const message = axiosError.response?.data.message;
			if (message) {
				toast({
					description: `${message}`,
				});
			} else {
				toast({
					title: "Uh oh! Something went wrong.",
					description: "There was a problem with your request.",
				});
			}
		} finally {
			setIsUpdatingField(false);
			(event.target as HTMLFormElement).reset();
		}
	}

	return (
		<div className="md:pt-24 bg-background flex items-center justify-center p-4 w-full">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle>Edit Profile</CardTitle>
					<CardDescription>
						Change your profile information here.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-6">
						<div className="flex flex-col items-center space-y-4">
							<Avatar className="w-32 h-32">
								<AvatarImage
									src={session.user.image!}
									alt={session.user.name![0]}
								/>
								<AvatarFallback>{session.user.name![0]}</AvatarFallback>
							</Avatar>
						</div>
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								value={username}
								onChange={handleUsernameChange}
								placeholder="Enter your username"
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full"
							disabled={
								isUpdatingField ||
								session.user.username === username ||
								username === ""
							}
						>
							{!isUpdatingField ? (
								<span>Save Change</span>
							) : (
								<span className="flex">
									Saving Changes{" "}
									<LoaderCircle className="h-5 w-5 ml-1 animate-spin" />
								</span>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
