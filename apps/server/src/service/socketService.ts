import { Server } from 'socket.io';
import redis from './redisService';

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Socket Connected!");
        this._io = new Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
            }
        });
    }

    public initListener() {
        const io = this._io;

        io.on("connect", (socket) => {
            console.log("Socket Connected!");

            socket.on('joinRoom', async({roomId, username})=> {
                try {
                    console.log("room id " + roomId)
                    console.log("username " + username)
                    const userKey = `room:${roomId}:users`
                    await redis.sAdd(userKey, username)

                    socket.join(roomId)
                    const data = await fetch(`http://localhost:3000/api/getUsers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ roomId: roomId }),
                    });
                    const json = await data.json();
                    console.log(json)
                    const user = json.users;
                    console.log(user)
                    io.to(roomId).emit('joinRoom', {username, user})

                    console.log(`${username} joined room ${roomId}`)
                } catch (error) {
                    console.log(error); 
                }
            })

            socket.on('leaveRoom', async({roomId, username}: { roomId: string, username: string })=> {
                console.log("Leave room " + roomId + " by " + username)
                const userKey = `room:${roomId}:users`
                await redis.sRem(userKey, username)
                const users = await redis.sMembers(userKey)
                const data = await fetch(`http://localhost:3000/api/leaveRoom`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: roomId, user: username }),
                });
                const json = await data.json();
                const user = json.roomUsers;
                console.log(user)
                socket.leave(roomId)
                io.to(roomId).emit("leaveRoom", {username, user}) 
            })

            socket.on('checkRoom', async(roomId: string) => {
                const data = await fetch(`http://localhost:3000/api/getUsers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ roomId: roomId }),
                });
                const json = await data.json();
                const users = json.users;
                io.to(roomId).emit("checkRoom", {users, current_song: null})
            })

            socket.on("addSong", async ({ roomId, song }) => {
                const votekey = `room:${roomId}:votes`
                const currentSongKey = `room:${roomId}:current_song`;

                const current_song = await redis.get(currentSongKey)

                if(!current_song){
                    await redis.set(currentSongKey, song)
                }

                const newCurrentSong = await redis.get(currentSongKey)

                await redis.zAdd(votekey, { score: 0, value: song });

                const songs = await redis.zRangeWithScores(votekey, 0, -1, { REV: true });
                io.to(roomId).emit('currentSong', newCurrentSong)
                io.to(roomId).emit('addSong', {songs, currentSong: newCurrentSong})
            })
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;