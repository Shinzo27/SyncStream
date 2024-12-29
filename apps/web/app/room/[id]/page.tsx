'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, ThumbsDown, Play, Pause, SkipForward, Crown, X } from 'lucide-react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketProvider'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const initialSongs = [
  { id: 1, title: 'YouTube Video 1', artist: 'Artist 1', youtubeId: 'dQw4w9WgXcQ', upvotes: 5, downvotes: 1 },
  { id: 2, title: 'YouTube Video 2', artist: 'Artist 2', youtubeId: 'ZZ5LpwO-An4', upvotes: 3, downvotes: 0 },
  { id: 3, title: 'YouTube Video 3', artist: 'Artist 3', youtubeId: '9bZkp7q19f0', upvotes: 2, downvotes: 1 },
]

interface iSong {
  value: {
    title: string;
    youtubeId: string;
  };
  score: number;
}

interface iCurrentSong {
  title: string;
  youtubeId: string;
  artist: string;
}

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const id = React.use(params);
  const roomId = id.id;
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<iCurrentSong>()
  const [songs, setSongs] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [songUrl, setSongUrl] = useState('')
  const { socket, addSong, upvote, downvote, leaveRoom } = useSocket()
  const session = useSession()
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if(!currentSong) return;
    
    if (!(window as any).YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: '100%',
        width: '100%',
        videoId: currentSong?.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => console.log("Player is ready"),
        },
      });
    };
  }, [currentSong]);

  const playNextSong = () => {
    if(socket){
      socket.emit('nextsong', roomId)
    }
  }

  const togglePlayPause = () => {
    if (playerRef) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleAddSong = () => {
    const youtubeId = extractYoutubeId(songUrl);
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const requrl = `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=snippet,contentDetails&key=${API_KEY}`;
    fetch(requrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.items.length > 0) {
          const title = data.items[0].snippet.title;
          addSong({
            roomId: roomId,
            song: { title: title, youtubeId: youtubeId || "" },
          })
        } else {
          toast.error("Invalid YouTube URL");
        }
      });
    setSongUrl("");
  };

  const changeSong = async() => {
    if(socket){
      socket.emit("nextsong", roomId)
    }
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const removeUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  useEffect(() => {
    if(socket){
      socket.emit("checkRoom", roomId)
    }

    if(socket){
      socket.on("checkRoom", (result) => {
        console.log(result)
        if(result.current_song !== null){ 
          const newCurrentSong = JSON.parse(result.current_song)
          setCurrentSong(newCurrentSong)
        }
        if(result.playlist !== null){
          const newPlaylist = result.playlist.map((song: any) => ({
            value: JSON.parse(song.value),
            score: song.score,
          }));
          setSongs(newPlaylist);
        }
        const users = result.users;
        setUsers(users);
      });
    }

    if (socket) {
      socket.on("joinRoom", (message) => {
        toast.success(`${message.username} joined the room`);
        setUsers(message.user);
      });
    }

    if (socket) {
      socket.on("leaveRoom", (message) => {
        toast.success(`${message.username} left the room`);
        setUsers(message.user);
      });
    }

    if(socket){
      socket.on("nextsong", (message) => {
        if(message.message){
          return alert(message.message)
        }
        const parsedSong = JSON.parse(message);
        setCurrentSong(parsedSong);
        if (playerRef.current) {
          playerRef.current.loadVideoById(parsedSong.youtubeId);
        } else {
          console.log("Player not found")
        }
      });
    }

    return () => {
      socket?.off("checkRoom");
      socket?.off("joinRoom");
      socket?.off("leaveRoom");
      socket?.off("nextsong");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("addSong", (message) => {
      const parsedSong = message.songs.map((song: any) => ({
        value: JSON.parse(song.value),
        score: song.score,
      }));
      setSongs(parsedSong);
      const parsedCurrentSong = JSON.parse(message.currentSong)
      setCurrentSong(parsedCurrentSong);
    });

    socket?.on("upvote", (message) => {
      const parsedSong = message.result.map((song: any) => ({
        value: JSON.parse(song.value),
        score: song.score,
      }));
      setSongs(parsedSong);
    });

    socket?.on("downvote", (message) => {
        console.log(message);
        const parsedSong = message.result.map((song: any) => ({
        value: JSON.parse(song.value),
        score: song.score,
      }));
      setSongs(parsedSong);
    });

    return () => {
      socket?.off("addSong");
      socket?.off("checkRoom");
      socket?.off("upvote");
      socket?.off("downvote");
    };
  }, [socket]);

  const handleLeaveRoom = () => {
    leaveRoom({ roomId: roomId, username: session?.data?.user.name || "" });
    toast.success("You have left the room");
    redirect("/");
  };

  const handleUpvote = ({ songTitle }: { songTitle: iSong[] }) => {
    upvote({ roomId: roomId, songtitle: songTitle });
  };

  const handleDownvote = ({ songTitle }: { songTitle: iSong[] }) => {
    const checkVote = songs.find((song) => song.value === songTitle);
    if (checkVote) {
      if (checkVote.score === 0) {
        toast.error("You can't downvote a song that has already been downvoted");
        return;
      } else {
        downvote({ roomId: roomId, songtitle: songTitle });
      }
    }
  };

  const currentUser = users.find(user => user.isHost) || users[0]

  // useEffect(() => { 
  //   if(songs && songs.length > 0){
  //     console.log(songs);
  //   }
  // }, [songs])

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
                    <div className="flex items-center">
                      <span>{user.user.username}</span>
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
            <Button 
              variant="default" 
              className="w-full mt-4 bg-slate-800 dark:bg-red-700 text-white" 
              onClick={handleLeaveRoom}
            >
              Leave Room
            </Button>
          </CardContent>
        </Card>

        {/* Song Queue */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Video Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {songs.map((song, index) => (
                <div key={index} className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold">{song.value.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleUpvote({ songTitle: song.value })}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span>{song.score}</span>
                    <Button variant="outline" size="icon" onClick={() => handleDownvote({songTitle: song.value })}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => changeSong()}>
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Add Song Form */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Add YouTube Video to Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="Paste YouTube URL here"
                value={songUrl}
                onChange={(e) => setSongUrl(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" onClick={handleAddSong}>Add Video</Button>
            </div>
          </CardContent>
        </Card>

        {/* YouTube Player */}
        <Card className="md:col-span-3">
          <CardContent className="py-6">
          <div className="aspect-video w-full relative">
            <div id="youtube-player" className="absolute inset-0"></div>
          </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="text-lg font-semibold">{currentSong?.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentSong?.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => playNextSong()}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
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