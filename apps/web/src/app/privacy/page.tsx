import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export const metadata = {
    title: "Privacy Policy | Bingooo.site",
    description: "Privacy Policy for Bingooo.site - Learn how we protect your personal information and data.",
};

export default async function PrivacyPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-background">
            <Navbar session={session!} />
            <div className="container mx-auto px-4 py-20 pt-40">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8 text-primary">
                        Privacy Policy
                    </h1>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Last Updated: {new Date().toLocaleDateString()}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">1. Information We Collect</h2>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-medium">Personal Information</h3>
                                    <p>When you create an account on Bingooo.site, we collect:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Your email address (through Google OAuth)</li>
                                        <li>Your name and profile picture (from your Google account)</li>
                                        <li>Username you choose for your gaming profile</li>
                                    </ul>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <h3 className="text-lg font-medium">Gaming Data</h3>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Game statistics and performance data</li>
                                        <li>Friend connections and social interactions</li>
                                        <li>Game session logs and timestamps</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">2. How We Use Your Information</h2>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>To provide and maintain our gaming service</li>
                                    <li>To authenticate users and prevent fraud</li>
                                    <li>To facilitate social features like friend connections</li>
                                    <li>To improve our games and user experience</li>
                                    <li>To send important service-related communications</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">3. Information Sharing</h2>
                                <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>With your explicit consent</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To protect the rights and safety of our users</li>
                                    <li>With service providers who help operate our platform (under strict confidentiality agreements)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">4. Data Security</h2>
                                <p>We implement appropriate security measures to protect your personal information:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Secure HTTPS encryption for all data transmission</li>
                                    <li>OAuth 2.0 authentication through Google</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Restricted access to personal data on a need-to-know basis</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">5. Cookies and Tracking</h2>
                                <p>We use cookies and similar technologies to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Keep you logged in to your account</li>
                                    <li>Remember your preferences and settings</li>
                                    <li>Analyze site usage to improve our services</li>
                                    <li>Provide personalized gaming experiences</li>
                                </ul>
                                <p className="mt-3">You can control cookie settings through your browser preferences.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">6. Your Rights</h2>
                                <p>You have the right to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Request deletion of your account and data</li>
                                    <li>Export your data in a portable format</li>
                                    <li>Withdraw consent for data processing</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">7. Children&apos;s Privacy</h2>
                                <p>Bingooo.site is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">8. Changes to This Policy</h2>
                                <p>We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new policy on this page and updating the &ldquo;Last Updated&rdquo; date.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-primary">9. Contact Us</h2>
                                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                                <div className="mt-3 p-4 bg-secondary rounded-lg">
                                    <p><strong>Email:</strong> prateekbh111@gmail.com</p>
                                    <p><strong>Website:</strong> bingooo.site</p>
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
