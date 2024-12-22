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
                    const user = await redis.sMembers(userKey)
                    console.log("Event emmited")
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
                socket.leave(roomId)
                io.to(roomId).emit("leaveRoom", {roomId, username, users})
            })

            socket.on('checkRoom', async(roomId: string) => {             
                const userKey = `room:${roomId}:users`
                const users = await redis.sMembers(userKey)
                io.to(roomId).emit("checkRoom", {users})
            })
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;