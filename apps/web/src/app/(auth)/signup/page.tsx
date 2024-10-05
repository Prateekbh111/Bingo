"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'

export default function SignupPage() {
  const handleGoogleSignup = () => {
    signIn("google", {callbackUrl: "/"});
    console.log('Google signup initiated')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md rounded-xl shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Sign up for an account using Google</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            // variant={"outline"}
            className="w-full max-w-sm rounded-md"
            onClick={handleGoogleSignup}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}