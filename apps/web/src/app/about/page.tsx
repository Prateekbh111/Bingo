import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Trophy, Users, Shield, Clock, Gamepad2, Star } from "lucide-react";

export const metadata = {
    title: "About Us | Bingo",
    description: "Learn about Bingo - The premier online Bingo gaming platform bringing players together from around the world.",
};

export default async function AboutPage() {
    const session = await getServerSession(authOptions);

    const features = [
        {
            icon: <Users className="w-8 h-8 text-blue-500" />,
            title: "Global Community",
            description: "Connect with Bingo enthusiasts from around the world in our friendly, inclusive gaming environment."
        },
        {
            icon: <Shield className="w-8 h-8 text-green-500" />,
            title: "Fair & Secure",
            description: "Advanced security measures and verified random number generation ensure fair play for everyone."
        },
        {
            icon: <Clock className="w-8 h-8 text-purple-500" />,
            title: "Real-Time Gaming",
            description: "Experience lightning-fast, responsive gameplay with our optimized real-time infrastructure."
        },
        {
            icon: <Trophy className="w-8 h-8 text-yellow-500" />,
            title: "Competitive Tournaments",
            description: "Regular tournaments and events give players exciting opportunities to showcase their skills."
        }
    ];

    const stats = [
        { number: "10,000+", label: "Active Players" },
        { number: "50,000+", label: "Games Played" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar session={session!} />

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20 pt-40">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-5xl font-bold mb-6 text-primary">
                        About Bingo
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        The world&apos;s most engaging online Bingo platform, where traditional gameplay meets modern technology to create unforgettable gaming experiences.
                    </p>
                </div>

                {/* Mission Section */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            To create the most enjoyable, fair, and social Bingo gaming experience online. We believe that gaming should bring people together, provide entertainment, and create lasting memories in a safe, welcoming environment.
                        </p>
                    </CardContent>
                </Card>

                {/* Story Section */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Our Story</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                        <p className="text-lg leading-relaxed">
                            Bingo was born from a passion for bringing the classic game of Bingo into the digital age. Founded by gaming enthusiasts who recognized the need for a modern, secure, and social Bingo platform, we set out to create something special.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Our team spent months researching what players really wanted: fair gameplay, social interaction, beautiful design, and most importantly, fun. We&apos;ve combined cutting-edge technology with timeless game mechanics to create an experience that both newcomers and Bingo veterans can enjoy.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Today, Bingo serves thousands of players worldwide, hosting games 24/7 and continually improving based on community feedback. We&apos;re not just a gaming platform – we&apos;re a community where friendships are formed and memories are made.
                        </p>
                    </CardContent>
                </Card>

                {/* Features Grid */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-primary">What Makes Us Special</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">By the Numbers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Technology Section */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Cutting-Edge Technology</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                        <p className="text-lg leading-relaxed">
                            Bingo is built on modern web technologies to ensure the best possible gaming experience:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-primary">Frontend Excellence</h3>
                                <ul className="space-y-2">
                                    <li>• Next.js for lightning-fast performance</li>
                                    <li>• Real-time WebSocket connections</li>
                                    <li>• Responsive design for all devices</li>
                                    <li>• Accessibility-first approach</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-primary">Backend Reliability</h3>
                                <ul className="space-y-2">
                                    <li>• Secure authentication via OAuth 2.0</li>
                                    <li>• Scalable cloud infrastructure</li>
                                    <li>• Verified random number generation</li>
                                    <li>• 99.9% uptime guarantee</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Values Section */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Our Values</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-primary">Integrity</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fair play, transparent operations, and honest communication in everything we do.
                            </p>
                        </div>
                        <div className="text-center">
                            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-primary">Community</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Building connections and fostering friendships through shared gaming experiences.
                            </p>
                        </div>
                        <div className="text-center">
                            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-primary">Excellence</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Continuously improving our platform to exceed player expectations.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Get in Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Have questions, suggestions, or just want to say hello? We&apos;d love to hear from you!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Email:</span>
                                <a href="mailto:prateekbh111@gmail.com" className="text-primary hover:underline">
                                    prateekbh111@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Website:</span>
                                <span className="text-primary">bingo.prateekbh111.in</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            We typically respond to all inquiries within 24 hours.
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
}
