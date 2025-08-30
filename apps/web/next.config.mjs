/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	publicRuntimeConfig: {
		NEXT_PUBLIC_WEB_SOCKET_URL: process.env.NEXT_PUBLIC_WEB_SOCKET_URL,
	},
};

export default nextConfig;
