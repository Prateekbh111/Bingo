import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-primary text-white mt-10">
			<div className="flex flex-row justify-between items-center text-center text-secondary cursor-pointer">
				<div className="flex flex-row gap-8">
					<Link href={"/contactUs"}>Contact Us</Link>
					<Link href={"/termsAndConditions"}>Terms And Conditions</Link>
					<Link href={"/refundAndCancellation"}>Refund And Cancellation</Link>
				</div>
				<div className="text-center text-secondary">
					<p>&copy; 2024 Bingo. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
