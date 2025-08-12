"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Users, Lightbulb, ArrowRight, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TipsAndGuides() {
    const tips = [
        {
            icon: <Target className="w-6 h-6 text-blue-500" />,
            title: "Master Winning Patterns",
            description: "Learn the most common Bingo patterns and how to spot them quickly during gameplay.",
            readTime: "3 min read",
            category: "Strategy"
        },
        {
            icon: <Users className="w-6 h-6 text-green-500" />,
            title: "Building Your Bingo Community",
            description: "Tips for connecting with other players, making friends, and enjoying the social aspects of online Bingo.",
            readTime: "4 min read",
            category: "Social"
        },
        {
            icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
            title: "Advanced Bingo Strategies",
            description: "Professional tips to improve your odds and become a more competitive Bingo player.",
            readTime: "5 min read",
            category: "Advanced"
        },
        {
            icon: <Shield className="w-6 h-6 text-purple-500" />,
            title: "Safe Online Gaming",
            description: "How to enjoy online Bingo safely, protect your privacy, and recognize fair play practices.",
            readTime: "3 min read",
            category: "Safety"
        }
    ];

    const quickStats = [
        { number: "10,000+", label: "Active Players" },
        { number: "99.9%", label: "Uptime" },
        { number: "50,000+", label: "Games Played" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <section className="py-16 px-4 bg-secondary/20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 text-primary">
                        Tips, Guides & Community Insights
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Enhance your Bingo skills with expert tips, connect with our community, and discover everything you need to know about online Bingo gaming.
                    </p>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    <Card>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {quickStats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tips Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
                >
                    {tips.map((tip, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 p-2 bg-secondary rounded-lg">
                                        {tip.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {tip.category}
                                            </Badge>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {tip.readTime}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-primary group-hover:text-primary/80 transition-colors">
                                            {tip.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                                            {tip.description}
                                        </p>
                                        <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80 transition-colors">
                                            <span>Read more</span>
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Why Choose Bingooo Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mb-12"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center text-primary">
                                Why Choose Bingooo.site?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold mb-2 text-primary">100% Free & Fair</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        No hidden costs, verified random number generation, and transparent gameplay for everyone.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-semibold mb-2 text-primary">Global Community</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Connect with Bingo enthusiasts worldwide in our welcoming, moderated gaming environment.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-semibold mb-2 text-primary">Real-Time Action</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Lightning-fast gameplay with instant updates and responsive controls for the best experience.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center"
                >
                    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-8">
                            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-4 text-primary">
                                Ready to Become a Bingo Master?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                                Dive deeper into our comprehensive guides, learn advanced strategies, and discover everything about the wonderful world of online Bingo.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg">
                                    <Link href="/how-to-play">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Complete Guide
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/about">
                                        Learn About Us
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
