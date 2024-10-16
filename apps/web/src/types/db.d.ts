interface User {
	id: string | null;
	name: string | null;
	username: string | null;
	email: string | null;
	image: string | null;
}

interface FriendRequest {
	id: string | null;
	name?: string | null;
	username?: string | null;
	image?: string | null;
}
interface Friend {
	id: string | null;
	name: string | null;
	username: string | null;
	image: string | null;
}

interface Message {
	id: string;
	senderId: string | null;
	receiverId: string | null;
	content: string | null;
	timestamp: Date | null;
	chatId: string | null;
}
