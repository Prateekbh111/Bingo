"use client";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function AddFriend() {
	const { toast } = useToast();
	const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSendingRequest(true);
		const formData = new FormData(e.currentTarget);
		const formDataObject = Object.fromEntries(formData.entries());
		if (formDataObject.username.toString().trim() === "") {
			toast({
				title: "Wrong username",
				duration: 1000,
			});
			setIsSendingRequest(false);
			return;
		}
		console.log(formDataObject.username);
		try {
			const response = await axios.post<ApiResponse>("/api/sendFriendRequest", {
				friendUsername: formDataObject.username,
			});
			toast({
				title: "Success",
				description: `${response.data.message}`,
				duration: 1000,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			console.log(axiosError);
			const message = axiosError.response?.data.message;
			if (message) {
				toast({
					description: `${message}`,
					duration: 1000,
				});
			} else {
				toast({
					title: "Uh oh! Something went wrong.",
					description: "There was a problem with your request.",
					duration: 1000,
				});
			}
		} finally {
			setIsSendingRequest(false);
			(e.target as HTMLFormElement).reset();
		}
	}

	return (
		<div className="mx-auto w-full flex justify-center ">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Add Friend</CardTitle>
					<CardDescription>
						Add friend using username to play bingo.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={(e) => handleSubmit(e)}>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="username">Username</Label>
							<Input
								name="username"
								id="username"
								placeholder="Friend's username"
								autoComplete="off"
								onTouchStart={(e) => e.preventDefault()}
								onTouchStartCapture={(e) => e.preventDefault()}
							/>
						</div>
						<div className="flex justify-end mt-4">
							<Button type="submit" disabled={isSendingRequest}>
								{isSendingRequest ? (
									<>
										<LoaderCircle className="animate-spin mr-2  h-4 w-4" />{" "}
										Sending
									</>
								) : (
									"Send Request"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
		// <Drawer>
		// 	<DrawerTrigger asChild>
		// 		<div className="flex justify-between items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
		// 			<div className="flex">
		// 				<PlusIcon className="w-5 h-5 mr-2" />
		// 				Add Friend
		// 			</div>
		// 		</div>
		// 	</DrawerTrigger>
		// 	<DrawerContent className="">
		// 		<DrawerTitle></DrawerTitle>
		// 		<div className="mx-auto w-full flex justify-center p-4">
		// 			<Card className="w-[350px]">
		// 				<CardHeader>
		// 					<CardTitle>Add Friend</CardTitle>
		// 					<CardDescription>
		// 						Add friend using username to play bingo.
		// 					</CardDescription>
		// 				</CardHeader>
		// 				<CardContent>
		// 					<form onSubmit={(e) => handleSubmit(e)}>
		// 						<div className="flex flex-col space-y-1.5">
		// 							<Label htmlFor="username">Username</Label>
		// 							<Input
		// 								name="username"
		// 								id="username"
		// 								placeholder="Friend's username"
		// 							/>
		// 						</div>
		// 						<div className="flex justify-end mt-4">
		// 							<Button type="submit" disabled={isSendingRequest}>
		// 								{isSendingRequest ? (
		// 									<>
		// 										<LoaderCircle className="animate-spin mr-2  h-4 w-4" />{" "}
		// 										Sending
		// 									</>
		// 								) : (
		// 									"Send Request"
		// 								)}
		// 							</Button>
		// 						</div>
		// 					</form>
		// 				</CardContent>
		// 			</Card>
		// 		</div>
		// 	</DrawerContent>
		// </Drawer>
	);
}
