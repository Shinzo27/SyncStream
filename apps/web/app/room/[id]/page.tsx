'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, ThumbsDown, Play, Pause, SkipForward, Crown, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketProvider'
import { useSession } from 'next-auth/react'

const initialUsers = [
  { id: 1, name: 'Alice', avatar: '/placeholder.svg?height=32&width=32', isHost: true },
  { id: 2, name: 'Bob', avatar: '/placeholder.svg?height=32&width=32', isHost: false },
  { id: 3, name: 'Charlie', avatar: '/placeholder.svg?height=32&width=32', isHost: false },
]

const initialSongs = [
  { id: 1, title: 'YouTube Video 1', artist: 'Artist 1', youtubeId: 'dQw4w9WgXcQ', upvotes: 5, downvotes: 1 },
  { id: 2, title: 'YouTube Video 2', artist: 'Artist 2', youtubeId: 'ZZ5LpwO-An4', upvotes: 3, downvotes: 0 },
  { id: 3, title: 'YouTube Video 3', artist: 'Artist 3', youtubeId: '9bZkp7q19f0', upvotes: 2, downvotes: 1 },
]

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const id = React.use(params);
  const roomId = id.id;
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(initialSongs[0])
  const [songs, setSongs] = useState(initialSongs)
  const [users, setUsers] = useState(initialUsers)
  const [newSongUrl, setNewSongUrl] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const router = useRouter()
  const { socket } = useSocket()
  const session = useSession()
  const playerRef = useRef<any>(null)

  const currentUser = users.find(user => user.isHost) || users[0]

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
        },
        videoId: currentSong.youtubeId,
        events: {
          onReady: (event: any) => {
            setPlayer(event.target)
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              setIsPlaying(false)
            } else if (event.data === (window as any).YT.PlayerState.ENDED) {
              playNextSong()
            }
          },
        },
      })
    }
  }, [])

  const playNextSong = () => {
    console.log("Next song called!");
  }

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    }
  }

  const addSong = (event: React.FormEvent) => {
    event.preventDefault()
    const youtubeId = extractYoutubeId(newSongUrl)
    if (youtubeId) {
      const newSong = {
        id: songs.length + 1,
        title: `YouTube Video ${songs.length + 1}`,
        artist: 'Unknown Artist',
        youtubeId: youtubeId,
        upvotes: 0,
        downvotes: 0
      }
      setSongs([...songs, newSong])
      setNewSongUrl('')
    } else {
      alert('Invalid YouTube URL')
    }
  }

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const vote = (songId: number, isUpvote: boolean) => {
    setSongs(songs.map(song => {
      if (song.id === songId) {
        if (isUpvote) {
          return { ...song, upvotes: song.upvotes + 1 }
        } else {
          return { ...song, downvotes: song.downvotes + 1 }
        }
      }
      return song
    }))
  }

  const leaveRoom = () => {
    
    router.push('/')
  }

  const removeSong = (songId: number) => {
    setSongs(songs.filter(song => song.id !== songId))
  }

  const removeUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const changeSong = (song: typeof currentSong) => {
    setCurrentSong(song)
    if (player) {
      player.loadVideoById(song.youtubeId)
    }
  }

  useEffect(()=> {
    if (socket) {
      socket.on("disconnect", (data) => {
        console.log("Socket disconnected!");
        fetch(`/api/leaveRoom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: roomId as string, 
            user: session?.data?.user.name as string,
          }),
        })
        router.push('/')
      })
    }
  })

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
            <Button 
              variant="default" 
              className="w-full mt-4 bg-slate-800 dark:bg-red-700 text-white" 
              onClick={leaveRoom}
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
                    <Button variant="outline" size="icon" onClick={() => changeSong(song)}>
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
            <form onSubmit={addSong} className="flex space-x-2">
              <Input
                type="url"
                placeholder="Paste YouTube URL here"
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">Add Video</Button>
            </form>
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
                <h3 className="text-lg font-semibold">{currentSong.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentSong.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => changeSong(songs[(songs.findIndex(s => s.id === currentSong.id) + 1) % songs.length])}>
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
