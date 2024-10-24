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
			<Card className="w-full max-w-3xl rounded-xl shadow-xl">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Refund and Cancellation Policy
					</CardTitle>
					<CardDescription className="text-center">
						PRATEEK BHARDWAJ believes in helping its customers as far as
						possible, and has therefore a liberal cancellation policy. Under
						this policy:
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col justify-center w-full gap-4">
					<ul className="text-muted-foreground text-sm space-y-4">
						<Separator />
						<li>
							Cancellations will be considered only if the request is made
							immediately after placing the order. However, the cancellation
							request may not be entertained if the orders have been
							communicated to the vendors/merchants and they have initiated the
							process of shipping them.
						</li>
						<Separator />
						<li>
							PRATEEK BHARDWAJ does not accept cancellation requests for
							perishable items like flowers, eatables etc. However,
							refund/replacement can be made if the customer establishes that
							the quality of product delivered is not good.
						</li>
						<Separator />
						<li>
							In case of receipt of damaged or defective items please report the
							same to our Customer Service team. The request will, however, be
							entertained once the merchant has checked and determined the same
							at his own end. This should be reported within Only same day days
							of receipt of the products. In case you feel that the product
							received is not as shown on the site or as per your expectations,
							you must bring it to the notice of our customer service within
							Only same day days of receiving the product. The Customer Service
							Team after looking into your complaint will take an appropriate
							decision.
						</li>
						<Separator />
						<li>
							In case of complaints regarding products that come with a warranty
							from manufacturers, please refer the issue to them. In case of any
							Refunds approved by the PRATEEK BHARDWAJ, it’ll take 9-15 Days
							days for the refund to be processed to the end customer.
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
