'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      if(data.status === 200 ) {
        toast.success('User registered successfully')
        router.push('/signin')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up for SyncStream to start listening together</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} method='POST'>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Example123"
                  type="text"
                  disabled={isLoading}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Create a password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading} className='bg-slate-800 hover:bg-slate-900 text-white'>
                {isLoading && (
                  <span className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" disabled={isLoading}>
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Login
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-500 dark:hover:text-blue-400">
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
    );
}

export default page;