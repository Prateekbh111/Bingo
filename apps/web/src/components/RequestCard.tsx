import { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "./ui/button";
import { Check, LoaderCircle, X } from "lucide-react";

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
	const handleAcceptRequest = async (friendData: any) => {
		try {
			setIsAccepting(true);

			const response = await axios.post<ApiResponse>(
				"/api/acceptFriendRequest",
				JSON.stringify(friendData)
			);

			toast({
				title: "Success",
				description: `${response.data.message}`,
			});
			setUserFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.id !== friendData.id)
			);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
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
				JSON.stringify(friendData)
			);
			toast({
				title: "Success",
				description: `${response.data.message}`,
			});
			setUserFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.id !== friendData.id)
			);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
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
			className="md:flex justify-between items-center p-4 space-y-2 bg-card rounded-lg border "
		>
			<div>
				<p className="text-2xl font-semibold leading-none tracking-tight">
					{friendRequest.name}
				</p>
				<p className="text-sm text-muted-foreground">{friendRequest.email}</p>
			</div>
			<div className="flex space-x-4">
				<Button onClick={() => handleAcceptRequest(friendRequest!)}>
					{isAccepting ? (
						<>
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
							Accepting...
						</>
					) : (
						<Check />
					)}
				</Button>
				<Button onClick={() => handleRejectRequest(friendRequest!)}>
					{isDenying ? (
						<>
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
							Rejecting...
						</>
					) : (
						<X />
					)}
				</Button>
			</div>
		</li>
	);
}
