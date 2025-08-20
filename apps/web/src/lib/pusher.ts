import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Only create Pusher instances if environment variables are available
export const pusherServer = process.env.PUSHER_APP_ID && process.env.NEXT_PUBLIC_PUSHER_APP_KEY && process.env.PUSHER_APP_SECRET
	? new PusherServer({
		appId: process.env.PUSHER_APP_ID,
		key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
		secret: process.env.PUSHER_APP_SECRET,
		cluster: "ap2",
		useTLS: true,
	})
	: null;

export const pusherClient = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
	? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, { cluster: "ap2" })
	: null;
