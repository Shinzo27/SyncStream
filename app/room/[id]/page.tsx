'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Music, ThumbsUp, ThumbsDown, Play, Pause, SkipForward, Volume2, Crown, X } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const initialUsers = [
  {
    id: 1,
    name: "Alice",
    avatar: "/placeholder.svg?height=32&width=32",
    isHost: true,
  },
  {
    id: 2,
    name: "Bob",
    avatar: "/placeholder.svg?height=32&width=32",
    isHost: false,
  },
  {
    id: 3,
    name: "Charlie",
    avatar: "/placeholder.svg?height=32&width=32",
    isHost: false,
  },
];

const initialSongs = [
  { id: 1, title: "Song 1", artist: "Artist 1", upvotes: 5, downvotes: 1 },
  { id: 2, title: "Song 2", artist: "Artist 2", upvotes: 3, downvotes: 0 },
  { id: 3, title: "Song 3", artist: "Artist 3", upvotes: 2, downvotes: 1 },
];

const page = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(initialSongs[0]);
  const [songs, setSongs] = useState(initialSongs);
  const [users, setUsers] = useState(initialUsers);
  const [newSongUrl, setNewSongUrl] = useState("");

  const currentUser = users.find((user) => user.isHost) || users[0];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const addSong = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you'd parse the URL and extract song info
    const newSong = {
      id: songs.length + 1,
      title: `New Song ${songs.length + 1}`,
      artist: "Unknown Artist",
      upvotes: 0,
      downvotes: 0,
    };
    setSongs([...songs, newSong]);
    setNewSongUrl("");
  };

  const vote = (songId: number, isUpvote: boolean) => {
    setSongs(
      songs.map((song) => {
        if (song.id === songId) {
          if (isUpvote) {
            return { ...song, upvotes: song.upvotes + 1 };
          } else {
            return { ...song, downvotes: song.downvotes + 1 };
          }
        }
        return song;
      })
    );
  };

  const removeSong = (songId: number) => {
    setSongs(songs.filter((song) => song.id !== songId));
  };

  const removeUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const params = useParams();
  const roomId = params.id;

  useEffect(() => {
    console.log(roomId);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Users List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Users in Room</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <span>{user.name}</span>
                      {user.isHost && <Crown className="h-4 w-4 ml-2 text-yellow-500" />}
                    </div>
                  </div>
                  {currentUser.isHost && !user.isHost && (
                    <Button variant="ghost" size="icon" onClick={() => removeUser(user.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Song Queue */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Song Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {songs.map(song => (
                <div key={song.id} className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold">{song.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => vote(song.id, true)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span>{song.upvotes}</span>
                    <Button variant="outline" size="icon" onClick={() => vote(song.id, false)}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <span>{song.downvotes}</span>
                    {currentUser.isHost && (
                      <Button variant="ghost" size="icon" onClick={() => removeSong(song.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Add Song Form */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Add Song to Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addSong} className="flex space-x-2">
              <Input
                type="url"
                placeholder="Paste song URL here"
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className='bg-slate-800 hover:bg-slate-900 text-white'>Add song</Button>
            </form>
          </CardContent>
        </Card>

        {/* Music Player with Disk Animation */}
        <Card className="md:col-span-3">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                  <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentSong.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentSong.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Volume2 className="h-4 w-4" />
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className="w-[100px] bg-gray-700 text-black dark:bg-slate-700 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 text-center">
        <Link href="/rooms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
          Back to Rooms
        </Link>
      </div>
    </div>
  )
};

export default page;
