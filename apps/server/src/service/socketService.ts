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
            socket.on("disconnect", (roomId) => {
                console.log("Socket Disconnected!");
                socket.disconnect()
            });

            socket.on('joinRoom', async({roomId, username})=> {
                try {
                    console.log("room id " + roomId)
                    console.log("username " + username)
                    const userKey = `room:${roomId}:users`
                    await redis.sAdd(userKey, username)

                    socket.join(roomId)
                    const user = await redis.sMembers(userKey)
                    io.to(roomId).emit('joinRoom', {username, user})

                    console.log(`${username} joined room ${roomId}`)
                } catch (error) {
                    console.log(error); 
                }
            })
            
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;