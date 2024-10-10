"use client";

import { useState, useRef } from "react";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Folder, X } from "lucide-react";

export default function ProfileEdit() {
	const [username, setUsername] = useState("JohnDoe");
	const [image, setImage] = useState("/placeholder.svg?height=128&width=128");
	const [tempImage, setTempImage] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setTempImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageSave = () => {
		if (tempImage) {
			setImage(tempImage);
			setTempImage(null);
		}
		setIsDialogOpen(false);
	};

	const handleImageCancel = () => {
		setTempImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Here you would typically send the data to your backend
		console.log("Submitting:", { username, image });
		toast({
			title: "Profile Updated",
			description: "Your profile has been successfully updated.",
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-background flex items-center justify-center p-4 w-full">
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
									<AvatarImage src={image} alt={username} />
									<AvatarFallback>{username[0]}</AvatarFallback>
								</Avatar>
								<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
									<DialogTrigger asChild>
										<Button variant="outline">Change Picture</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Change profile picture</DialogTitle>
											<DialogDescription>
												Upload a new profile picture or take a photo.
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="flex items-center justify-center">
												<Avatar className="w-40 h-40">
													<AvatarImage
														src={tempImage || image}
														alt={username}
													/>
													<AvatarFallback>{username[0]}</AvatarFallback>
												</Avatar>
											</div>
											<div className="flex justify-center space-x-2">
												<Label htmlFor="picture" className="cursor-pointer">
													<div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary">
														<Folder className="w-6 h-6" />
													</div>
													<Input
														id="picture"
														ref={fileInputRef}
														type="file"
														accept="image/*"
														onChange={handleImageChange}
														className="hidden"
													/>
												</Label>
												{tempImage && (
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={handleImageCancel}
													>
														<X className="w-4 h-4" />
													</Button>
												)}
											</div>
										</div>
										<DialogFooter>
											<Button type="button" onClick={handleImageSave}>
												Save changes
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
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
							<Button type="submit" className="w-full">
								Save Changes
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
