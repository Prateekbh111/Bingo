/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL, // Include other environment variables if needed
	},
	publicRuntimeConfig: {
		NEXT_PUBLIC_WEB_SOCKET_URL: process.env.NEXT_PUBLIC_WEB_SOCKET_URL || 'ws.bingooo.site',
	},
};

export default nextConfig;
