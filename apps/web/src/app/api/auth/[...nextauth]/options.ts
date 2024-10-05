import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { type AuthOptions } from "next-auth";
import bcrypt from "bcrypt"

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
		Credentials({
			id: "credentials",
			name: "credentials",
			async authorize(credentials: any): Promise<any> {
				try {
					const { email, password } = credentials;
					const user = await prisma.user.findFirst({
						where:{
							email: email,
						}
					});
					if (!user) {
						return null;
					}
					const isPasswordCorrect = await bcrypt.compare(
						password,
						user.password!,
					);

					if (isPasswordCorrect) {
						return user;
					} else {
						return null;
					}
				} catch (error: any) {
					return null;
				}
			},
			credentials: {
				email: {
					label: "Email",
					type: "text ",
					placeholder: "johndoe69@gmail.com",
				},
				password: {
					label: "Password",
					type: "password",
				},
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