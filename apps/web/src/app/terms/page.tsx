import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export const metadata = {
    title: "Terms of Service | Bingo",
    description: "Terms of Service for Bingo - Rules and guidelines for using our online Bingo platform.",
};

export default async function TermsPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-background">
            <Navbar session={session!} />
            <div className="container mx-auto px-4 py-20 pt-40">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8 text-primary">
                        Terms of Service
                    </h1>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Last Updated: {new Date().toLocaleDateString()}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">1. Acceptance of Terms</h2>
                                <p>By accessing and using Bingo (&ldquo;the Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">2. Service Description</h2>
                                <p>Bingo is an online gaming platform that provides:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Multiplayer Bingo games in real-time</li>
                                    <li>Social features to connect with other players</li>
                                    <li>Tournament and competitive gaming opportunities</li>
                                    <li>Free-to-play gaming entertainment</li>
                                </ul>
                                <p className="mt-3 font-medium text-amber-600 dark:text-amber-400">
                                    Important: This is a free entertainment platform. No real money gambling is involved.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">3. User Eligibility</h2>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>You must be at least 13 years old to use this service</li>
                                    <li>You must provide accurate and complete registration information</li>
                                    <li>You are responsible for maintaining the security of your account</li>
                                    <li>One account per person is permitted</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">4. Acceptable Use Policy</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">You agree NOT to:</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Use the service for any illegal or unauthorized purpose</li>
                                            <li>Harass, abuse, or harm other users</li>
                                            <li>Share inappropriate, offensive, or harmful content</li>
                                            <li>Attempt to cheat or exploit game mechanics</li>
                                            <li>Use automated tools, bots, or scripts</li>
                                            <li>Interfere with the proper functioning of the service</li>
                                            <li>Impersonate other users or entities</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">You agree TO:</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Play fair and follow game rules</li>
                                            <li>Respect other players and maintain good sportsmanship</li>
                                            <li>Report any bugs or security issues you discover</li>
                                            <li>Use the platform responsibly and considerately</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">5. Game Rules and Fair Play</h2>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>All games are monitored for fair play</li>
                                    <li>Random number generation is verified and auditable</li>
                                    <li>Cheating or exploitation will result in immediate account suspension</li>
                                    <li>Game results are final and binding</li>
                                    <li>We reserve the right to investigate suspicious activity</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">6. Intellectual Property</h2>
                                <p>All content on Bingo, including but not limited to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Software code and game mechanics</li>
                                    <li>Graphics, designs, and user interface</li>
                                    <li>Logos, trademarks, and branding</li>
                                    <li>Audio and visual content</li>
                                </ul>
                                <p className="mt-3">Is owned by Bingo or licensed to us. Users may not copy, modify, or distribute this content without permission.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">7. Privacy and Data Protection</h2>
                                <p>Your privacy is important to us. Please review our <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a> to understand how we collect, use, and protect your personal information.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">8. Service Availability</h2>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>We strive to maintain 99%+ uptime but cannot guarantee uninterrupted service</li>
                                    <li>Scheduled maintenance will be announced in advance when possible</li>
                                    <li>We are not liable for temporary service interruptions</li>
                                    <li>We reserve the right to modify or discontinue features with notice</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">9. Account Termination</h2>
                                <p>We reserve the right to terminate or suspend accounts that:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Violate these terms of service</li>
                                    <li>Engage in fraudulent or abusive behavior</li>
                                    <li>Remain inactive for extended periods</li>
                                    <li>Are found to be duplicate accounts</li>
                                </ul>
                                <p className="mt-3">Users may also delete their accounts at any time through their profile settings.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">10. Limitation of Liability</h2>
                                <p>Bingo is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Any damages arising from use of the service</li>
                                    <li>Loss of data or account information</li>
                                    <li>Service interruptions or technical issues</li>
                                    <li>Actions of other users on the platform</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">11. Changes to Terms</h2>
                                <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the updated terms.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">12. Governing Law</h2>
                                <p>These terms are governed by the laws of the jurisdiction where Bingo operates. Any disputes will be resolved through binding arbitration.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">13. Contact Information</h2>
                                <p>For questions about these Terms of Service, please contact us:</p>
                                <div className="mt-3 p-4 bg-secondary rounded-lg">
                                    <p><strong>Email:</strong> prateekbh111@gmail.com</p>
                                    <p><strong>Website:</strong> bingo.prateekbh111.in</p>
                                </div>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}
