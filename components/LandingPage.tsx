"use client"
import { Moon, Sun, Music, Users, ThumbsUp, ThumbsDown, PlayCircle, PauseCircle, SkipForward, Headphones, Share2, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'

const LandingPage = () => {
    const { theme, setTheme } = useTheme();
    const isDarkMode = theme === 'dark' ? true : false;
    
    return (
    <div className={`min-h-screen flex flex-col`}>
      <div className="bg-white dark:bg-neutral-950 flex-grow transition-colors duration-300">
        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-24">
          <section className="text-center max-w-3xl">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Listen Together, Anywhere
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Create virtual rooms, sync music across devices, and enjoy a shared listening experience with friends in real-time. SyncStream brings people together through the power of music.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 bg-slate-800 hover:bg-slate-700 text-white">
              Get Started
            </Button>
          </section>

          <section className="grid md:grid-cols-2 gap-12 w-full max-w-4xl">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
                Key Features
              </h3>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <Music className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Create and Join Rooms</h4>
                    <p>Generate unique room IDs or links for private listening sessions with friends.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <PlayCircle className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Synchronized Playback</h4>
                    <p>Experience perfectly synced music across all devices in the room, controlled by the host.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Democratic Playlist Management</h4>
                    <p>Vote on songs to influence the play order, ensuring everyone's preferences are considered.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Real-time Interaction</h4>
                    <p>See who's in the room, what they're voting on, and which songs they're adding to the playlist.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
                How It Works
              </h3>
              <ol className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold">Create or Join a Room</h4>
                    <p>Start your own listening session or join an existing one with a unique room ID.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold">Build the Playlist</h4>
                    <p>Add your favorite songs to the shared playlist from various music sources.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold">Vote and Influence</h4>
                    <p>Upvote or downvote songs to affect their position in the play queue.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold">Enjoy Together</h4>
                    <p>Listen in perfect sync with your friends, no matter where you are.</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="text-center max-w-3xl">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Why Choose SyncStream?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Headphones className="h-12 w-12 text-blue-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Seamless Sync</h4>
                <p className="text-gray-600 dark:text-gray-300">Experience lag-free, perfectly synchronized playback across all devices.</p>
              </div>
              <div className="flex flex-col items-center">
                <Share2 className="h-12 w-12 text-blue-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h4>
                <p className="text-gray-600 dark:text-gray-300">Invite friends with a simple link or room code, no complicated setup required.</p>
              </div>
              <div className="flex flex-col items-center">
                <Lock className="h-12 w-12 text-blue-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Private Sessions</h4>
                <p className="text-gray-600 dark:text-gray-300">Create password-protected rooms for exclusive listening experiences.</p>
              </div>
            </div>
          </section>

          <section className="text-center max-w-3xl">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Ready to Start Your Shared Listening Experience?
            </h3>
            <Button size="lg" className="text-lg px-8 py-6 bg-slate-800 hover:bg-slate-700 text-white">
              Create a Room Now
            </Button>
          </section>
        </main>
      </div>
    </div>
    )
}

export default LandingPage;