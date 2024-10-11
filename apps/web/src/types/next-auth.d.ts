import { User } from "@prisma/client";

declare module "next-auth" {
	interface Session {
		user: {
			id?: string;
			username?: string;
		} & User;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		username?: string;
	}
}
