import { User } from "@prisma/client";

declare module "next-auth" {
	interface Session {
		user: {
			id?: string;
		} & User;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
	}
}
