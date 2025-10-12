import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Mail, MessageCircle, Clock, Users, Shield, Gamepad2 } from "lucide-react";

export const metadata = {
    title: "Contact Us | Bingo",
    description: "Get in touch with the Bingo team. Support, feedback, partnership inquiries, and more.",
};

export default async function ContactPage() {
    const session = await getServerSession(authOptions);

    const contactReasons = [
        {
            icon: <Shield className="w-8 h-8 text-blue-500" />,
            title: "Technical Support",
            description: "Having issues with gameplay, account access, or technical problems? We&apos;re here to help resolve any technical difficulties quickly."
        },
        {
            icon: <Gamepad2 className="w-8 h-8 text-green-500" />,
            title: "Game Feedback",
            description: "Share your thoughts on game features, suggest improvements, or report bugs. Your feedback helps us make Bingo better."
        },
        {
            icon: <Users className="w-8 h-8 text-purple-500" />,
            title: "Community Issues",
            description: "Report inappropriate behavior, request community features, or get help with social aspects of the platform."
        },
        {
            icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
            title: "General Inquiries",
            description: "Questions about our platform, partnership opportunities, press inquiries, or anything else you'd like to discuss."
        }
    ];

    const supportHours = [
        { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
        { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
        { day: "Sunday", hours: "Closed" },
        { day: "Holidays", hours: "Limited availability" }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar session={session!} />

            <div className="container mx-auto px-4 py-20 pt-40">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-6 text-primary">
                            Contact Us
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            We&apos;d love to hear from you! Whether you need support, have feedback, or just want to say hello, we&apos;re here to help.
                        </p>
                    </div>

                    {/* Quick Contact Info */}
                    <Card className="mb-12">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="text-center">
                                    <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 text-primary">Email Support</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        Get in touch with our support team
                                    </p>
                                    <a
                                        href="mailto:prateekbh111@gmail.com"
                                        className="text-primary hover:underline font-medium text-lg"
                                    >
                                        prateekbh111@gmail.com
                                    </a>
                                </div>
                                <div className="text-center">
                                    <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 text-primary">Response Time</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        We typically respond within
                                    </p>
                                    <p className="text-primary font-medium text-lg">24 hours</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Reasons */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-8 text-primary">How Can We Help?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contactReasons.map((reason, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {reason.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2 text-primary">{reason.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {reason.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Support Guidelines */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Getting the Best Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                                To help us assist you quickly and effectively, please include the following information when contacting us:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-primary">For Technical Issues:</h3>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>• Your username/email address</li>
                                        <li>• Browser and version you&apos;re using</li>
                                        <li>• Operating system (Windows, Mac, iOS, Android)</li>
                                        <li>• Detailed description of the problem</li>
                                        <li>• Screenshots if applicable</li>
                                        <li>• Steps to reproduce the issue</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-primary">For General Inquiries:</h3>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>• Clear subject line</li>
                                        <li>• Specific details about your question</li>
                                        <li>• Your account information (if relevant)</li>
                                        <li>• Preferred method of follow-up</li>
                                        <li>• Any relevant context or background</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Hours */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Support Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                                Our support team is available during the following hours (Eastern Standard Time):
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {supportHours.map((schedule, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                                        <span className="font-medium text-primary">{schedule.day}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{schedule.hours}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                Outside of these hours, we&apos;ll respond to your message as soon as possible on the next business day.
                            </p>
                        </CardContent>
                    </Card>

                    {/* FAQ Quick Links */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Before You Contact Us</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                You might find the answer to your question in our helpful resources:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild variant="outline" size="lg">
                                    <a href="/how-to-play">How to Play Guide</a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a href="/about">About Bingo</a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a href="/terms">Terms of Service</a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a href="/privacy">Privacy Policy</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Form CTA */}
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4 text-primary">Ready to Get in Touch?</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                Send us an email and we&apos;ll get back to you as soon as possible!
                            </p>
                            <Button asChild size="lg" className="text-lg px-8 py-3">
                                <a href="mailto:prateekbh111@gmail.com?subject=Bingo%20Inquiry">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Send Email
                                </a>
                            </Button>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                We read every message and respond personally to each inquiry.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}
