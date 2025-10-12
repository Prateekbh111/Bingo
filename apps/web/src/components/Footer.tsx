import Link from "next/link";
import { Gamepad2, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		legal: [
			{ name: "Privacy Policy", href: "/privacy" },
			{ name: "Terms of Service", href: "/terms" },
			{ name: "Contact Us", href: "/contact" }
		],
		company: [
			{ name: "About Us", href: "/about" },
			{ name: "How to Play", href: "/how-to-play" },
			{ name: "Support", href: "/contact" }
		],
		social: [
			{ name: "Portfolio", href: "https://prateekbh111-portfolio.vercel.app", external: true },
			{ name: "X/Twitter", href: "https://x.com/prateekbh111", external: true },
			{ name: "Email", href: "mailto:prateekbh111@gmail.com", external: true }
		]
	};

	return (
		<footer className="w-full bg-secondary/30 border-t border-border">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="md:col-span-1">
						<div className="flex items-center gap-2 mb-4">
							<Gamepad2 className="w-6 h-6 text-primary" />
							<span className="text-xl font-bold text-primary">Bingo.prateekbh111.in</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
							The premier online Bingo platform bringing players together from around the world in a secure, fair, and fun gaming environment.
						</p>
					</div>

					{/* Company Links */}
					<div>
						<h3 className="font-semibold text-primary mb-4">Company</h3>
						<ul className="space-y-2">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className="font-semibold text-primary mb-4">Legal</h3>
						<ul className="space-y-2">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Connect */}
					<div>
						<h3 className="font-semibold text-primary mb-4">Connect</h3>
						<ul className="space-y-2">
							{footerLinks.social.map((link) => (
								<li key={link.name}>
									{link.external ? (
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
										>
											{link.name}
											{link.name === "Email" ? (
												<Mail className="w-3 h-3" />
											) : (
												<ExternalLink className="w-3 h-3" />
											)}
										</a>
									) : (
										<Link
											href={link.href}
											className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
										>
											{link.name}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-border mt-8 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							&copy; {currentYear} Bingo.prateekbh111.in. All rights reserved.
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Made with ❤️ for the Bingo community
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
