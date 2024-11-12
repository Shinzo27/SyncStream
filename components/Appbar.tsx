"use client"
import { useState } from 'react'
import { Moon, Sun, Music, Users, ThumbsUp, ThumbsDown, PlayCircle, PauseCircle, SkipForward, Headphones, Share2, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'

const Appbar = () => {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    return (
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SyncStream</h1>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Register</Button>
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <Switch checked={theme === 'dark' ? true : false} onCheckedChange={toggleTheme} />
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </nav>
        </header>
    );
}

export default Appbar;