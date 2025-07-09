"use client"

import { useActionState } from "react"
import { signIn, signUp } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const [signInState, signInAction, isSignInPending] = useActionState(signIn, null)
  const [signUpState, signUpAction, isSignUpPending] = useActionState(signUp, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your email and password to sign in or create an account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isSignInPending}>
              {isSignInPending ? "Signing In..." : "Sign In"}
            </Button>
            {signInState?.success === false && (
              <p className="text-sm text-red-500 text-center">{signInState.message}</p>
            )}
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">Or</span>
            </div>
          </div>
          <form action={signUpAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" variant="outline" disabled={isSignUpPending}>
              {isSignUpPending ? "Signing Up..." : "Sign Up"}
            </Button>
            {signUpState?.message && (
              <p className={`text-sm text-center ${signUpState.success ? "text-green-500" : "text-red-500"}`}>
                {signUpState.message}
              </p>
            )}
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline" prefetch={false}>
              Terms of Service
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
