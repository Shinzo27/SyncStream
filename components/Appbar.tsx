"use client";
import {
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Appbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const logoutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signOut({redirect: false});
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="px-6 py-6 flex justify-between items-center bg-white dark:bg-neutral-950 text-black dark:text-white w-screen">
          <Link href={'/'} className="text-2xl font-bold text-gray-900 dark:text-white">SyncStream</Link>
          <nav className="flex items-center space-x-4">
            {
              !session ? (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" className="bg-neutral-700 text-white dark:bg-white dark:text-black" onClick={()=>router.push('/signin')}>Login</Button>
                  <Button className="border border-neutral-600 dark:bg-slate-900 hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-500" onClick={()=>router.push('/signup')}>Register</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" className="bg-neutral-700 text-white dark:bg-white dark:text-black">User</Button>
                  <Button className="border border-neutral-600 dark:bg-slate-900 hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-500" onClick={logoutHandler}>Logout</Button>
                </div>
            )
            }
            <div className="flex items-center space-x-2">
              {
                theme === "dark" ? (
                  <div className="p-2 border-2 border-gray-600 rounded-md cursor-pointer hover:bg-gray-600" onClick={()=>setTheme("light")} >
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                  </div>
                ) : (
                  <div className="p-2 border border-black rounded-md cursor-pointer hover:bg-gray-200" onClick={()=>setTheme("dark")}>
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                )
              }
              {/* <Switch checked={theme === "dark" ? true : false} onCheckedChange={()=>setTheme(theme === "dark" ? "light" : "dark")}/> */}
            </div>
          </nav>
        </header>
  );
};

export default Appbar;  