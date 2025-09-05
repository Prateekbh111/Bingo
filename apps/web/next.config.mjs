/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	publicRuntimeConfig: {
		NEXT_PUBLIC_WEB_SOCKET_URL: process.env.NEXT_PUBLIC_WEB_SOCKET_URL,
		NEXT_PUBLIC_WS_PORT: process.env.NEXT_PUBLIC_WS_PORT,
	},
};

export default nextConfig;
