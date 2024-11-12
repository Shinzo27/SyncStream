"use client";
import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const Appbar = () => {
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // const toggleTheme = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        MusicSync
      </h1>
      <nav className="flex items-center space-x-4">
        <Button variant="ghost">Login</Button>
        <Button>Register</Button>
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <Switch checked={theme === 'dark' ? false : true} onCheckedChange={()=>setTheme(theme === 'dark' ? 'light' : 'dark')} />
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
      </nav>
    </header>
  );
};

export default Appbar;
