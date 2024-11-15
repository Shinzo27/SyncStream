"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";

const page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  async function onCreateRoom(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    // Simulating room creation
    setTimeout(() => {
      setIsLoading(false);
      alert("Room created successfully!");
    }, 2000);
  }

  async function onJoinRoom(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    // Simulating joining a room
    setTimeout(() => {
      setIsLoading(false);
      alert(`Joined room: ${roomCode}`);
    }, 2000);
  }
  return isLoading ? <Loader/> : (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-[400px] border shadow-md">
        <CardHeader>
          <CardTitle>Music Rooms</CardTitle>
          <CardDescription>
            Create a new room or join an existing one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 border border-gray-200 dark:border-neutral-700 rounded-lg">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <form onSubmit={onCreateRoom}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input
                      id="room-name"
                      placeholder="Enter a name for your room"
                      disabled={isLoading}
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  </div>
                  <Button
                    disabled={isLoading || !roomName}
                    className="bg-slate-900 hover:bg-slate-700 text-white"
                  >
                    {isLoading ? (
                      <span className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Music className="mr-2 h-4 w-4" />
                    )}
                    Create Room
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="join">
              <form onSubmit={onJoinRoom}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="room-code">Room Code</Label>
                    <Input
                      id="room-code"
                      placeholder="Enter the room code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    disabled={isLoading || !roomCode}
                    className="bg-slate-900 hover:bg-slate-700 text-white"
                  >
                    {isLoading ? (
                      <span className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Users className="mr-2 h-4 w-4" />
                    )}
                    Join Room
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
          >
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
