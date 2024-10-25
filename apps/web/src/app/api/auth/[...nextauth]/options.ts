import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { type AuthOptions } from "next-auth";
import SignInCallback from "next-auth";
import { v4 as uuidv4 } from "uuid";

export const authOptions: AuthOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			profile: async (profile) => {
				const randomUsername = `user_${uuidv4().slice(0, 6)}`;
				return {
					id: profile.sub,
					name: profile.name,
					username: randomUsername,
					coins: 100,
					email: profile.email,
					image: profile.picture,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }): Promise<boolean> {
			// Check if the user already exists based on their email
			const existingUser = await prisma.user.findUnique({
				where: { email: profile?.email },
			});

			if (existingUser) {
				console.log("existingUser");
				if (account) {
					await prisma.account.upsert({
						where: {
							provider_providerAccountId: {
								provider: account?.provider,
								providerAccountId: account?.providerAccountId,
							},
						},
						update: {},
						create: {
							userId: existingUser.id,
							provider: account?.provider,
							providerAccountId: account?.providerAccountId,
							type: account?.type,
							access_token: account?.access_token,
							id_token: account?.id_token,
							refresh_token: account?.refresh_token,
							expires_at: account?.expires_at,
						},
					});
				}
				return true;
			}
			console.log("new User");

			return true;
		},
		async jwt({ token, user, trigger, session }) {
			if (trigger == "update") {
				token.username = session.username;
			}
			if (user) {
				const userRecord = await prisma.user.findUnique({
					where: { id: user.id },
				});
				if (userRecord) {
					token.username = userRecord.username!;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.sub!;
				session.user.username = token.username!;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl;
		},
	},
	pages: {
		signIn: "/login",
	},

	secret: process.env.NEXTAUTH_SECRET,
};
