import { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function RequestCard({
	friendRequest,
	setUserFriendRequests,
}: {
	friendRequest: FriendRequest;
	setUserFriendRequests: Dispatch<SetStateAction<FriendRequest[]>>;
}) {
	const { toast } = useToast();
	const [isDenying, setIsDenying] = useState<boolean>(false);
	const [isAccepting, setIsAccepting] = useState<boolean>(false);
	const handleAcceptRequest = async (friendData: FriendRequest) => {
		try {
			setIsAccepting(true);

			const response = await axios.post<ApiResponse>(
				"/api/acceptFriendRequest",
				JSON.stringify(friendData),
			);

			toast({
				title: "Success",
				description: `${response.data.message}`,
			});
			setUserFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.id !== friendData.id),
			);
		} catch {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
			});
		} finally {
			setIsAccepting(false);
		}
	};

	const handleRejectRequest = async (friendData: FriendRequest) => {
		try {
			setIsDenying(true);

			const response = await axios.post<ApiResponse>(
				"/api/rejectFriendRequest",
				JSON.stringify(friendData),
			);
			toast({
				title: "Success",
				description: `${response.data.message}`,
			});
			setUserFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.id !== friendData.id),
			);
		} catch {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
			});
		} finally {
			setIsDenying(false);
		}
	};

	return (
		<li
			key={friendRequest.id}
			className=" p-3 space-y-2 bg-card rounded-lg border "
		>
			<div className="flex items-center gap-4">
				<Avatar className="h-12 w-12">
					<AvatarImage src={friendRequest.image!} />
					<AvatarFallback>
						{friendRequest.name![0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<h3 className="font-semibold">{friendRequest.name}</h3>
					<p>{friendRequest.username}</p>
				</div>
			</div>
			<div className="flex space-x-4">
				<Button onClick={() => handleAcceptRequest(friendRequest!)}>
					{isAccepting ? (
						<>
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
							Accepting...
						</>
					) : (
						"Accept"
					)}
				</Button>
				<Button onClick={() => handleRejectRequest(friendRequest!)}>
					{isDenying ? (
						<>
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
							Rejecting...
						</>
					) : (
						"Reject"
					)}
				</Button>
			</div>
		</li>
	);
}
