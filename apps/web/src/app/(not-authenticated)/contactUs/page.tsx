"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactUs() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background p-4">
			<Card className="w-full max-w-md rounded-xl shadow-xl">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Contact Us
					</CardTitle>
					<CardDescription className="text-center">
						You may contact us using the information below:
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col justify-center w-full gap-4">
					<Separator />
					<p className="w-full text-muted-foreground">
						Merchant Legal entity name: PRATEEK BHARDWAJ
					</p>
					<Separator />
					<p className="w-full text-muted-foreground">
						Registered Address: New patel nagar, Phagwara, Punjab, PIN: 144401
					</p>
					<Separator />
					<p className="w-full text-muted-foreground">
						Operational Address: New patel nagar, Phagwara, Punjab, PIN: 144401
					</p>
					<Separator />
					<p className="w-full text-muted-foreground">
						Telephone No: +91-8076501002
					</p>
					<Separator />
					<p className="w-full text-muted-foreground">
						E-Mail ID: bingooo.site@gmail.com
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
