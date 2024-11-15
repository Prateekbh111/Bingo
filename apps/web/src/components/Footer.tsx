export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full bg-background text-center pb-6">
			<p className="text-sm">
				&copy; {currentYear} Bingooo. All rights reserved.
			</p>
		</footer>
	);
}
