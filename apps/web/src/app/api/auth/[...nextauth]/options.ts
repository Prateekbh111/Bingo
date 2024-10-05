import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { type AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token }) {
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.sub!;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},

	secret: process.env.NEXTAUTH_SECRET,
};
