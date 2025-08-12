import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Play, Users, Trophy, Clock, CheckCircle, Star, Grid3X3, Target } from "lucide-react";

export const metadata = {
    title: "How to Play Bingo | Bingooo.site",
    description: "Complete guide on how to play Bingo online at Bingooo.site. Learn the rules, strategies, and tips for winning.",
};

export default async function HowToPlayPage() {
    const session = await getServerSession(authOptions);

    const gameSteps = [
        {
            step: 1,
            title: "Create Your Account",
            description: "Sign up using your Google account for secure, instant access to all game features.",
            icon: <Users className="w-8 h-8 text-blue-500" />,
            tips: ["Use a valid email address", "Choose a memorable username", "Complete your profile"]
        },
        {
            step: 2,
            title: "Join a Game Room",
            description: "Browse available games or create your own room to play with friends.",
            icon: <Play className="w-8 h-8 text-green-500" />,
            tips: ["Check room capacity", "Review game rules", "Choose your difficulty level"]
        },
        {
            step: 3,
            title: "Get Your Bingo Card",
            description: "Receive a unique card with randomly generated numbers in a 5x5 grid.",
            icon: <Grid3X3 className="w-8 h-8 text-purple-500" />,
            tips: ["Familiarize yourself with your numbers", "Note the FREE space in the center", "Keep your card visible"]
        },
        {
            step: 4,
            title: "Follow the Caller",
            description: "Numbers are called randomly. Mark matching numbers on your card as they appear.",
            icon: <Target className="w-8 h-8 text-orange-500" />,
            tips: ["Listen carefully to each call", "Mark numbers quickly", "Double-check your selections"]
        },
        {
            step: 5,
            title: "Form Winning Patterns",
            description: "Complete lines, patterns, or full house to win. Different games have different winning conditions.",
            icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
            tips: ["Know the winning pattern", "Keep track of your progress", "Watch for near-wins"]
        },
        {
            step: 6,
            title: "Call BINGO!",
            description: "When you complete a winning pattern, call 'BINGO!' to claim your victory.",
            icon: <Trophy className="w-8 h-8 text-yellow-500" />,
            tips: ["Click the BINGO button immediately", "Verify your pattern", "Celebrate your win!"]
        }
    ];

    const winningPatterns = [
        { name: "Horizontal Line", description: "Complete any horizontal row (5 numbers in a row)" },
        { name: "Vertical Line", description: "Complete any vertical column (5 numbers in a column)" },
        { name: "Diagonal Line", description: "Complete either diagonal (5 numbers diagonally)" },
        { name: "Four Corners", description: "Mark all four corner numbers of your card" },
        { name: "Full House", description: "Mark all numbers on your entire card (except FREE space)" },
        { name: "X Pattern", description: "Complete both diagonals simultaneously" },
        { name: "T Pattern", description: "Complete the top row and middle column" },
        { name: "L Pattern", description: "Complete the left column and bottom row" }
    ];

    const strategies = [
        {
            title: "Card Selection Strategy",
            tips: [
                "Choose cards with a good spread of numbers",
                "Avoid cards with too many numbers in the same range",
                "Look for cards with numbers ending in different digits",
                "Consider playing multiple cards for better odds"
            ]
        },
        {
            title: "During Gameplay",
            tips: [
                "Stay focused and attentive to every number called",
                "Develop a systematic way to scan your cards",
                "Keep track of patterns you're close to completing",
                "Don't get distracted by chat or other activities"
            ]
        },
        {
            title: "Winning Tips",
            tips: [
                "Learn all possible winning patterns for each game",
                "Practice pattern recognition to spot wins quickly",
                "Keep calm under pressure during close games",
                "Call BINGO immediately when you complete a pattern"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar session={session!} />

            <div className="container mx-auto px-4 py-20 pt-40">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-6 text-primary">
                            How to Play Bingo
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            Master the classic game of Bingo with our comprehensive guide. Learn the rules, discover winning strategies, and become a Bingo champion!
                        </p>
                    </div>

                    {/* Game Basics */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Bingo Basics</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-6">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Bingo is a game of chance where players mark numbers on cards as they are randomly called out.
                                The goal is to be the first to complete a predetermined pattern and call &ldquo;BINGO!&rdquo;
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                                <div className="text-center p-4 bg-secondary rounded-lg">
                                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <h3 className="font-semibold">Real-Time</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Games happen in real-time with other players</p>
                                </div>
                                <div className="text-center p-4 bg-secondary rounded-lg">
                                    <Grid3X3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <h3 className="font-semibold">5x5 Grid</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Each card has 25 spaces in a 5x5 grid</p>
                                </div>
                                <div className="text-center p-4 bg-secondary rounded-lg">
                                    <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                    <h3 className="font-semibold">Random Calls</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Numbers are called randomly by the system</p>
                                </div>
                                <div className="text-center p-4 bg-secondary rounded-lg">
                                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                    <h3 className="font-semibold">Win Patterns</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete specific patterns to win</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step by Step Guide */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Step-by-Step Guide</h2>
                        <div className="space-y-6">
                            {gameSteps.map((step, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                                                    {step.step}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center mb-3">
                                                    {step.icon}
                                                    <h3 className="text-xl font-semibold ml-3 text-primary">{step.title}</h3>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                                    {step.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {step.tips.map((tip, tipIndex) => (
                                                        <Badge key={tipIndex} variant="secondary" className="text-xs">
                                                            {tip}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Winning Patterns */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Winning Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                                Different games feature different winning patterns. Here are the most common ones:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {winningPatterns.map((pattern, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-4 bg-secondary rounded-lg">
                                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-primary">{pattern.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{pattern.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Strategies and Tips */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Winning Strategies & Tips</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {strategies.map((strategy, index) => (
                                <Card key={index} className="h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-primary">{strategy.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {strategy.tips.map((tip, tipIndex) => (
                                                <li key={tipIndex} className="flex items-start space-x-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Game Etiquette */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Game Etiquette</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-green-600">Do&apos;s</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Be respectful to other players</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Congratulate winners graciously</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Stay focused during gameplay</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Report any technical issues</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Follow room rules and guidelines</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-red-600">Don&apos;ts</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            <span>Don&apos;t use inappropriate language</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            <span>Don&apos;t disrupt other players</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            <span>Don&apos;t attempt to cheat or exploit</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            <span>Don&apos;t spam the chat</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            <span>Don&apos;t call false BINGOs</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQ Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl text-center text-primary">Frequently Asked Questions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-primary">How are numbers called?</h3>
                                <p className="text-gray-700 dark:text-gray-300">Numbers are randomly generated by our certified random number generator, ensuring fair play for all participants.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-primary">Can I play on mobile devices?</h3>
                                <p className="text-gray-700 dark:text-gray-300">Yes! Bingooo.site is fully responsive and works perfectly on smartphones, tablets, and desktop computers.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-primary">What happens if I miss calling BINGO?</h3>
                                <p className="text-gray-700 dark:text-gray-300">You have a limited time window to call BINGO after completing a pattern. If missed, the game continues and other players can still win.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-primary">Is Bingooo.site free to play?</h3>
                                <p className="text-gray-700 dark:text-gray-300">Yes, Bingooo.site is completely free to play. We believe everyone should have access to quality entertainment.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-primary">How do I report issues or get help?</h3>
                                <p className="text-gray-700 dark:text-gray-300">Contact our support team at prateekbh111@gmail.com or use the in-game help features for assistance.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}
